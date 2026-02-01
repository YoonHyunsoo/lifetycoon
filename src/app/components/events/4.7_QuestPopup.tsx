import React from 'react';
import Modal from '../ui/4.1_Modal';
import PixelButton from '../ui/8.2_PixelButton';
import PixelGauge from '../ui/3.3_PixelGauge';

interface QuestPopupProps {
    isOpen: boolean;
    onClose: () => void;
    type: 'parent' | 'marriage' | 'business';
    title: string;
    description: string;
    successChance: number; // 0~100
    cost?: number;
    reward?: string;
    onAttempt: () => void;
}

const QuestPopup: React.FC<QuestPopupProps> = ({
    isOpen, onClose, type, title, description, successChance, cost, reward, onAttempt
}) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`QUEST: ${title}`}>
            <div className="flex flex-col gap-4">
                <div className={`w-full h-24 flex items-center justify-center bg-gray-900 border border-gray-600`}>
                    <span className="text-4xl">
                        {type === 'parent' ? '👵' : type === 'marriage' ? '💍' : '💼'}
                    </span>
                </div>

                <p className="text-sm text-gray-300 text-center">{description}</p>

                <div className="bg-gray-800 p-2 border border-gray-700 rounded text-xs">
                    <div className="flex justify-between mb-1">
                        <span className="text-gray-400">Success Chance</span>
                        <span className="text-yellow-400">{successChance}%</span>
                    </div>
                    <PixelGauge value={successChance} max={100} color="yellow" />

                    {cost && (
                        <div className="flex justify-between mt-2 border-t border-gray-700 pt-2">
                            <span className="text-gray-400">Cost</span>
                            <span className="text-red-400">-{cost.toLocaleString()} ₩</span>
                        </div>
                    )}
                    {reward && (
                        <div className="flex justify-between mt-1">
                            <span className="text-gray-400">Reward</span>
                            <span className="text-green-400">{reward}</span>
                        </div>
                    )}
                </div>

                <div className="flex gap-2">
                    <PixelButton variant="secondary" className="flex-1" onClick={onClose}>GIVE UP</PixelButton>
                    <PixelButton className="flex-1" onClick={onAttempt}>ATTEMPT</PixelButton>
                </div>
            </div>
        </Modal>
    );
};

export default QuestPopup;
