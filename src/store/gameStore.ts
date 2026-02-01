import { create } from 'zustand';
import { getActionCost } from '../lib/gameLogic';
import { useEventStore } from './eventStore';
import type { GameEvent } from './eventStore';
import type { Stock } from '../lib/stockLogic';
import { INITIAL_STOCKS, updateStockPrices } from '../lib/stockLogic';
// import { saveGame } from '../lib/saveSystem';
import { getMonthlyExpenses, checkPromotion } from '../lib/jobLogic';
import { checkRandomEvents, checkExamEvents, checkFriendEvents } from '../lib/eventLogic';

export interface Quest {
    id: string;
    title: string;
    description: string;
    progress: number; // 0 to 100
    goal: number;
    reward: string;
}

interface PlayerState {
    name: string;
    age: number;
    jobTitle: string;
    isStudent: boolean;

    // Stats
    intelligence: number;
    stamina: number;
    sense: number;
    luck: number;

    // Status
    stress: number;
    reputation: number;

    // Assets
    cash: number;
    stockValue: number;
    bankruptcyCount: number;
    debtWaiverTickets: number; // For Student Exam Rewards

    // Social
    friends: string[]; // Active friends (max 2)
    friendHistory: string[]; // Encountered friends (prevent duplicates)
    activeQuests: Quest[]; // NEW: Active Quests

    // Family
    spouse: { name: string; job: string; salary: number } | null;
    children: number; // Count

    // Metrics for Exams
    monthlyActionCounts: {
        study: number;
        exercise: number;
        club: number;
        rest: number;
    };
}

interface TimeState {
    year: number; // Starts at 2026? Or purely relative? Let's use relative year count or actual year.
    month: number; // 1-12
    week: number; // 0-3
}

export interface GameState {
    player: PlayerState;
    time: TimeState;
    power: number; // Real-time Energy
    maxPower: number; // Max Energy (e.g. 100)
    stocks: Stock[];

    // Actions
    initializeGame: (name: string, stats: number[]) => void;
    advanceWeek: () => void;
    performAction: (actionType: string) => void;

    // Stock Actions
    buyStock: (id: number, amount: number) => void;
    sellStock: (id: number, amount: number) => void;

    // Career Actions
    setCareer: (path: 'job' | 'college' | 'cert') => void;

    // Automation & Controls
    isPlaying: boolean;
    // Removed allocation state
    togglePlay: () => void;

    // Core Tick
    processTick: () => void; // Handles Time
    recoverPower: () => void; // Handles Energy Recovery

    // Feedback
    feedback: { id: number; text: string; color: string; icon?: string } | null;
    clearFeedback: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
    player: {
        name: 'Player',
        age: 17,
        jobTitle: '고등학생',
        isStudent: true,
        intelligence: 5,
        stamina: 5,
        sense: 5,
        luck: 5,
        stress: 0,
        reputation: 0,
        cash: 0,
        stockValue: 0,
        bankruptcyCount: 0,
        debtWaiverTickets: 0, // [EVT-ST-02] Scholarship Reward
        friends: [],
        friendHistory: [],
        activeQuests: [],
        spouse: null,
        children: 0,
        monthlyActionCounts: { study: 0, exercise: 0, club: 0, rest: 0 }
    },
    time: { year: 2024, month: 3, week: 1 },
    power: 100,
    maxPower: 100,
    stocks: INITIAL_STOCKS,
    feedback: null,

    isPlaying: false,

    clearFeedback: () => set({ feedback: null }),

    initializeGame: (name, stats) => set({
        player: {
            name,
            age: 17,
            jobTitle: 'High School Student', // EN for now
            isStudent: true,
            cash: 50000,
            stress: 0,
            intelligence: stats[0],
            stamina: stats[1],
            sense: stats[2],
            luck: stats[3],
            reputation: 0,
            stockValue: 0,
            bankruptcyCount: 0,
            friends: [],
            friendHistory: [],
            activeQuests: [],
            debtWaiverTickets: 0,
            spouse: null,
            children: 0,
            monthlyActionCounts: { study: 0, exercise: 0, club: 0, rest: 0 }
        },
        time: { year: 2024, month: 3, week: 1 },
        stocks: INITIAL_STOCKS
    }),

    setCareer: (path: 'job' | 'college' | 'cert') => set((state) => {
        let newJobTitle = state.player.jobTitle;
        let isStudent = false;

        if (path === 'college') {
            newJobTitle = 'College Student';
            isStudent = true;
            // Debt logic?
        } else if (path === 'cert') {
            newJobTitle = 'Job Seeker';
            isStudent = false;
        } else if (path === 'job') {
            // Simplified: Start as Intern if stats enough, else Part-timer
            newJobTitle = 'Intern (B-Corp)';
            isStudent = false;
        }

        return {
            player: { ...state.player, jobTitle: newJobTitle, isStudent }
        };
    }),

