export interface Job {
    id: string;
    title: string;
    rank: 'C' | 'B' | 'A' | 'S'; // Company Rank
    baseSalary: number; // Monthly
    minStats: { int: number; chm: number };
}

export const JOBS: Job[] = [
    { id: 'part_time', title: 'Part-timer', rank: 'C', baseSalary: 1500000, minStats: { int: 0, chm: 0 } },
    { id: 'intern', title: 'Intern', rank: 'B', baseSalary: 2000000, minStats: { int: 20, chm: 20 } },
    { id: 'regular', title: 'Employee', rank: 'A', baseSalary: 3000000, minStats: { int: 40, chm: 40 } },
    { id: 'elite', title: 'Elite', rank: 'S', baseSalary: 5000000, minStats: { int: 70, chm: 60 } },
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

export const getMonthlyExpenses = (age: number, hasFamily: boolean) => {
    let base = 0;
    if (age >= 20) base = 1000000; // Basic living cost

    // Grade Dignity Cost - REMOVED (Simpler model)
    // Previously based on Reputation. Now flat or based on spending?
    // Let's keep it simple: Just Base + Family.

    // Family
    const family = hasFamily ? 2000000 : 0; // Cost of spouse + child care approx

    return base + family;
};

export const PROMOTION_TABLE = [
    { title: 'Intern', nextTitle: 'Regular', reqChm: 20, reqInt: 20 },
    { title: 'Regular', nextTitle: 'Manager', reqChm: 40, reqInt: 40 },
    { title: 'Manager', nextTitle: 'Director', reqChm: 60, reqInt: 60 },
    { title: 'Director', nextTitle: 'VP', reqChm: 70, reqInt: 80 },
    { title: 'VP', nextTitle: 'CEO', reqChm: 90, reqInt: 90 },
];

export const STARTUP_TABLE = [
    { title: 'Founder (Seed)', nextTitle: 'Founder (Series A)', reqChm: 40, reqInt: 40, reqRes: 'Investment' },
    { title: 'Founder (Series A)', nextTitle: 'Founder (Series B)', reqChm: 60, reqInt: 60, reqRes: 'Growth' },
    { title: 'Founder (Series B)', nextTitle: 'Founder (Unicorn)', reqChm: 80, reqInt: 80, reqRes: 'IPO' },
];

export const checkPromotion = (currentTitle: string, userChm: number, userInt: number) => {
    // Normal Corporate Route
    const corpEntry = PROMOTION_TABLE.find(p => currentTitle.includes(p.title));
    if (corpEntry) {
        if (userChm >= corpEntry.reqChm && userInt >= corpEntry.reqInt) {
            return corpEntry.nextTitle;
        }
    }

    // Startup Route (Simplified Automation for now, usually requires Event)
    const startupEntry = STARTUP_TABLE.find(p => currentTitle === p.title); // Exact match
    if (startupEntry) {
        // Startup runs on events usually, but we can allow auto-growth if stats are high enough
        // to represent "Meeting milestones"
        if (userChm >= startupEntry.reqChm && userInt >= startupEntry.reqInt) {
            return startupEntry.nextTitle;
        }
    }

    return null;
};

// [NEW] Firing Logic
export const checkFiring = (jobTitle: string, stress: number, randomVal: number): string | null => {
    // 1. Stress Burnout Firing (If stress > 45, chance to be fired for negligence)
    if (stress >= 45 && randomVal < 5) return "Burnout";

    // 2. Low Reputation Firing - REMOVED

    // 3. Company Bankruptcy (C-Rank only)
    if (jobTitle.includes('Part-timer') || jobTitle.includes('C-Corp')) {
        if (randomVal < 0.5) return "Company Bankruptcy"; // 0.5% chance per month
    }

    return null;
};

// [NEW] Company Bonus Event
export const checkCompanyEvent = (jobTitle: string, randomVal: number): { type: 'bonus' | 'crisis', value: number } | null => {
    // S-Rank / Elite: High Bonus Chance
    if (jobTitle.includes('Elite') || jobTitle.includes('S-Corp')) {
        if (randomVal < 5) return { type: 'bonus', value: 5000000 }; // 5m Bonus
    }
    // A-Rank / Regular
    else if (jobTitle.includes('Employee') || jobTitle.includes('A-Corp')) {
        if (randomVal < 3) return { type: 'bonus', value: 2000000 };
    }

    return null;
};
