import type { GameState } from '../store/gameStore';

export interface GameEvent {
    id: string;
    type: 'notification' | 'choice' | 'quest';
    title: string;
    description: string;
    choices?: {
        label: string;
        action: (state: GameState) => Partial<GameState>; // Return state updates
    }[];
}

export const checkRandomEvents = (state: any): GameEvent | null => {
    const { stress, luck, age, isStudent, spouse, children, cash, intelligence, jobTitle } = state.player;
    const r = Math.random() * 100; // 0-100

    // ------------------------------------------------------------
    // [EVT-CAR-01] Business Proposal (Startup Route)
    // Trigger: Age >= 22, Int >= 50, Cash >= 50m, Not already Founder
    // ------------------------------------------------------------
    if (age >= 22 && intelligence >= 50 && cash >= 50000000 && !jobTitle.includes('Founder') && r < 5) {
        return {
            id: `startup-${Date.now()}`,
            type: 'choice',
            title: 'Business Opportunity',
            description: 'A friend proposes a startup idea.\nIt requires capital but has high potential.',
            choices: [
                {
                    label: 'Invest & Found (Cost: 50m)',
                    action: (s) => ({
                        player: {
                            ...s.player,
                            cash: s.player.cash - 50000000,
                            jobTitle: 'Founder (Seed)',
                            reputation: s.player.reputation + 10,
                            stress: s.player.stress + 20
                        },
                        feedback: { id: Date.now(), text: "Founded Startup!", color: "text-purple-500" }
                    })
                },
                {
                    label: 'Decline',
                    action: (s) => ({})
                }
            ]
        };
    }

    // ------------------------------------------------------------
    // [EVT-FAM-01] Marriage Proposal
    // Trigger: Age >= 30, Single, Random Chance (Luck based)
    // ------------------------------------------------------------
    if (age >= 30 && !spouse && r < (2 + luck * 0.2)) { // Base 2% + up to 2% from Luck
        const candidates = [
            { name: 'Ji-won', job: 'Doctor', salary: 5000000, cost: 50000000 },
            { name: 'Min-jun', job: 'Teacher', salary: 3000000, cost: 20000000 },
            { name: 'Unknown', job: 'Artist', salary: 1500000, cost: 5000000 }, // Low cost, low income
        ];
        const partner = candidates[Math.floor(Math.random() * candidates.length)];

        return {
            id: `marriage-${Date.now()}`,
            type: 'choice',
            title: 'Marriage Proposal',
            description: `You met ${partner.name} (${partner.job}).\nThey want to settle down.\n(Cost: ${partner.cost.toLocaleString()} ₩)`,
            choices: [
                {
                    label: 'Propose!',
                    action: (s) => {
                        if (s.player.cash < partner.cost) {
                            return { feedback: { id: Date.now(), text: "Not enough money!", color: "text-red-500" } };
                        }
                        return {
                            player: {
                                ...s.player,
                                cash: s.player.cash - partner.cost,
                                spouse: { name: partner.name, job: partner.job, salary: partner.salary },
                                reputation: s.player.reputation + 5,
                                stress: Math.max(0, s.player.stress - 10)
                            },
                            feedback: { id: Date.now(), text: "Just Married!", color: "text-pink-500" }
                        };
                    }
                },
                {
                    label: 'Not now',
                    action: (s) => ({
                        player: { ...s.player, stress: s.player.stress + 5 }, // Breakup stress
                        feedback: { id: Date.now(), text: "Stayed Single.", color: "text-gray-400" }
                    })
                }
            ]
        };
    }

    // ------------------------------------------------------------
    // [EVT-FAM-02] Child Birth
    // Trigger: Married, Age < 45, Children < 2, Random Chance
    // ------------------------------------------------------------
    if (spouse && children < 2 && age < 45 && r < 5) { // 5% chance per week? Too high. 5% per check? This check is weekly.
        // Let's make it lower: 0.5% per week ~ 2% per month ~ 25% per year
        if (Math.random() * 100 < 10) { // 10% of the 5% chance? No.
            // Re-roll for rarer event
        } else {
            // Skip
        }
    }

    // Let's revise probability: Weekly check.
    // 1 year = 48 weeks.
    // We want ~1 child every few years. 1% per week => 40% per year. Reasonable.
    if (spouse && children < 2 && age < 45 && r < 1) {
        return {
            id: `child-${Date.now()}`,
            type: 'notification',
            title: 'New Family Member!',
            description: `Congratulations! You had a beautiful baby.\n(Max Power +10, Monthly Expense +1M)`,
            choices: [{
                label: 'Wonderful!',
                action: (s) => ({
                    maxPower: s.maxPower + 10,
                    player: {
                        ...s.player,
                        children: s.player.children + 1,
                        stress: s.player.stress + 10 // Parenting stress
                    }
                })
            }]
        };
    }


    // ------------------------------------------------------------
    // [EVT-ST-01] Health Warning (Sick)
    // Ref: events_reference.md -> Student Phase / General
    // Trigger: High Stress (> 40), 20% Chance
    // ------------------------------------------------------------
    if (stress > 40 && r < 20) {
        return {
            id: `sick-${Date.now()}`,
            type: 'notification',
            title: 'WARNING: Health Critical',
            description: 'You are extremely stressed. You collapsed and lost 1 week.\n(Stamina -2, Stress -10)',
        };
    }

    // ------------------------------------------------------------
    // [EVT-GN-01] Lucky Wallet
    // Ref: events_reference.md -> General Events
    // Restriction: NOT Student (Students have no economy)
    // Trigger: Base 1% + (Luck * 0.1%)
    // ------------------------------------------------------------
    const luckChance = 1 + (luck * 0.1);
    if (!isStudent && r < luckChance) {
        return {
            id: `lucky-${Date.now()}`,
            type: 'notification',
            title: 'LUCKY DAY!',
            description: 'You found a wallet on the street... and returned it to the owner.\nThey gave you a reward! (Cash +500,000, Reputation +5)',
        };
    }

    // ------------------------------------------------------------
    // [EVT-GN-02] Parents Visit
    // Ref: events_reference.md -> General Events
    // Restriction: Age < 30, NOT Student (for Economy interaction)
    // Trigger: Very Rare (Top 2% of Random roll)
    // ------------------------------------------------------------
    if (age < 30 && !isStudent && r > 98) {
        return {
            id: `parents-${Date.now()}`,
            type: 'choice',
            title: 'Parents Visited',
            description: 'Your parents came to visit. They look worried about your health.',
            choices: [
                {
                    label: 'Ask for Allowance',
                    action: (s) => ({ player: { ...s.player, cash: s.player.cash + 500000, reputation: s.player.reputation - 2 } })
                },
                {
                    label: 'Give Gift',
                    action: (s) => ({ player: { ...s.player, cash: s.player.cash - 200000, reputation: s.player.reputation + 5, stress: Math.max(0, s.player.stress - 5) } })
                }
            ]
        };
    }

    return null;
};

