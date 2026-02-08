import React from 'react';
import PixelButton from './8.2_PixelButton';

interface MenuButtonsProps {
    onNewGame: () => void;
    onContinue?: () => void;
    onDevMode?: () => void;
    onGoogleLogin?: () => void;
    onSignOut?: () => void;
    user?: any; // Supabase User
}

const MenuButtons: React.FC<MenuButtonsProps> = ({ onNewGame, onContinue, onDevMode, onGoogleLogin, onSignOut, user }) => {
    return (
        <div className="flex flex-col gap-4 w-56">
            {/* LOGGED IN STATE */}
            {user ? (
                <div className="flex flex-col gap-2 animate-fade-in">
                    <div className="bg-gray-800 p-2 rounded border border-gray-600 text-center">
                        <div className="text-[10px] text-gray-400">LOGGED IN AS</div>
                        <div className="text-xs text-green-400 font-bold truncate px-2">{user.email}</div>
                    </div>

                    <button
                        onClick={onSignOut}
                        className="text-[10px] text-red-400 hover:text-red-300 underline mb-2"
                    >
                        Sign Out
                    </button>

                    <PixelButton onClick={onNewGame} size="lg" variant="primary">START NEW GAME</PixelButton>
                </div>
            ) : (
                <>
                    {/* GOOGLE LOGIN (Primary) */}
                    {onGoogleLogin && (
                        <button
                            onClick={onGoogleLogin}
                            className="w-full h-12 bg-white text-gray-800 font-bold border-b-4 border-gray-400 rounded flex items-center justify-center gap-2 hover:bg-gray-100 active:border-b-0 active:translate-y-1 transition-all shadow-lg font-pixel text-sm"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            LOGIN WITH GOOGLE
                        </button>
                    )}

                    <div className="flex items-center gap-2 text-gray-500 text-[10px] justify-center">
                        <div className="h-px bg-gray-600 w-full"></div>
                        OR
                        <div className="h-px bg-gray-600 w-full"></div>
                    </div>

                    {/* GUEST PLAY */}
                    <PixelButton onClick={onNewGame} size="lg" variant="primary">START AS GUEST</PixelButton>
                </>
            )}

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
