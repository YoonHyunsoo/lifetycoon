import React from 'react';
import Modal from '../ui/4.1_Modal';
// import PixelButton from '../ui/8.2_PixelButton';
import PixelCard from '../ui/8.1_PixelCard';
import { useGameStore } from '../../../store/gameStore';

interface CareerPathPopupProps {
    isOpen: boolean;
    onSelect: (path: 'job' | 'college' | 'cert') => void;
    onClose?: () => void;
}

const CareerPathPopup: React.FC<CareerPathPopupProps> = ({ isOpen, onSelect, onClose }) => {
    const { setCareer } = useGameStore();

    const handleSelect = (path: 'job' | 'college' | 'cert') => {
        setCareer(path);
        onSelect(path);
        if (onClose) onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="CHOOSE YOUR PATH">
            <div className="flex flex-col gap-3">
                <p className="text-xs text-gray-400 text-center mb-2">
                    New year has come. Select your path for this year.
                </p>

                <div
                    onClick={() => handleSelect('job')}
                    className="cursor-pointer group"
                >
                    <PixelCard className="hover:border-yellow-400 transition-colors bg-gray-900 group-hover:bg-gray-800">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">💼</span>
                            <div className="text-left">
                                <div className="text-sm font-bold text-white">Employment</div>
                                <div className="text-xxs text-gray-500">Apply for companies</div>
                            </div>
                        </div>
                    </PixelCard>
                </div>

                <div
                    onClick={() => handleSelect('college')}
                    className="cursor-pointer group"
                >
                    <PixelCard className="hover:border-green-400 transition-colors bg-gray-900 group-hover:bg-gray-800">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">🎓</span>
                            <div className="text-left">
                                <div className="text-sm font-bold text-white">College</div>
                                <div className="text-xxs text-gray-500">2 Years, Debt -50m</div>
                            </div>
                        </div>
                    </PixelCard>
                </div>

                <div
                    onClick={() => handleSelect('cert')}
                    className="cursor-pointer group"
                >
                    <PixelCard className="hover:border-blue-400 transition-colors bg-gray-900 group-hover:bg-gray-800">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">✏️</span>
                            <div className="text-left">
                                <div className="text-sm font-bold text-white">Certification</div>
                                <div className="text-xxs text-gray-500">Gap year for specs</div>
                            </div>
                        </div>
                    </PixelCard>
                </div>

            </div>
        </Modal>
    );
};

export default CareerPathPopup;