// ------------------------------------------------------------
// [EVT-ST-02] Academic Exam (Midterm/Final)
// Ref: events_reference.md -> Student Phase
// Trigger: Months 5, 7, 10, 12 (Start of Month)
// ------------------------------------------------------------
export const checkExamEvents = (state: any): GameEvent | null => {
    const { time, player } = state;

    // Condition: Student Only
    if (!player.isStudent) return null;

    const EXAM_MONTHS = [5, 7, 10, 12];

    // Trigger on Month Start (Week 1) of Exam Months
    // Note: time.week 1 means start of month? (Assuming 1-4 based on logic)
    if (time.week === 1 && EXAM_MONTHS.includes(time.month)) {

        // Scoring Formula
        // Score = (Base Int * 1.0) + (Study Units This Month * 2.0) + (Luck 0~10)
        // Note: 'allocation.study' replaced by 'monthlyActionCounts.study'
        const luckBonus = Math.floor(Math.random() * 11); // 0-10
        const studyEffort = player.monthlyActionCounts ? player.monthlyActionCounts.study : 0;

        const rawScore = (player.intelligence * 1.0) + (studyEffort * 2.0) + luckBonus;
        // Normalize? Or just use raw score? 
        // Docs say "Top 5%". Let's assume absolute score thresholds for simulation simplicity.
        // Or assume percentile based on score?
        // Let's use strict thresholds from Doc/Reference.
        // Reference says: "Top 5% (Score > 90)", "Top 10% (80)", "Top 50% (50)".
        // Max Int ~99. So score can easily be > 100. Let's cap at 100 or just use value?
        // Let's assume Score is 0-100 scale.
        const score = Math.min(100, Math.round(rawScore));

        let title = "Exam Results";
        let desc = `You took the exam.\nScore: ${score} (Int: ${player.intelligence}, Effort: ${studyEffort})`;
        let rewardAction = (s: GameState) => ({});

        // Rewards
        if (score >= 90) {
            title = "Top 5%! Scholarship!";
            desc += "\n\nReward: 1,000,000 Cash + Debt Waiver Ticket!";
            rewardAction = (s) => ({
                player: {
                    ...s.player,
                    cash: s.player.cash + 1000000,
                    debtWaiverTickets: (s.player.debtWaiverTickets || 0) + 1,
                    reputation: s.player.reputation + 2
                }
            });
        } else if (score >= 80) {
            title = "Top 10%! Outstanding!";
            desc += "\n\nReward: 1,000,000 Cash.";
            rewardAction = (s) => ({
                player: {
                    ...s.player,
                    cash: s.player.cash + 1000000,
                    reputation: s.player.reputation + 1
                }
            });
        } else if (score > 50) {
            title = "Passed (Average)";
            desc += "\n\nYou did okay. No special reward.";
            rewardAction = (s) => ({});
        } else {
            title = "Failed (Bottom 50%)";
            desc += "\n\nYour parents scolded you.\n(Stress +10)";
            rewardAction = (s) => ({
                player: {
                    ...s.player,
                    stress: s.player.stress + 10
                }
            });
        }

        return {
            id: `exam-${time.year}-${time.month}`,
            type: 'notification',
            title: title,
            description: desc,
            choices: [{
                label: "Confirm",
                action: rewardAction
            }]
        };
    }

    return null;
};

