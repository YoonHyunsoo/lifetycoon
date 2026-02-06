import { create } from 'zustand';
import { getActionCost } from '../lib/gameLogic';
import { useEventStore } from './eventStore';
import type { GameEvent } from './eventStore';
// import type { Stock } from '../lib/stockLogic';
import { INITIAL_STOCKS, updateStockPrices } from '../lib/stockLogic';
// import { saveGame } from '../lib/saveSystem';
import { getMonthlyExpenses, checkPromotion, checkFiring, checkCompanyEvent } from '../lib/jobLogic';
import { checkRandomEvents, checkExamEvents, checkFriendEvents, checkDatingEvent, checkExpandedRandomEvents } from '../lib/eventLogic';
import type { GameState } from '../types/gameTypes';

/* EXTENDING GameState Locally if not in Types file yet, or just rely on module augmentation? 
   Let's check gameTypes.ts first? No, I'll just cast/assume it works for now or edit Types.
   Actually, better to edit Types first to be safe. */

console.log('Loading gameStore.ts...'); // DEBUG

export const useGameStore = create<GameState>((set, get) => {
    console.log('Creating GameStore...'); // DEBUG
    return {

        // ... (existing state) ...

        player: {
            name: 'Player',
            age: 17,
            jobTitle: 'High School Student',
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
            hasRevived: false, // [MONETIZATION]
            tutorialFlags: { study: false, exercise: false, club: false, rest: false },
            monthlyActionCounts: { study: 0, exercise: 0, club: 0, rest: 0 }
        },
        time: { year: 2024, month: 3, week: 1 },
        power: 100,
        maxPower: 100,
        stocks: INITIAL_STOCKS,
        insiderHint: null, // [MONETIZATION]
        feedback: null,
        currentVisualAction: null, // [VISUAL] For character animation

        isPlaying: false,

        clearFeedback: () => set({ feedback: null }),

        initializeGame: (name, stats) => set({
            player: {
                name,
                age: 17,
                jobTitle: 'High School Student', // EN for now
                isStudent: true,
                cash: 0,
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
                hasRevived: false, // [MONETIZATION]
                tutorialFlags: { study: false, exercise: false, club: false, rest: false },
                monthlyActionCounts: { study: 0, exercise: 0, club: 0, rest: 0 }
            },
            time: { year: 2024, month: 3, week: 1 },
            stocks: INITIAL_STOCKS
        }),

        setCareer: (path: 'job' | 'college' | 'cert') => set((state) => {
            let newJobTitle = state.player.jobTitle;
            let isStudent = false;
            let cashUpdate = state.player.cash;
            // let debtUpdate = ... (If we tracked debt separately, but we can just deduct or track in a variable) 
            // Current simplified debt: Just a negative cash event or separate var? 
            // Docs say "Debt -50m". Let's deduct 50m cash? Or track 'debt'?
            // Let's just deduct cash for simplicity as "Tuition Loan" (negative cash is allowed?)
            // Or better, set 'debt'. But player struct doesn't have debt.
            // Let's just assume negative cash for now or just log it. 
            // The prompt says "Debt -50m". Let's remove 50m from cash.

            if (path === 'college') {
                newJobTitle = 'College Student';
                isStudent = true; // College is still student-like
                // Tuition
                cashUpdate -= 50000000;
            } else if (path === 'cert') {
                newJobTitle = 'Job Seeker';
                isStudent = false;
            } else if (path === 'job') {
                // Determine Job based on Stats
                // Check Elite -> Regular -> Intern -> Part-timer
                const { intelligence, sense } = state.player;

                if (intelligence >= 70 && sense >= 60) newJobTitle = 'Elite (S-Corp)';
                else if (intelligence >= 40 && sense >= 40) newJobTitle = 'Employee (A-Corp)';
                else if (intelligence >= 20 && sense >= 20) newJobTitle = 'Intern (B-Corp)';
                else newJobTitle = 'Part-timer (C-Corp)';

                isStudent = false;
            }

            return {
                player: {
                    ...state.player,
                    jobTitle: newJobTitle,
                    isStudent,
                    cash: cashUpdate
                },
                feedback: { id: Date.now(), text: `Path Chosen: ${newJobTitle}`, color: "text-yellow-400" }
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

                    // [JOB LOGIC] Firing & Bonuses (Monthly)
                    if (!state.player.isStudent && state.player.jobTitle !== 'Job Seeker') {
                        // 1. Firing Check
                        const firedReason = checkFiring(state.player.jobTitle, state.player.reputation, state.player.stress, Math.random() * 100);
                        if (firedReason) {
                            triggerEvent({
                                id: `fired-${newYear}-${newMonth}`,
                                type: 'notification',
                                title: "YOU ARE FIRED!",
                                description: `Reason: ${firedReason}\nYou are now a Job Seeker.`,
                            });
                            // Handle Firing State Change immediately (hacky but works)
                            // Ideally choice action does it, but notification is easier
                            state.player.jobTitle = 'Job Seeker';
                        }

                        // 2. Bonus Check
                        const companyEvt = checkCompanyEvent(state.player.jobTitle, Math.random() * 100);
                        if (companyEvt && companyEvt.type === 'bonus') {
                            triggerEvent({
                                id: `bonus-${newYear}-${newMonth}`,
                                type: 'notification',
                                title: "COMPANY BONUS",
                                description: `Performance Bonus Received!\n+${companyEvt.value.toLocaleString()} ₩`,
                            });
                            monthlyIncome += companyEvt.value; // Add to this month's income
                        }
                    }

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

                    // [AGE PENALTY] Stamina Decay
                    // 17~25: -5, 26~39: -10, 40+: -20
                    let staminaPenalty = 0;
                    if (newAge <= 25) staminaPenalty = 5;
                    else if (newAge <= 39) staminaPenalty = 10;
                    else staminaPenalty = 20;

                    const decayedStamina = Math.max(0, state.player.stamina - staminaPenalty);

                    // Trigger Age Event
                    triggerEvent({
                        id: `newyear-${newYear}`,
                        type: 'notification',
                        title: `Happy New Year ${newYear}!`,
                        description: `You are now ${newAge} years old.\nPhysical decline: Stamina -${staminaPenalty}`,
                    });
                    state.player.stamina = decayedStamina; // Direct Update for next set call


                    // [STOCK] Update Prices
                    const newStocks = updateStockPrices(state.stocks, state.insiderHint);
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
                        insiderHint: null, // [MONETIZATION] Consumed hint for the year
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

            // [NEW] Expanded Random Events
            const expandedEvt = checkExpandedRandomEvents({ player: { ...state.player } });
            if (expandedEvt) triggerEvent(expandedEvt as GameEvent);

            // [NEW] Dating Logic
            if (!state.player.isStudent) {
                const datingEvt = checkDatingEvent({ player: { ...state.player } });
                if (datingEvt) triggerEvent(datingEvt as GameEvent);
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

            if (!state.isPlaying) {
                console.warn('Game is paused!');
                set({ feedback: { id: Date.now(), text: "PAUSED! Press ▶ to Play", color: "text-yellow-500", icon: "⏸️" } });
                return;
            }

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
                    newPlayer.intelligence += 3;
                    newPlayer.stress += 5;
                    fbText = "+3 Intelligence, +5 Stress";
                    fbColor = "text-blue-400";
                    set({ feedback: { id: Date.now(), text: fbText, color: fbColor, icon: "📖" } });
                    break;
                case 'exercise':
                    newPlayer.stamina += 2;
                    newPlayer.stress += 3;
                    fbText = "+2 Stamina, +3 Stress";
                    fbColor = "text-green-400";
                    set({ feedback: { id: Date.now(), text: fbText, color: fbColor, icon: "💪" } });
                    break;
                case 'club': // UI: Play
                    newPlayer.sense += 2;
                    newPlayer.intelligence = Math.max(0, newPlayer.intelligence - 1); // Int Penalty
                    fbText = "+2 Sense, -1 Int";
                    fbColor = "text-purple-400";
                    set({ feedback: { id: Date.now(), text: fbText, color: fbColor, icon: "🎮" } });
                    break;
                case 'rest':
                    newPlayer.stress = Math.max(0, newPlayer.stress - 10);
                    fbText = "Stress -10";
                    fbColor = "text-yellow-400";
                    set({ feedback: { id: Date.now(), text: fbText, color: fbColor, icon: "💤" } });
                    break;

                // --- JOB ACTIONS ---
                case 'work': // Work/Intern
                    newPlayer.reputation += 2;
                    newPlayer.stress += 4;
                    fbText = "+2 Rep, +4 Stress";
                    fbColor = "text-blue-300";
                    set({ feedback: { id: Date.now(), text: fbText, color: fbColor, icon: "💼" } });
                    break;
                case 'overtime': // Hard Work
                    newPlayer.reputation += 4;
                    newPlayer.stress += 8;
                    // Note: Money is monthly, but maybe small bonus? No, keep it monthly for now.
                    fbText = "+4 Rep, +8 Stress";
                    fbColor = "text-red-400";
                    set({ feedback: { id: Date.now(), text: fbText, color: fbColor, icon: "🔥" } });
                    break;
                case 'politics':
                    newPlayer.sense += 2;
                    newPlayer.reputation += 1;
                    newPlayer.stress += 3;
                    fbText = "+2 Sense, +1 Rep";
                    fbColor = "text-purple-300";
                    set({ feedback: { id: Date.now(), text: fbText, color: fbColor, icon: "🤝" } });
                    break;

                // --- COLLEGE ACTIONS ---
                case 'major_study':
                    newPlayer.intelligence += 4; // Better than normal study
                    newPlayer.stress += 4;
                    fbText = "+4 Int, +4 Stress";
                    fbColor = "text-blue-500";
                    set({ feedback: { id: Date.now(), text: fbText, color: fbColor, icon: "🎓" } });
                    break;
                case 'part_time':
                    newPlayer.cash += 300000; // Instant Cash for part time
                    newPlayer.stress += 5;
                    fbText = "+300k Cash, +5 Stress";
                    fbColor = "text-green-500";
                    set({ feedback: { id: Date.now(), text: fbText, color: fbColor, icon: "💵" } });
                    break;

                // --- JOB SEEKER ACTIONS ---
                case 'cert_study':
                    newPlayer.intelligence += 2;
                    newPlayer.reputation += 1; // Specs increase rep/hireability
                    newPlayer.stress += 5;
                    fbText = "+2 Int, +1 Rep (Spec)";
                    fbColor = "text-blue-400";
                    set({ feedback: { id: Date.now(), text: fbText, color: fbColor, icon: "✏️" } });
                    break;
                case 'cv':
                    newPlayer.sense += 3;
                    newPlayer.stress += 2;
                    fbText = "+3 Sense (CV)";
                    fbColor = "text-purple-400";
                    set({ feedback: { id: Date.now(), text: fbText, color: fbColor, icon: "📝" } });
                    break;
            }

            set({
                player: newPlayer,
                power: state.power - cost,
                currentVisualAction: actionType
            });

            // Clear visual action after 1.5s
            setTimeout(() => {
                set({ currentVisualAction: null });
            }, 1500);
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

        setTutorialFlag: (action) => set((state) => ({
            player: {
                ...state.player,
                tutorialFlags: {
                    ...state.player.tutorialFlags,
                    [action]: true
                }
            }
        })),

        // [MONETIZATION] Actions
        revivePlayer: () => set((state) => ({
            player: {
                ...state.player,
                stress: 0,
                cash: Math.max(0, state.player.cash), // Reset debt
                hasRevived: true,
                bankruptcyCount: state.player.bankruptcyCount
            },
            feedback: { id: Date.now(), text: "REVIVED! Second Chance!", color: "text-yellow-400" }
        })),

        getInsiderHint: () => {
            const state = get();
            const stocks = state.stocks;
            const targetStock = stocks[Math.floor(Math.random() * stocks.length)];
            const trend = Math.random() > 0.5 ? 'bull' : 'bear';

            set({
                insiderHint: { stockId: targetStock.id, trend },
                feedback: { id: Date.now(), text: `Insider Info Acquired: ${targetStock.name}`, color: "text-purple-400" }
            });
        }
    };
});
