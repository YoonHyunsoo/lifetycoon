import React, { useState } from 'react';
import PixelBackground from '../ui/1.4_PixelBackground';
import GameLogo from '../ui/1.2_GameLogo';
import MenuButtons from '../ui/1.3_MenuButtons';
import LoadGamePopup from '../save/LoadGamePopup';

interface TitleScreenProps {
    onStart: () => void;
    onLoadGame: () => void;
    onDevMode: () => void;
}

import { useAuthStore } from '../../../store/authStore';
import AuthModal from '../auth/AuthModal';

const TitleScreen: React.FC<TitleScreenProps> = ({ onStart, onLoadGame, onDevMode }) => {
    const [showLoad, setShowLoad] = useState(false);
    const [showAuth, setShowAuth] = useState(false);

    const { user, signOut } = useAuthStore();

    const handleContinue = () => {
        if (!user) {
            setShowAuth(true);
            return;
        }
        setShowLoad(true);
    };

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
                            user={user}
                            onSignOut={() => signOut()}
                            onGoogleLogin={async () => {
                                try {
                                    const { signInWithGoogle } = await import('../../../lib/supabase');
                                    await signInWithGoogle();
                                } catch (e) {
                                    console.error(e);
                                    alert("Login Failed");
                                }
                            }}
                            onNewGame={onStart}
                            onContinue={handleContinue}
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
                            onLoadGame(); // Switch directly to Game Logic
                        }}
                    />

                    <AuthModal
                        isOpen={showAuth}
                        onClose={() => setShowAuth(false)}
                    />
                </div>
            </PixelBackground>
        </div>
    );
};
export default TitleScreen;