// ------------------------------------------------------------
// [EVT-ST-03] Making Friends (Social)
// Ref: events_reference.md -> Student Phase
// ------------------------------------------------------------
const FRIEND_ARCHETYPES = [
    { id: 'honor_student', name: 'Honor Student (모범생)', desc: 'Study Efficiency +50%, Study Stress +2' },
    { id: 'delinquent', name: 'Delinquent (날나리)', desc: 'Stress Relief +5, INT Gain -1' },
    { id: 'athlete', name: 'Athlete (운동부)', desc: 'Max Power +10, Study Stress +1' },
    { id: 'influencer', name: 'Influencer (인싸)', desc: 'Monthly Rep +1, Max Power -5' },
    { id: 'gamer', name: 'Gamer (겜돌이)', desc: 'Game Eff +50%, STA Gain -1' },
    { id: 'rich_kid', name: 'Rich Kid (금수저)', desc: 'Monthly Cash +100k, Rep -1' },
    { id: 'bookworm', name: 'Bookworm (문학소년)', desc: 'Monthly INT +1, Sense -1' },
    { id: 'artist', name: 'Artist (예술가)', desc: 'Sense Gain +1, Monthly Cash -50k' },
    { id: 'gossiper', name: 'Gossiper (소식통)', desc: 'Luck +5, Stress +2' },
    { id: 'slacker', name: 'Slacker (베짱이)', desc: 'Stress Gain -2, All Gains -10%' },
];

