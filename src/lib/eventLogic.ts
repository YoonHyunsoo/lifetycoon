import type { GameState } from '../types/gameTypes';
import type { GameEvent } from '../store/eventStore'; // [FIX] Use shared type

// Removed local interface GameEvent

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
                    action: (s: GameState) => ({
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
                    action: (_s: GameState) => ({})
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
                    action: (s: GameState) => {
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
                    action: (s: GameState) => ({
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
                action: (s: GameState) => ({
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
                    action: (s: GameState) => ({ player: { ...s.player, cash: s.player.cash + 500000, reputation: s.player.reputation - 2 } })
                },
                {
                    label: 'Give Gift',
                    action: (s: GameState) => ({ player: { ...s.player, cash: s.player.cash - 200000, reputation: s.player.reputation + 5, stress: Math.max(0, s.player.stress - 5) } })
                }
            ]
        };
    }

    return null;
};

// [NEW] Dating Logic
export const checkDatingEvent = (state: any): GameEvent | null => {
    const { player } = state;
    // Check if player has a GF in friends list
    // GF IDs from FRIEND_POOL: 'idol_gf', 'model_gf', 'popular_gf', 'cute_gf', 'childhood_gf'
    const gfId = player.friends.find((f: string) => f.includes('gf'));

    if (!gfId) return null;

    const r = Math.random() * 100;
    // 5% chance per week for a dating event if you have a GF (Reduced from 10%)
    if (r > 5) return null;

    // Event Pool
    const events = [
        {
            title: "Romantic Dinner",
            desc: "Your girlfriend wants to go to a fancy restaurant.",
            cost: 200000,
            stress: -10,
            rep: 0
        },
        {
            title: "Anniversary",
            desc: "It's your 100-day anniversary! Buy a gift?",
            cost: 500000,
            stress: -5,
            rep: 2
        },
        {
            title: "Travel Request",
            desc: "She wants to go on a weekend trip.",
            cost: 1000000,
            stress: -20,
            rep: 0
        }
    ];

    const evt = events[Math.floor(Math.random() * events.length)];

    return {
        id: `date-${Date.now()}`,
        type: 'date', // [NEW] Use specific type for Pink UI
        title: evt.title,
        description: `${evt.desc}\n(Cost: ${evt.cost.toLocaleString()} ₩)`,
        choices: [
            {
                label: "Accept (Love)",
                action: (s: GameState) => {
                    if (s.player.cash < evt.cost) return { feedback: { id: Date.now(), text: "Too poor...", color: "text-red-500" } };
                    return {
                        player: {
                            ...s.player,
                            cash: s.player.cash - evt.cost,
                            stress: Math.max(0, s.player.stress + evt.stress), // stress is negative here, so it reduces
                            reputation: s.player.reputation + evt.rep
                        },
                        feedback: { id: Date.now(), text: "Relationship Deepened!", color: "text-pink-500" }
                    };
                }
            },
            {
                label: "Reject (Fight)",
                action: (s: GameState) => ({
                    player: { ...s.player, stress: s.player.stress + 5 },
                    feedback: { id: Date.now(), text: "She is angry...", color: "text-red-500" }
                })
            }
        ]
    };
};

export const checkExpandedRandomEvents = (state: any): GameEvent | null => {
    const { player } = state;
    const r = Math.random() * 100;

    // 1. Economic - Crypto Boom (Rare: 0.5% - Reduced)
    if (r < 0.5 && !player.isStudent) {
        return {
            id: `crypto-${Date.now()}`,
            type: 'choice',
            title: "Crypto Boom!",
            description: "Your tech friend tips you off on a coin.",
            choices: [
                {
                    label: "Invest 1M (High Risk)",
                    action: (s: GameState) => {
                        if (s.player.cash < 1000000) return {};
                        const win = Math.random() > 0.5;
                        return {
                            player: { ...s.player, cash: s.player.cash + (win ? 5000000 : -1000000) },
                            feedback: { id: Date.now(), text: win ? "To the Moon! (+5M)" : "Rug Pull... (-1M)", color: win ? "text-green-500" : "text-red-500" }
                        };
                    }
                },
                { label: "Ignore", action: () => ({}) }
            ]
        };
    }

    // 2. Career - Bad Boss (Common: 2% if Employed - Reduced from 5%)
    if (!player.isStudent && player.jobTitle !== 'Job Seeker' && r < 2) {
        return {
            id: `badboss-${Date.now()}`,
            type: 'notification',
            title: "Toxic Boss",
            description: "Your boss blamed you for his mistake.\n(Stress +10)",
            choices: [{
                label: "Sigh...",
                action: (s: GameState) => ({ player: { ...s.player, stress: s.player.stress + 10 } })
            }]
        };
    }

    // 3. Social - Wedding Invitation (1.5% - Reduced from 3%)
    if (r < 1.5 && player.age > 25) {
        return {
            id: `wedding-${Date.now()}`,
            type: 'choice',
            title: "Wedding Invitation",
            description: "A colleague is getting married.\nCongratulatory money required.",
            choices: [
                {
                    label: "Pay 100k (Rep+1)",
                    action: (s: GameState) => ({ player: { ...s.player, cash: s.player.cash - 100000, reputation: s.player.reputation + 1 } })
                },
                {
                    label: "Skip (Rep-1)",
                    action: (s: GameState) => ({ player: { ...s.player, reputation: s.player.reputation - 1 } })
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
        let rewardAction = (_s: GameState) => ({});

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
            rewardAction = (_s) => ({});
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
// [EVT-ST-03] Friend System (Tiered & Future Investment)
// Ref: game_mechanics.md
// ------------------------------------------------------------

interface FriendArchetype {
    id: string;
    rank: 'S' | 'A' | 'B' | 'C' | 'D';
    type: 'girlfriend' | 'investment' | 'normal';
    name: string;
    desc: string;
    modifiers?: {
        maxPower?: number; // Immediate change
    };
}

const FRIEND_POOL: FriendArchetype[] = [
    // S Rank (Future Investment)
    { id: 'chaebol_heir', rank: 'S', type: 'investment', name: 'Chaebol Heir', desc: 'Student: Cost -50k/wk\nAdult: ??? (Huge Reward)' },
    { id: 'politician_jr', rank: 'S', type: 'investment', name: 'Politician Jr.', desc: 'Student: None\nAdult: Manager Job Guaranteed' },
    { id: 'genius', rank: 'S', type: 'investment', name: 'Genius', desc: 'Student: Stress +3/wk\nAdult: All Stats +10' },
    { id: 'idol_gf', rank: 'S', type: 'girlfriend', name: 'Idol GF', desc: 'Stress -20/wk, Max Power -40\nAdult: Reputation +50', modifiers: { maxPower: -40 } },

    // A Rank
    { id: 'startup_ceo', rank: 'A', type: 'investment', name: 'Startup CEO', desc: 'Luck +2\nAdult: Venture Executive' },
    { id: 'school_president', rank: 'A', type: 'normal', name: 'School President', desc: 'All Actions +1 Stat Bonus' },
    { id: 'kpop_trainee', rank: 'A', type: 'normal', name: 'K-Pop Trainee', desc: 'Weekly Sense +2, Int -1' },
    { id: 'model_gf', rank: 'A', type: 'girlfriend', name: 'Model GF', desc: 'Stress -15/wk, Max Power -30', modifiers: { maxPower: -30 } },

    // B Rank
    { id: 'rich_kid', rank: 'B', type: 'normal', name: 'Rich Kid', desc: 'Weekly Cash +50k' },
    { id: 'honor_student', rank: 'B', type: 'normal', name: 'Honor Student', desc: 'Study: Int +1 Bonus' },
    { id: 'athlete', rank: 'B', type: 'normal', name: 'Athlete', desc: 'Exercise: Sta +1 Bonus, Max Power +20', modifiers: { maxPower: 20 } },
    { id: 'popular_gf', rank: 'B', type: 'girlfriend', name: 'Popular GF', desc: 'Stress -10/wk, Max Power -20', modifiers: { maxPower: -20 } },

    // C Rank
    { id: 'gamer', rank: 'C', type: 'normal', name: 'Gamer', desc: 'Play: Sense +1 Bonus' },
    { id: 'influencer', rank: 'C', type: 'normal', name: 'Influencer', desc: 'Weekly Rep +1' },
    { id: 'artist', rank: 'C', type: 'normal', name: 'Artist', desc: 'Weekly Sense +1' },
    { id: 'cute_gf', rank: 'C', type: 'girlfriend', name: 'Cute GF', desc: 'Stress -7/wk, Max Power -15', modifiers: { maxPower: -15 } },

    // D Rank
    { id: 'snack_buddy', rank: 'D', type: 'normal', name: 'Snack Buddy', desc: 'Max Power +5' },
    { id: 'gossiper', rank: 'D', type: 'normal', name: 'Gossiper', desc: 'Luck +1' },
    { id: 'slacker', rank: 'D', type: 'normal', name: 'Slacker', desc: 'Rest: Stress -5 Bonus' },
    { id: 'childhood_gf', rank: 'D', type: 'girlfriend', name: 'Childhood GF', desc: 'Stress -5/wk, Max Power -10', modifiers: { maxPower: -10 } },
];

const getWeightedRandomFriend = (currentFriends: string[]): FriendArchetype | null => {
    // 0. Check GF Limit
    const hasGirlfriend = currentFriends.some(fid => FRIEND_POOL.find(p => p.id === fid)?.type === 'girlfriend');

    // 1. Filter available
    let available = FRIEND_POOL.filter(f => !currentFriends.includes(f.id));

    // If has GF, filter out other GFs
    if (hasGirlfriend) {
        available = available.filter(f => f.type !== 'girlfriend');
    }

    if (available.length === 0) return null;

    // 2. Roll for Rank
    const r = Math.random() * 100;
    let targetRank = 'D';
    if (r < 1) targetRank = 'S';       // 1%
    else if (r < 5) targetRank = 'A';  // 4%
    else if (r < 20) targetRank = 'B'; // 15%
    else if (r < 50) targetRank = 'C'; // 30%
    else targetRank = 'D';             // 50%

    // 3. Pick from Rank
    const pool = available.filter(f => f.rank === targetRank);

    // Fallback if pool empty (e.g. rolled S but already have S friends, or blocked)
    if (pool.length === 0) {
        const any = available[Math.floor(Math.random() * available.length)];
        return any;
    }

    return pool[Math.floor(Math.random() * pool.length)];
};

export const checkFriendEvents = (state: any): GameEvent | null => {
    const { time, player } = state;

    if (!player.isStudent) return null;

    // Trigger Conditions
    // Guaranteed on first month or random chance
    const isGuaranteed = (time.year === 1 && time.month === 3 && time.week === 2 && player.friends.length === 0);
    const isRandom = Math.random() < 0.05; // 5% chance

    if (!isGuaranteed && !isRandom) return null;

    const candidate = getWeightedRandomFriend(player.friends);
    if (!candidate) return null;

    const currentFriends = player.friends;

    // Helper: Modifiers logic
    const applyModifiers = (s: GameState, friendId: string, revert: boolean = false) => {
        const archetype = FRIEND_POOL.find(f => f.id === friendId);
        if (!archetype?.modifiers?.maxPower) return {};

        const change = archetype.modifiers.maxPower * (revert ? -1 : 1);
        return { maxPower: (s.maxPower || 100) + change };
    };

    // Helper: Add Friend
    const addFriend = (s: GameState, friendId: string) => {
        const mods = applyModifiers(s, friendId, false);
        return {
            player: {
                ...s.player,
                friends: [...s.player.friends, friendId],
                friendHistory: [...s.player.friendHistory, friendId]
            },
            ...mods,
            feedback: { id: Date.now(), text: `Friend Added! (${candidate.rank}-Rank)`, color: 'text-green-500' }
        };
    };

    // Helper: Grudge
    const applyGrudge = (s: GameState, sourceName: string) => {
        const senLoss = 5;
        return {
            player: { ...s.player, sense: Math.max(0, s.player.sense - senLoss) },
            feedback: { id: Date.now(), text: `${sourceName} holds a grudge! (Sen -${senLoss})`, color: 'text-red-500' }
        };
    };

    // Description Construction
    const typeLabel = candidate.type === 'girlfriend' ? '💖 Girlfriend Candidate' :
        candidate.type === 'investment' ? '🌟 Future VIP' : '👤 Friend';

    const description = `[${candidate.rank} Rank] ${candidate.name}\n(${typeLabel})\n\n${candidate.desc}\n\nDo you want to be friends?`;

    let choices = [];

    if (currentFriends.length < 2) {
        choices.push({
            label: "Become Friends",
            action: (s: GameState) => addFriend(s, candidate.id)
        });
        choices.push({
            label: "Reject",
            action: (s: GameState) => {
                if (Math.random() < 0.3) return applyGrudge(s, candidate.name);
                return { player: { ...s.player, friendHistory: [...s.player.friendHistory, candidate.id] } };
            }
        });
    } else {
        // Swap Logic
        currentFriends.forEach((fid: string) => {
            const f = FRIEND_POOL.find(p => p.id === fid);
            const fname = f ? f.name : fid;

            // Check if swapping GF for GF (Allowed) or Normal for GF (Allowed if no other GF)
            // Wait, getWeightedRandomFriend already filtered based on CURRENT friends.
            // If we are swapping, we might be REMOVING a GF, so we could theoretically accept a new GF?
            // BUT candidate is already picked. 
            // If candidate IS a GF, that means we definitely didn't have a GF (or logic allowed it).
            // Actually, if we have 2 friends and one IS a GF, `getWeighted` would filter out GF candidates.
            // So we can never swap TO a GF if we already have one, unless we are swapping THE GF.
            // But `getWeighted` doesn't know we are going to swap. It just sees "Has GF".
            // So if slots are full and one is GF, we can't roll a new GF to replace the old GF.
            // This is acceptable constraint: "You must break up (free slot) before meeting new GF".
            // Or we relax the filter if slots are full? No, let's keep it simple.

            choices.push({
                label: `Replace ${fname}`,
                action: (s: GameState) => {
                    // Revert old
                    const revertMods = applyModifiers(s, fid, true);
                    // Apply new
                    const newMods = applyModifiers({ ...s, ...revertMods }, candidate.id, false); // Chain maxPower update

                    return {
                        ...newMods, // Has final maxPower
                        player: {
                            ...s.player,
                            friends: s.player.friends.map((id: string) => id === fid ? candidate.id : id),
                            friendHistory: [...s.player.friendHistory, candidate.id]
                        },
                        feedback: { id: Date.now(), text: `Swapped to ${candidate.name}!`, color: 'text-blue-500' }
                    };
                }
            });
        });
        choices.push({
            label: "Reject New Friend",
            action: (s: GameState) => {
                if (Math.random() < 0.3) return applyGrudge(s, candidate.name);
                return { player: { ...s.player, friendHistory: [...s.player.friendHistory, candidate.id] } };
            }
        });
    }

    return {
        id: `friend-${Date.now()}`,
        type: 'choice',
        title: 'New Connection!',
        description: description,
        choices: choices
    };
};
