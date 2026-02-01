import React from 'react';
import PixelButton from './8.2_PixelButton';

interface MenuButtonsProps {
    onNewGame: () => void;
    onContinue?: () => void;
    onDevMode?: () => void;
}

const MenuButtons: React.FC<MenuButtonsProps> = ({ onNewGame, onContinue, onDevMode }) => {
    return (
        <div className="flex flex-col gap-4 w-48">
            <PixelButton onClick={onNewGame} size="lg">New Game</PixelButton>
            <PixelButton onClick={onContinue} size="lg" disabled={!onContinue} variant="secondary">
                Continue
            </PixelButton>
            {onDevMode && (
                <div className="mt-4 pt-4 border-t border-gray-600">
                    <PixelButton onClick={onDevMode} size="sm" variant="secondary" className="opacity-50 text-xs hover:opacity-100">
                        🛠️ DEV MODE
                    </PixelButton>
                </div>
            )}
        </div>
    );
};

export default MenuButtons;
