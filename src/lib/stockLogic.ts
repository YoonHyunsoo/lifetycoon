export interface Stock {
    id: number;
    name: string;
    type: 'Stable' | 'Volatile' | 'Lotto' | 'Long-term';
    price: number;
    lastPrice: number; // To calc rate
    rate: number; // Percentage
    owned: number;
    variable: number; // r value stored for reference or history
    holdingYears: number; // For JohnBer Fund
}

export const INITIAL_STOCKS: Stock[] = [
    { id: 1, name: 'SanSam Electronics', type: 'Stable', price: 70000, lastPrice: 70000, rate: 0, owned: 0, variable: 0, holdingYears: 0 },
    { id: 2, name: 'ChaeSulla', type: 'Volatile', price: 200000, lastPrice: 200000, rate: 0, owned: 0, variable: 0, holdingYears: 0 },
    { id: 3, name: 'HanBang Bio', type: 'Lotto', price: 10000, lastPrice: 10000, rate: 0, owned: 0, variable: 0, holdingYears: 0 },
    { id: 4, name: 'JohnBer Fund', type: 'Long-term', price: 10000, lastPrice: 10000, rate: 0, owned: 0, variable: 0, holdingYears: 0 },
];

const getRandomVariable = () => {
    const values = [-3, -2, 0, 1, 2, 3];
    return values[Math.floor(Math.random() * values.length)];
};

export const updateStockPrices = (stocks: Stock[], insiderHint: { stockId: number; trend: 'bull' | 'bear' } | null = null): Stock[] => {
    return stocks.map(stock => {
        let r = getRandomVariable();

        // [MONETIZATION] Apply Insider Hint
        if (insiderHint && insiderHint.stockId === stock.id) {
            // Force r to be positive (bull) or very negative (bear)
            if (insiderHint.trend === 'bull') {
                r = Math.abs(r) === 0 ? 2 : Math.abs(r); // Ensure positive
            } else {
                r = -Math.abs(r) === 0 ? -2 : -Math.abs(r); // Ensure negative
            }
        }

        let growthRate = 0;

        switch (stock.id) {
            case 1: // Stable: 0.03 + 0.02*cos((π/6)*r)
                growthRate = 0.03 + 0.02 * Math.cos((Math.PI / 6) * r);
                break;

            case 2: // Volatile
                // 0.105*sgn0(r) + 0.07*tan((π/8)*r) + 0.015*r - 0.01*I(r<0)*abs(r)
                // Simply: High risk high return
                // Let's approximate the design doc formula logic with JS
                const sign = r === 0 ? 0 : r > 0 ? 1 : -1;
                const tanTerm = Math.tan((Math.PI / 8) * r);
                const penalty = r < 0 ? 0.01 * Math.abs(r) : 0;
                growthRate = 0.105 * sign + 0.07 * tanTerm + 0.015 * r - penalty;
                break;

            case 3: // Lotto
                // -0.11 - 0.015*3^r - 0.01*cos((π/6)*r) + 0.887*I(r=3)
                // Huge jump if r=3
                const isJackpot = r === 3 ? 0.887 : 0;
                growthRate = -0.11 - 0.015 * Math.pow(3, r) - 0.01 * Math.cos((Math.PI / 6) * r) + isJackpot;
                break;

            case 4: // Long-term (JohnBer)
                // Base growth increases with holding years
                const baseGrowth = 0.01 + (stock.holdingYears * 0.02); // Increases by 2% per year held
                const randomFluctuation = r * 0.01;
                growthRate = baseGrowth + randomFluctuation;
                break;
        }

        // Apply Growth
        const newPrice = Math.floor(stock.price * (1 + growthRate));

        // Update Holding Years logic
        // Usually this is per user, but here it's global stock property? 
        // Wait, holding years depends on USER holding it.
        // The design doc says "H = 보유연수". If player holds it, H++. If sold, H=0.
        // Since we only have one player, we can update H here if owned > 0.
        const newHoldingYears = stock.owned > 0 ? stock.holdingYears + 1 : 0;

        return {
            ...stock,
            lastPrice: stock.price,
            price: Math.max(1, newPrice), // Minimum price 1
            rate: parseFloat((growthRate * 100).toFixed(2)),
            variable: r,
            holdingYears: newHoldingYears
        };
    });
};
