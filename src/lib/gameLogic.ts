export const MAX_STAT = 99;
export const MAX_STRESS = 50;

/**
 * Calculate Stress Penalty for Action Cost
 * Based on Stress Index
 */
export const getStressPenaltyProperties = (stress: number) => {
    if (stress >= 40) return { penalty: 20, label: '과로사 직전' };
    if (stress >= 30) return { penalty: 10, label: '극심한 피로' };
    if (stress >= 20) return { penalty: 5, label: '피곤함' };
    if (stress >= 10) return { penalty: 2, label: '약간 피로' };
    return { penalty: 0, label: '정상' };
};

/**
 * Calculate Stamina Bonus for Action Cost
 * Based on Stamina Index
 */
export const getStaminaBonus = (stamina: number) => {
    // Formula: floor(stamina / 10)
    // 0~9 -> 0, 10~19 -> 1, ..., 90~99 -> 9
    return Math.floor(stamina / 10);
};

/**
 * Calculate final Action Cost
 * Cost = (Base 10) + (Stress Penalty) - (Stamina Bonus)
 * Minimum cost is 1
 */
export const getActionCost = (baseCost: number, stress: number, stamina: number) => {
    const { penalty } = getStressPenaltyProperties(stress);
    const bonus = getStaminaBonus(stamina);

    const finalCost = baseCost + penalty - bonus;
    return Math.max(1, finalCost);
};

/**
 * Calculate Success Chance
 * Capped at 60% globally as per Game Design
 */
export const calculateSuccessChance = (baseChance: number, luck: number, additionalBonus: number = 0) => {
    const GLOBAL_CAP = 60;

    // Example formula: Base + (Luck * 0.1) + Bonus
    // This is a placeholder logic, can be refined
    let chance = baseChance + (luck * 0.1) + additionalBonus;

    return Math.min(chance, GLOBAL_CAP);
};
