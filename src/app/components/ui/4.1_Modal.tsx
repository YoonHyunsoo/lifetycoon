import React from 'react';
import PixelCard from './8.1_PixelCard';

interface ModalProps {
    isOpen: boolean;
    onClose?: () => void;
    title?: string;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="max-w-sm w-full animate-bounce-small">
                <PixelCard title={title} className="bg-gray-800 shadow-2xl">
                    <div className="flex flex-col gap-4">
                        {children}
                        {onClose && (
                            <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-white">
                                X
                            </button>
                        )}
                    </div>
                </PixelCard>
            </div>
        </div>
    );
};

export default Modal;
