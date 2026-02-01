import React from 'react';
import PixelButton from '../ui/8.2_PixelButton';

interface DiceRollerProps {
    onRoll: (stats: number[]) => void;
    rolling?: boolean;
}

const DiceRoller: React.FC<DiceRollerProps> = ({ onRoll, rolling = false }) => {
    return (
        <div className="flex flex-col items-center gap-4 p-4 border-2 border-dashed border-gray-600">
            <div className={`text-4xl ${rolling ? 'animate-spin' : ''}`}>
                🎲
            </div>
            <PixelButton onClick={() => onRoll([0, 0, 0, 0])} disabled={rolling}>
                {rolling ? 'Rolling...' : 'Roll Dice'}
            </PixelButton>
        </div>
    );
};

export default DiceRoller;
