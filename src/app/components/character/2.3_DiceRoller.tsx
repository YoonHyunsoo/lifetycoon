import React, { useEffect, useState } from 'react';
import PixelButton from '../ui/8.2_PixelButton';

interface DiceRollerProps {
    onRoll: () => void;
    // Pass current stats to display on dice
    currentStats: { intelligence: number; stamina: number; sense: number; luck: number };
    rolling?: boolean;
}

const DiceRoller: React.FC<DiceRollerProps> = ({ onRoll, currentStats, rolling = false }) => {
    // Visual state for rolling animation only
    const [randomValues, setRandomValues] = useState([1, 1, 1]);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (rolling) {
            interval = setInterval(() => {
                setRandomValues([
                    Math.floor(Math.random() * 20) + 1,
                    Math.floor(Math.random() * 20) + 1,
                    Math.floor(Math.random() * 20) + 1
                ]);
            }, 50);
        }
        return () => clearInterval(interval);
    }, [rolling]);

    // Derived values for display
    // If rolling, show random flickering numbers.
    // If NOT rolling, show the ACTUAL properties from currentStats.
    const displayValues = rolling
        ? [...randomValues, '?']
        : [currentStats.intelligence, currentStats.stamina, currentStats.sense, '?'];

    return (
        <div className="flex flex-col items-center gap-6 p-4 bg-gray-800 border-4 border-gray-700 rounded-lg shadow-xl w-full">

            {/* Dice Container - Now 4 Dice */}
            <div className="flex gap-2 justify-center w-full">
                {['INT', 'STA', 'SEN', 'LUCK'].map((label, idx) => {
                    const isLuck = label === 'LUCK';
                    const value = displayValues[idx];

                    // Style config per die
                    let colorClass = "text-black bg-white";
                    if (label === 'INT') colorClass = "text-blue-900 bg-blue-100";
                    if (label === 'STA') colorClass = "text-red-900 bg-red-100";
                    if (label === 'SEN') colorClass = "text-purple-900 bg-purple-100";
                    if (isLuck) colorClass = "text-yellow-500 bg-gray-900 border-yellow-500";

                    return (
                        <div key={label} className="flex flex-col items-center gap-2">
                            <div className={`
                                w-14 h-14 rounded-lg border-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)]
                                flex items-center justify-center text-2xl font-bold
                                ${colorClass}
                                ${isLuck ? 'border-yellow-500' : 'border-gray-300'}
                                ${rolling && !isLuck ? 'animate-bounce' : ''}
                            `}>
                                {value}
                            </div>
                            <span className={`text-[10px] font-pixel ${isLuck ? 'text-yellow-500' : 'text-gray-400'}`}>
                                {label}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Roll Button */}
            <PixelButton
                onClick={onRoll}
                disabled={rolling}
                className={`w-full py-3 text-lg ${rolling ? 'opacity-50 cursor-not-allowed' : 'animate-pulse'}`}
            >
                {rolling ? 'ROLLING...' : 'ROLL DICE'}
            </PixelButton>
        </div>
    );
};

export default DiceRoller;
