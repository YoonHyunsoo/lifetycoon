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
                )}
            </PixelCard>
        </div>
    );
};

export default AuthModal;
