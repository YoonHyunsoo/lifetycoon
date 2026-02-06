import React, { useEffect, useState } from 'react';
import PixelButton from '../ui/8.2_PixelButton';

interface DiceRollerProps {
    onRoll: () => void;
    rolling?: boolean;
}

const DiceRoller: React.FC<DiceRollerProps> = ({ onRoll, rolling = false }) => {
    // Visual state for the 3 dice
    const [displayValues, setDisplayValues] = useState<(number | string)[]>(['?', '?', '?']);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (rolling) {
            interval = setInterval(() => {
                setDisplayValues([
                    Math.floor(Math.random() * 6) + 1,
                    Math.floor(Math.random() * 6) + 1,
                    Math.floor(Math.random() * 6) + 1
                ]);
            }, 100);
        } else {
            // When stopped, maybe show ? or keep last? 
            // The parent shows the actual stats in StatDistribution.
            // So these dice are just for the "Act of Rolling".
            setDisplayValues(['?', '?', '?']);
        }
        return () => clearInterval(interval);
    }, [rolling]);

    return (
        <div className="flex flex-col items-center gap-6 p-6 bg-gray-800 border-4 border-gray-700 rounded-lg shadow-xl w-full">

            {/* Dice Container */}
            <div className="flex gap-4 justify-center">
                {['INT', 'STA', 'SEN'].map((label, idx) => (
                    <div key={label} className="flex flex-col items-center gap-2">
                        <div className={`
                            w-16 h-16 bg-white rounded-lg border-4 border-gray-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]
                            flex items-center justify-center text-4xl font-bold text-black
                            ${rolling ? 'animate-bounce' : ''}
                        `}>
                            {displayValues[idx]}
                        </div>
                        <span className="text-xs font-pixel text-gray-400">{label}</span>
                    </div>
                ))}
            </div>

            {/* Roll Button */}
            <PixelButton
                onClick={onRoll}
                disabled={rolling}
                className={`w-full py-4 text-xl ${rolling ? 'opacity-50 cursor-not-allowed' : 'animate-pulse'}`}
            >
                {rolling ? 'ROLLING...' : 'ROLL DICE'}
            </PixelButton>
        </div>
    );
};

export default DiceRoller;
