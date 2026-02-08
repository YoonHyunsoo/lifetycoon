import React from 'react';
// import { MAX_STAT } from '../../../lib/gameLogic';

interface StatDistributionProps {
    stats: {
        intelligence: number;
        stamina: number;
        charm: number;
        luck: number;
    };
    hiddenLuck?: boolean;
}

const DESCRIPTIONS = {
    intelligence: "Brain Power. Required for good jobs. Don't be a potato.",
    stamina: "Health Bar. If 0, you die (or pass out). Gym logic.",
    charm: "Social Vibe. Needed for dates, interviews & office politics.",
    luck: "RNG God's favor. You can't train this. Submit to fate."
};

const StatDistribution: React.FC<StatDistributionProps> = ({ stats, hiddenLuck }) => {
    return (
        <div className="grid grid-cols-2 gap-3 w-full">
            {Object.entries(stats).map(([key, value]) => {
                const statKey = key as keyof typeof stats;

                if (key === 'luck' && hiddenLuck) {
                    return (
                        <div key={key} className="bg-gray-800 border-2 border-dashed border-gray-600 p-2 text-center opacity-50">
                            <div className="text-xs text-yellow-500 uppercase mb-1">LUCK</div>
                            <div className="text-xl text-yellow-500 font-bold">???</div>
                            <div className="text-[9px] text-gray-500 mt-1 leading-tight">{DESCRIPTIONS.luck}</div>
                        </div>
                    );
                }

                return (
                    <div key={key} className="bg-gray-800 border-2 border-gray-600 p-2 text-center flex flex-col justify-between min-h-[80px]">
                        <div>
                            <div className="text-xs text-gray-400 uppercase mb-1 flex justify-between px-2">
                                <span>{key.substring(0, 3).toUpperCase()}</span>
                                <span className="text-white font-bold">{value}</span>
                            </div>

                            <div className="w-full bg-gray-700 h-1.5 mt-1 mb-2 rounded-full overflow-hidden">
                                <div
                                    className={`h-full ${key === 'stamina' ? 'bg-red-500' : key === 'charm' ? 'bg-pink-500' : 'bg-blue-500'}`}
                                    style={{ width: `${Math.min(100, (value / 20) * 100)}%` }} /* Visual scale for starting stats */
                                />
                            </div>
                        </div>

                        <div className="text-[9px] text-gray-400 leading-tight px-1 italic">
                            "{DESCRIPTIONS[statKey]}"
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default StatDistribution;