    advanceWeek: () => {
        const state = get();
        let newWeek = state.time.week + 1;
        let newMonth = state.time.month;
        let newYear = state.time.year;
        let newAge = state.player.age;
        // let newPower = state.power; // No longer reset
        const { triggerEvent } = useEventStore.getState();

        // Income & Expense Calculation (Monthly)
        let monthlyIncome = 0;
        let monthlyExpense = 0;
        let shouldResetCounts = false; // Flag for Exam Logic reset

        // Week 1, 2, 3, 4 -> Next is Reset
        if (newWeek > 4) {
            newWeek = 1;
            newMonth += 1; // It becomes next month
            shouldResetCounts = true; // New month = Reset counts

            // Economy: Income & Expenses
            if (state.player.age >= 20) {
                // Expenses
                monthlyExpense = getMonthlyExpenses(state.player.age, state.player.reputation, false) + (state.player.children * 1000000); // Child Expense

                // Income (Simplified)
                if (!state.player.isStudent && state.player.jobTitle.includes('Intern')) monthlyIncome = 2000000;
                if (!state.player.isStudent && state.player.jobTitle.includes('Part-timer')) monthlyIncome = 1500000;
                // Add more logic later
            }

            // Year transition
            if (newMonth > 12) {
                newMonth = 1;
                newYear += 1;
                newAge += 1;

                // [STOCK] Update Prices
                const newStocks = updateStockPrices(state.stocks);
                const currentStockValue = newStocks.reduce((acc, stock) => acc + (stock.price * stock.owned), 0);

                // [CAREER] Promotion Check
                let promotedTitle = null;
                if (!state.player.isStudent && state.player.jobTitle !== 'Job Seeker') {
                    promotedTitle = checkPromotion(
                        state.player.jobTitle,
                        state.player.reputation,
                        state.player.sense,
                        state.player.intelligence
                    );

                    if (promotedTitle) {
                        triggerEvent({
                            id: `promo-${newYear}`,
                            type: 'career',
                            title: 'PROMOTION!',
                            description: `You have been promoted to ${promotedTitle}!\nSalary Increased.`
                        });
                    }
                }

                // [EVENT] New Year: Stock Market
                triggerEvent({
                    id: `stock-${newYear}`,
                    type: 'stock',
                    title: 'Stock Market Open'
                });

                // [EVENT] 20+ Years old: Career Choice
                if (newAge === 20) {
                    triggerEvent({
                        id: 'career-20',
                        type: 'career',
                        title: 'Choose Path'
                    });
                }

                set({
                    stocks: newStocks,
                    player: {
                        ...state.player,
                        stockValue: currentStockValue,
                        jobTitle: promotedTitle || state.player.jobTitle
                    }
                });
            }
        }

        // Random Events (Weekly Check)
        const randomEvent = checkRandomEvents({ player: { ...state.player, age: newAge, stress: state.player.stress } });

        if (randomEvent) {
            triggerEvent(randomEvent as GameEvent);
        }

        // [Student Exam Check]
        const examEvent = checkExamEvents({
            time: { year: newYear, month: newMonth, week: newWeek },
            player: get().player, // Pass CURRENT player (with old counts)
        });

        if (examEvent) triggerEvent(examEvent as GameEvent);

        // [Student Friend Check]
        const friendEvent = checkFriendEvents({
            time: { year: newYear, month: newMonth, week: newWeek },
            player: { ...get().player, friends: state.player.friends, friendHistory: state.player.friendHistory }
        });
        if (friendEvent) triggerEvent(friendEvent as GameEvent);

        // Apply Economy
        let finalCash = state.player.cash + monthlyIncome - monthlyExpense;
        let finalBankruptcyCount = state.player.bankruptcyCount;

        // [ENDING] 1. Overwork Check
        if (state.player.stress >= 50) {
            triggerEvent({
                id: 'active-overwork',
                type: 'ending',
                title: 'HEALTH COLLAPSE',
                data: {
                    type: 'overwork',
                    age: state.player.age,
                    jobTitle: state.player.jobTitle,
                    assets: state.player.cash + state.player.stockValue
                }
            });
        }

        // [ENDING] 2. Retirement Check
        else if (newAge >= 60) {
            const currentStockVal = state.stocks.reduce((acc, stock) => acc + (stock.price * stock.owned), 0);
            triggerEvent({
                id: 'active-retirement',
                type: 'ending',
                title: 'HAPPY RETIREMENT',
                data: {
                    type: 'retirement',
                    age: newAge,
                    jobTitle: state.player.jobTitle,
                    assets: finalCash + currentStockVal
                }
            });
        }

        // [ENDING] 3. Bankruptcy Check
        else if (finalCash < 0) {
            if (state.player.bankruptcyCount === 0) {
                // First Time Rescue
                finalCash += 50000000; // 50m Rescue
                finalBankruptcyCount += 1;

                triggerEvent({
                    id: `rescue-${newYear}`,
                    type: 'normal',
                    title: 'FINANCIAL RESCUE',
                    description: 'You went bankrupt!\nYour parents stepped in to help one last time.\n(+50,000,000 ₩)',
                    choices: [{ label: 'Thank you...', action: () => ({}) }]
                });
            } else {
                // Second Time Game Over
                triggerEvent({
                    id: 'active-bankruptcy',
                    type: 'ending',
                    title: 'BANKRUPTCY',
                    data: {
                        type: 'bankruptcy',
                        age: newAge,
                        jobTitle: state.player.jobTitle,
                        assets: 0
                    }
                });
            }
        }

        set((prev) => ({
            time: { year: newYear, month: newMonth, week: newWeek },
            // power: newPower, // Power is managed by recoverPower
            player: {
                ...prev.player,
                age: newAge,
                cash: finalCash,
                bankruptcyCount: finalBankruptcyCount,
                stockValue: prev.stocks.reduce((acc, stock) => acc + (stock.price * stock.owned), 0),
                monthlyActionCounts: shouldResetCounts ? { study: 0, exercise: 0, club: 0, rest: 0 } : prev.player.monthlyActionCounts
            }
        }));
    },

