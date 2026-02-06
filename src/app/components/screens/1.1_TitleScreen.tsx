import React, { useState } from 'react';
import PixelBackground from '../ui/1.4_PixelBackground';
import GameLogo from '../ui/1.2_GameLogo';
import MenuButtons from '../ui/1.3_MenuButtons';
import LoadGamePopup from '../save/LoadGamePopup';

interface TitleScreenProps {
    onStart: () => void;
    onDevMode: () => void;
}

const TitleScreen: React.FC<TitleScreenProps> = ({ onStart, onDevMode }) => {
    const [showLoad, setShowLoad] = useState(false);

    return (
        <div className="h-screen w-full">
            <PixelBackground>
                <div className="flex flex-col items-center justify-center h-full gap-12 backdrop-brightness-75">
                    <div className="text-center space-y-2">
                        <GameLogo />
                        <p className="text-yellow-200 text-xs font-pixel animate-bounce">
                            "From Dirt Spoon to Tycoon!"
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 w-48">
                        <MenuButtons
                            onNewGame={onStart}
                            onContinue={() => setShowLoad(true)}
                            onDevMode={onDevMode}
                        />
                    </div>

                    <div className="text-xs text-gray-400 mt-8 animate-pulse">
                        © 2026 MUDSPOON TYCOON Inc.
                    </div>

                    <LoadGamePopup
                        isOpen={showLoad}
                        onClose={() => setShowLoad(false)}
                        onLoadComplete={() => {
                            setShowLoad(false);
                            onStart(); // Switch to Game Screen
                        }}
                    />
                </div>
            </PixelBackground>
        </div>
    );
};
export default TitleScreen;
