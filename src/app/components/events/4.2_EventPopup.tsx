import React from 'react';
import Modal from '../ui/4.1_Modal';
import PixelButton from '../ui/8.2_PixelButton';

interface Choice {
    label: string;
    action: () => void;
}

interface EventPopupProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description: string;
    image?: string;
    choices?: Choice[];
    onConfirm?: () => void; // Fallback for single button
    confirmText?: string;
}

const EventPopup: React.FC<EventPopupProps> = ({
    isOpen, onClose, title, description, image, choices, onConfirm, confirmText = "OK"
}) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <div className="flex flex-col gap-4 text-center">
                {image && (
                    <div className="w-full h-32 bg-gray-700 border-2 border-gray-600 flex items-center justify-center overflow-hidden">
                        <img src={image} alt="Event" className="w-full h-full object-cover pixelated opacity-80" />
                    </div>
                )}

                <p className="text-sm text-gray-300 whitespace-pre-line leading-relaxed">
                    {description}
                </p>

                <div className="flex flex-wrap justify-center gap-2 mt-2">
                    {choices && choices.length > 0 ? (
                        choices.map((choice, idx) => (
                            <PixelButton key={idx} onClick={() => {
                                choice.action();
                                onClose();
                            }} size="sm">
                                {choice.label}
                            </PixelButton>
                        ))
                    ) : (
                        <PixelButton onClick={() => {
                            if (onConfirm) onConfirm();
                            onClose();
                        }}>
                            {confirmText}
                        </PixelButton>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default EventPopup;
