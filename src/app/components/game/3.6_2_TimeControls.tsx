import React from 'react';
import { useGameStore } from '../../../store/gameStore';
// import PixelButton from '../ui/8.2_PixelButton';

const TimeControls: React.FC = () => {
    const { isPlaying, togglePlay, maxPower, allocation } = useGameStore();

    const COST_PER_UNIT = 10;
    const usedPower = (allocation.study + allocation.exercise + allocation.club + allocation.rest) * COST_PER_UNIT;

    return (
        <div className="absolute bottom-28 right-4 z-30 flex items-center gap-2">
            <div className={`text-xxs px-2 py-1 rounded border ${usedPower > maxPower ? 'bg-red-900 border-red-500 text-red-200' : 'bg-black/50 border-gray-600 text-gray-400'}`}>
                ⚡ {usedPower} / {maxPower}
            </div>

            <button
                onClick={togglePlay}
                className={`w-10 h-10 rounded-full border-2 flex items-center justify-center shadow-lg transition-all ${isPlaying
                    ? 'bg-yellow-900/80 border-yellow-500 text-yellow-500 hover:bg-yellow-800'
                    : 'bg-green-900/80 border-green-500 text-green-500 hover:bg-green-800 animate-pulse'
                    }`}
            >
                {isPlaying ? (
                    // Pause Icon
                    <div className="flex gap-1">
                        <div className="w-1 h-3 bg-current"></div>
                        <div className="w-1 h-3 bg-current"></div>
                    </div>
                ) : (
                    // Play Icon
                    <div className="w-0 h-0 border-t-4 border-t-transparent border-l-8 border-l-current border-b-4 border-b-transparent ml-0.5"></div>
                )}
            </button>
        </div>
    );
};

export default TimeControls;