export const checkFriendEvents = (state: any): GameEvent | null => {
    const { time, player } = state;

    if (!player.isStudent) return null;

    // Trigger Conditions
    const isGuaranteed = (time.year === 2024 && time.month === 3 && time.week === 1 && player.friendHistory.length === 0);
    const isRandom = Math.random() < 0.05;

    if (!isGuaranteed && !isRandom) return null;

    // Select New Friend Candidate
    const available = FRIEND_ARCHETYPES.filter(f => !player.friendHistory.includes(f.id) && !player.friends.includes(f.id));
    if (available.length === 0) return null;

    const candidate = available[Math.floor(Math.random() * available.length)];
    const currentFriends = player.friends;

    // Helper: Grudge Effect
    const applyGrudge = (s: GameState, sourceName: string) => {
        const senLoss = Math.floor(Math.random() * 4) + 2; // 2-5
        const repLoss = Math.floor(Math.random() * 4) + 2; // 2-5
        const newPlayer = { ...s.player };
        newPlayer.sense = Math.max(0, newPlayer.sense - senLoss);
        newPlayer.reputation = Math.max(0, newPlayer.reputation - repLoss);

        return {
            player: newPlayer,
            feedback: { id: Date.now(), text: `Grudge from ${sourceName}! (Sen -${senLoss}, Rep -${repLoss})`, color: 'text-red-500' }
        };
    };

    // Helper: Add Friend
    const addFriend = (s: GameState, friendId: string) => {
        return {
            player: {
                ...s.player,
                friends: [...s.player.friends, friendId],
                friendHistory: [...s.player.friendHistory, friendId]
            },
            feedback: { id: Date.now(), text: `New Friend Added!`, color: 'text-green-500' }
        };
    };

    // Choices
    let choices = [];

    // Case A: Slots Available (< 2)
    if (currentFriends.length < 2) {
        choices.push({
            label: "Become Friends",
            action: (s: GameState) => addFriend(s, candidate.id)
        });
        choices.push({
            label: "Reject",
            action: (s: GameState) => {
                // 20% Grudge Chance
                if (Math.random() < 0.2) return applyGrudge(s, candidate.name);
                return { player: { ...s.player, friendHistory: [...s.player.friendHistory, candidate.id] } }; // No grudge, but recorded
            }
        });
    }
    // Case B: Slots Full (== 2)
    else {
        // Swap Options
        currentFriends.forEach((fid: string) => {
            const friendName = FRIEND_ARCHETYPES.find(f => f.id === fid)?.name || fid;
            choices.push({
                label: `Replace ${friendName}`,
                action: (s: GameState) => {
                    // 50% Grudge from Old Friend
                    let updates: any = {
                        player: {
                            ...s.player,
                            friends: s.player.friends.map((id: string) => id === fid ? candidate.id : id), // Replace
                            friendHistory: [...s.player.friendHistory, candidate.id]
                        }
                    };

                    if (Math.random() < 0.5) {
                        const grudgeUpdates = applyGrudge(s, friendName);
                        updates.player = { ...updates.player, ...grudgeUpdates.player };
                        updates.feedback = grudgeUpdates.feedback;
                    } else {
                        updates.feedback = { id: Date.now(), text: `Swapped friends peacefully.`, color: 'text-blue-500' };
                    }
                    return updates;
                }
            });
        });

        // Reject New
        choices.push({
            label: "Reject New Friend",
            action: (s: GameState) => {
                // 20% Grudge from New Candidate
                if (Math.random() < 0.2) return applyGrudge(s, candidate.name);
                return { player: { ...s.player, friendHistory: [...s.player.friendHistory, candidate.id] } };
            }
        });
    }

    return {
        id: `friend-${Date.now()}`,
        type: 'choice',
        title: 'Making Friends?',
        description: `${candidate.name} wants to be your friend.\n\nOnly 2 Best Friends allowed.\nEffect: ${candidate.desc}`,
        choices: choices
    };
};
