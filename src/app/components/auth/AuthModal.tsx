import React, { useState } from 'react';
import PixelButton from '../ui/8.2_PixelButton';
import PixelCard from '../ui/8.1_PixelCard';
import { useAuthStore } from '../../../store/authStore';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
    const { signIn, isLoading, error, user } = useAuthStore();
    const [email, setEmail] = useState('');
    const [sent, setSent] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        const success = await signIn(email);
        if (success) setSent(true);
    };

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
            <PixelCard className="w-full max-w-sm bg-gray-800 border-gray-600 animate-slide-up">
                <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-2">
                    <h2 className="text-xl font-bold text-white">LOGIN</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
                </div>

                {user ? (
                    <div className="text-center space-y-4">
                        <p className="text-green-400">✅ Logged In as {user.email}</p>
                        <PixelButton onClick={onClose} variant="primary">CLOSE</PixelButton>
                    </div>
                ) : sent ? (
                    <div className="text-center space-y-4">
                        <div className="text-4xl">📧</div>
                        <p className="text-yellow-400">Check your email for the Magic Link!</p>
                        <p className="text-xs text-gray-400">Click the link in the email to log in.</p>
                        <PixelButton onClick={onClose} variant="secondary">OK</PixelButton>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {/* 1. Google Login (Primary) */}
                        <div className="flex flex-col gap-2">
                            <button
                                onClick={async () => {
                                    try {
                                        const { signInWithGoogle } = await import('../../../lib/supabase');
                                        await signInWithGoogle();
                                    } catch (err) {
                                        console.error(err);
                                        alert("Google Login Failed. Check Console.");
                                    }
                                }}
                                className="w-full h-10 bg-white text-gray-800 font-bold border-2 border-gray-400 rounded flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors shadow-sm"
                            >
                                <svg className="w-4 h-4" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                LOGIN WITH GOOGLE
                            </button>
                            <div className="relative flex py-1 items-center">
                                <div className="flex-grow border-t border-gray-600"></div>
                                <span className="flex-shrink-0 mx-2 text-gray-500 text-[10px]">OR EMAIL</span>
                                <div className="flex-grow border-t border-gray-600"></div>
                            </div>
                        </div>

                        {/* 2. Email Form (Legacy) */}
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <div>
                                <label className="block text-xs text-gray-400 mb-1">EMAIL ADDRESS</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white focus:border-blue-500 outline-none"
                                    placeholder="tycoon@example.com"
                                    required
                                />
                            </div>

                            {error && (
                                <div className="p-2 bg-red-900/50 border border-red-500 text-red-200 text-xs rounded">
                                    {error}
                                </div>
                            )}

                            <PixelButton type="submit" variant="primary" isLoading={isLoading}>
                                SEND MAGIC LINK
                            </PixelButton>

                            <p className="text-[10px] text-gray-500 text-center mt-2">
                                We use Magic Links. No passwords required.
                            </p>
                        </form>
                    </div>
                )}
            </PixelCard>
        </div>
    );
};

export default AuthModal;
