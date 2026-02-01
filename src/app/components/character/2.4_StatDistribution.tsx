import React from 'react';
import { MAX_STAT } from '../../../lib/gameLogic';

interface StatDistributionProps {
    stats: {
        intelligence: number;
        stamina: number;
        sense: number;
        luck: number;
    };
}

const StatDistribution: React.FC<StatDistributionProps> = ({ stats }) => {
    return (
        <div className="grid grid-cols-2 gap-4 w-full">
            {Object.entries(stats).map(([key, value]) => (
                <div key={key} className="bg-gray-800 border-2 border-gray-600 p-2 text-center">
                    <div className="text-xs text-gray-400 uppercase mb-1">{key}</div>
                    <div className="text-xl text-white font-bold">{value}</div>
                    <div className="w-full bg-gray-700 h-2 mt-2">
                        <div
                            className="bg-yellow-500 h-full"
                            style={{ width: `${(value / MAX_STAT) * 100}%` }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default StatDistribution;
