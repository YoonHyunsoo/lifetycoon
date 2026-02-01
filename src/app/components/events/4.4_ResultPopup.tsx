import React from 'react';
import Modal from '../ui/4.1_Modal';
import PixelButton from '../ui/8.2_PixelButton';

interface ResultPopupProps {
    isOpen: boolean;
    onClose: () => void;
    success: boolean;
    title: string;
    message: string;
    rewards?: string[];
}

const ResultPopup: React.FC<ResultPopupProps> = ({
    isOpen, onClose, success, title, message, rewards
}) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <div className="flex flex-col items-center gap-4 text-center">
                <div className={`text-6xl animate-bounce ${success ? 'text-green-500' : 'text-red-500'}`}>
                    {success ? '⭕' : '❌'}
                </div>

                <div className="text-lg font-bold text-white">{success ? 'SUCCESS!' : 'FAILED...'}</div>

                <p className="text-sm text-gray-300">{message}</p>

                {success && rewards && rewards.length > 0 && (
                    <div className="bg-gray-900 p-2 rounded w-full border border-gray-700">
                        <div className="text-xs text-yellow-500 mb-1">REWARDS</div>
                        {rewards.map((r, i) => (
                            <div key={i} className="text-xs text-white">{r}</div>
                        ))}
                    </div>
                )}

                <PixelButton onClick={onClose} variant={success ? 'primary' : 'secondary'}>
                    CONFIRM
                </PixelButton>
            </div>
        </Modal>
    );
};

export default ResultPopup;
