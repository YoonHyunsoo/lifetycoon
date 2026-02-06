import React from 'react';
import Modal from '../ui/4.1_Modal';
import PixelButton from '../ui/8.2_PixelButton';
import { AdManager } from '../../../lib/adSystem';

interface Choice {
    label: string;
    action: () => void;
    isAd?: boolean;
    adRewardType?: string;
}

interface EventPopupProps {
    isOpen: boolean;
    onClose: () => void;
    type?: string; // [NEW]
    title: string;
    description: string;
    image?: string;
    choices?: Choice[];
    onConfirm?: () => void;
    confirmText?: string;
}

const EventPopup: React.FC<EventPopupProps> = ({
    isOpen, onClose, type, title, description, image, choices, onConfirm, confirmText = "OK"
}) => {
    // Style logic
    let themeClass = "bg-gray-900 border-gray-600";
    if (type === 'date') themeClass = "bg-pink-950 border-pink-500 text-pink-100"; // Pink Theme
    else if (type === 'career') themeClass = "bg-blue-950 border-blue-500 text-blue-100";
    else if (type === 'quest') themeClass = "bg-yellow-950 border-yellow-500 text-yellow-100";
    else if (type === 'ending') themeClass = "bg-black border-red-500 text-red-100";

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title} className={themeClass}>
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
                                if (choice.isAd) {
                                    // Default to DOUBLE_REWARD if not specified
                                    const rType = choice.adRewardType || 'DOUBLE_REWARD';
                                    AdManager.showRewardedAd({ rewardType: rType as any }, () => {
                                        choice.action();
                                        onClose();
                                    });
                                } else {
                                    choice.action();
                                    onClose();
                                }
                            }} size="sm" className={choice.isAd ? "border-purple-500 animate-pulse text-purple-200" : ""}>
                                {choice.isAd ? `📺 ${choice.label}` : choice.label}
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
