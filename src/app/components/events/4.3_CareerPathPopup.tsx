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
        <Modal isOpen={isOpen} onClose={onClose} title="CHOOSE YOUR PATH (Age 20)">
            <div className="flex flex-col gap-3">
                <p className="text-xs text-gray-400 text-center mb-2">
                    You are now an adult. Choose how you will start your 20s.
                </p>

                {/* Job Path */}
                <div onClick={() => handleSelect('job')} className="cursor-pointer group">
                    <PixelCard className="hover:border-yellow-400 transition-colors bg-gray-900 group-hover:bg-gray-800">
                        <div className="flex items-center gap-3">
                            <span className="text-3xl">💼</span>
                            <div className="text-left flex-1">
                                <div className="text-sm font-bold text-white group-hover:text-yellow-400">Employment</div>
                                <div className="text-xxs text-gray-400">Start earning immediately.</div>
                                <div className="text-xxs text-yellow-600 mt-1">Starting Rank based on stats.</div>
                            </div>
                        </div>
                    </PixelCard>
                </div>

                {/* College Path */}
                <div onClick={() => handleSelect('college')} className="cursor-pointer group">
                    <PixelCard className="hover:border-green-400 transition-colors bg-gray-900 group-hover:bg-gray-800">
                        <div className="flex items-center gap-3">
                            <span className="text-3xl">🎓</span>
                            <div className="text-left flex-1">
                                <div className="text-sm font-bold text-white group-hover:text-green-400">College</div>
                                <div className="text-xxs text-gray-400">4 Years of study. Degree = Higher Job Ceiling.</div>
                                <div className="text-xxs text-red-500 mt-1">Cost: 50,000,000 ₩ (Debt)</div>
                            </div>
                        </div>
                    </PixelCard>
                </div>

                {/* Certification Path */}
                <div onClick={() => handleSelect('cert')} className="cursor-pointer group">
                    <PixelCard className="hover:border-blue-400 transition-colors bg-gray-900 group-hover:bg-gray-800">
                        <div className="flex items-center gap-3">
                            <span className="text-3xl">✏️</span>
                            <div className="text-left flex-1">
                                <div className="text-sm font-bold text-white group-hover:text-blue-400">Gap Year / Certs</div>
                                <div className="text-xxs text-gray-400">Build specs to apply for better jobs later.</div>
                                <div className="text-xxs text-blue-500 mt-1">Freedom to work part-time.</div>
                            </div>
                        </div>
                    </PixelCard>
                </div>

            </div>
        </Modal>
    );
};

export default CareerPathPopup;
