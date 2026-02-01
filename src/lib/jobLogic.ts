export interface Job {
    id: string;
    title: string;
    rank: 'C' | 'B' | 'A' | 'S'; // Company Rank
    baseSalary: number; // Monthly
    minStats: { int: number; sen: number };
}

export const JOBS: Job[] = [
    { id: 'part_time', title: 'Part-timer', rank: 'C', baseSalary: 1500000, minStats: { int: 0, sen: 0 } },
    { id: 'intern', title: 'Intern', rank: 'B', baseSalary: 2000000, minStats: { int: 20, sen: 20 } },
    { id: 'regular', title: 'Employee', rank: 'A', baseSalary: 3000000, minStats: { int: 40, sen: 40 } },
    { id: 'elite', title: 'Elite', rank: 'S', baseSalary: 5000000, minStats: { int: 70, sen: 60 } },
];

export const SALARY_TABLE = {
    'intern': 25000000, // Annual
    'regular': 35000000,
    'manager': 50000000,
    'director': 80000000,
    'vp': 150000000,
    'ceo': 500000000,
    // Startup Stages
    'founder_seed': 0, // No salary, high risk
    'founder_series_a': 30000000,
    'founder_series_b': 80000000,
    'founder_unicorn': 1000000000 // Big payout
};

export const getMonthlyExpenses = (age: number, reputation: number, hasFamily: boolean) => {
    let base = 0;
    if (age >= 20) base = 1000000; // Basic living cost

    // Grade Dignity Cost
    let dignity = 0;
    if (reputation > 80) dignity = 3000000;
    else if (reputation > 50) dignity = 1000000;
    else if (reputation > 30) dignity = 500000;

    // Family
    const family = hasFamily ? 2000000 : 0; // Cost of spouse + child care approx

    return base + dignity + family;
};

export const PROMOTION_TABLE = [
    { title: 'Intern', nextTitle: 'Regular', reqRep: 10, reqSen: 20, reqInt: 20 },
    { title: 'Regular', nextTitle: 'Manager', reqRep: 30, reqSen: 40, reqInt: 40 },
    { title: 'Manager', nextTitle: 'Director', reqRep: 60, reqSen: 60, reqInt: 60 },
    { title: 'Director', nextTitle: 'VP', reqRep: 80, reqSen: 70, reqInt: 80 },
    { title: 'VP', nextTitle: 'CEO', reqRep: 95, reqSen: 90, reqInt: 90 },
];

export const STARTUP_TABLE = [
    { title: 'Founder (Seed)', nextTitle: 'Founder (Series A)', reqRep: 20, reqSen: 40, reqInt: 40, reqRes: 'Investment' },
    { title: 'Founder (Series A)', nextTitle: 'Founder (Series B)', reqRep: 50, reqSen: 60, reqInt: 60, reqRes: 'Growth' },
    { title: 'Founder (Series B)', nextTitle: 'Founder (Unicorn)', reqRep: 80, reqSen: 80, reqInt: 80, reqRes: 'IPO' },
];

export const checkPromotion = (currentTitle: string, userRep: number, userSen: number, userInt: number) => {
    // Normal Corporate Route
    const corpEntry = PROMOTION_TABLE.find(p => currentTitle.includes(p.title));
    if (corpEntry) {
        if (userRep >= corpEntry.reqRep && userSen >= corpEntry.reqSen && userInt >= corpEntry.reqInt) {
            return corpEntry.nextTitle;
        }
    }

    // Startup Route (Simplified Automation for now, usually requires Event)
    const startupEntry = STARTUP_TABLE.find(p => currentTitle === p.title); // Exact match
    if (startupEntry) {
        // Startup runs on events usually, but we can allow auto-growth if stats are high enough
        // to represent "Meeting milestones"
        if (userRep >= startupEntry.reqRep && userSen >= startupEntry.reqSen && userInt >= startupEntry.reqInt) {
            return startupEntry.nextTitle;
        }
    }

    return null;
};