    performAction: (actionType) => {
        const state = get();
        const baseCost = 10;
        const cost = getActionCost(baseCost, state.player.stress, state.player.stamina);

        if (state.power < cost) {
            console.warn('Not enough power!');
            set({ feedback: { id: Date.now(), text: "Not enough Power!", color: "text-red-500" } });
            return;
        }

        const newPlayer = { ...state.player };

        // Apply Effects
        let fbText = "";
        let fbColor = "text-white";
        // Increment count
        if (actionType in newPlayer.monthlyActionCounts) {
            const key = actionType as keyof typeof newPlayer.monthlyActionCounts;
            newPlayer.monthlyActionCounts = {
                ...newPlayer.monthlyActionCounts,
                [key]: newPlayer.monthlyActionCounts[key] + 1
            };
        }

        switch (actionType) {
            case 'study':
                newPlayer.intelligence += 1;
                newPlayer.stress += 2;
                fbText = "+1 Intelligence";
                fbColor = "text-blue-400";
                set({ feedback: { id: Date.now(), text: fbText, color: fbColor, icon: "📖" } });
                break;
            case 'exercise':
                newPlayer.stamina += 1;
                newPlayer.stress = Math.max(0, newPlayer.stress - 1);
                fbText = "+1 Stamina";
                fbColor = "text-red-400";
                set({ feedback: { id: Date.now(), text: fbText, color: fbColor, icon: "💪" } });
                break;
            case 'club':
                newPlayer.sense += 1;
                newPlayer.stress = Math.max(0, newPlayer.stress - 2);
                fbText = "+1 Sense";
                fbColor = "text-purple-400";
                set({ feedback: { id: Date.now(), text: fbText, color: fbColor, icon: "🎨" } });
                break;
            case 'rest':
                newPlayer.stress = Math.max(0, newPlayer.stress - 5);
                fbText = "Rest well...";
                fbColor = "text-green-400";
                set({ feedback: { id: Date.now(), text: fbText, color: fbColor, icon: "💤" } });
                break;
        }

        set({
            player: newPlayer,
            power: state.power - cost,
            // feedback set in switch for icons
        });
    },

    buyStock: (id, amount) => set((state) => {
        const stockIndex = state.stocks.findIndex(s => s.id === id);
        if (stockIndex === -1) return {};

        const stock = state.stocks[stockIndex];
        const cost = stock.price * amount;

        if (state.player.cash < cost) {
            alert("Not enough cash!");
            return {};
        }

        const newStocks = [...state.stocks];
        newStocks[stockIndex] = { ...stock, owned: stock.owned + amount };

        return {
            stocks: newStocks,
            player: {
                ...state.player,
                cash: state.player.cash - cost,
                stockValue: state.player.stockValue + cost
            }
        };
    }),

    sellStock: (id, amount) => set((state) => {
        const stockIndex = state.stocks.findIndex(s => s.id === id);
        if (stockIndex === -1) return {};

        const stock = state.stocks[stockIndex];
        if (stock.owned < amount) return {};

        const revenue = stock.price * amount;

        const newStocks = [...state.stocks];
        newStocks[stockIndex] = {
            ...stock,
            owned: stock.owned - amount,
            holdingYears: stock.owned - amount === 0 ? 0 : stock.holdingYears
        };
        if (stock.id === 4) newStocks[stockIndex].holdingYears = 0;

        return {
            stocks: newStocks,
            player: {
                ...state.player,
                cash: state.player.cash + revenue,
                stockValue: state.player.stockValue - revenue
            }
        };
    }),

    togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),

    processTick: () => {
        // Just advance time
        get().advanceWeek();
    },

    recoverPower: () => set((state) => {
        if (state.power >= state.maxPower) return {};
        // Recovery Rate: 1 per tick? 
        // If tick is 100ms, 1 per tick = 10 per sec.
        // Full bar (100) in 10 secs. Reasonable.
        return { power: Math.min(state.maxPower, state.power + 0.5) }; // Slow it down a bit: 0.5 per 100ms = 5 per sec = 20s for full bar.
    }),
}));
