import React, { useState } from 'react';
import Modal from '../ui/4.1_Modal';
import PixelButton from '../ui/8.2_PixelButton';
import PixelCard from '../ui/8.1_PixelCard';
import { useGameStore } from '../../../store/gameStore';

interface AllocationPopupProps {
    isOpen: boolean;
    onClose: () => void;
    type: 'study' | 'exercise' | 'club' | 'rest';
    label: string;
}

const AllocationPopup: React.FC<AllocationPopupProps> = ({ isOpen, onClose, type, label }) => {
    const { allocation, setAllocation, maxPower } = useGameStore();
    const [tempValue, setTempValue] = useState(allocation[type]);

    // Constants (Should match store)
    const COST_PER_UNIT = 10;
    // Yield text map
    const YIELD_MAP = {
        study: "+1 INT / +2 STRESS",
        exercise: "+1 STA / -1 STRESS",
        club: "+1 SEN / -1 STRESS",
        rest: "-5 STRESS"
    };

    const currentCost = tempValue * COST_PER_UNIT;

    const handleConfirm = () => {
        setAllocation(type, tempValue);
        onClose();
    };

    const totalAllocatedOther = Object.entries(allocation)
        .filter(([key]) => key !== type)
        .reduce((sum, [_, val]) => sum + (val as number) * COST_PER_UNIT, 0);

    const maxGeneric = maxPower;
    const remainingPower = maxGeneric - totalAllocatedOther;
    const maxPossibleUnits = Math.floor(remainingPower / COST_PER_UNIT);

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`CONFIGURE ${label.toUpperCase()}`}>
            <div className="flex flex-col gap-6">

                <div className="flex justify-between items-center text-gray-400 text-xs px-2">
                    <span>Remaining Capacity: {remainingPower - currentCost} / {maxPower} PWR</span>
                </div>

                <div className="flex items-center justify-center gap-4">
                    <PixelButton
                        onClick={() => setTempValue(Math.max(0, tempValue - 1))}
                        disabled={tempValue <= 0}
                    >-</PixelButton>

                    <div className="text-4xl font-pixel text-white w-16 text-center">
                        {tempValue}
                    </div>

                    <PixelButton
                        onClick={() => setTempValue(Math.min(maxPossibleUnits, tempValue + 1))}
                        disabled={tempValue >= maxPossibleUnits}
                    >+</PixelButton>
                </div>

                <div className="flex flex-col gap-2">
                    <PixelCard className="bg-gray-800 border-red-900/50">
                        <div className="flex justify-between text-red-400 font-bold">
                            <span>COST</span>
                            <span>-{currentCost} PWR</span>
                        </div>
                    </PixelCard>

                    <PixelCard className="bg-gray-800 border-green-900/50">
                        <div className="flex justify-between text-green-400 font-bold">
                            <span>YIELD</span>
                            {/* Simple text based display */}
                            <span>
                                {type === 'rest'
                                    ? `-${tempValue * 5} STRESS`
                                    : `+${tempValue} ${type === 'study' ? 'INT' : type === 'exercise' ? 'STA' : 'SEN'}`
                                }
                            </span>
                        </div>
                        <div className="text-[10px] text-gray-500 text-right mt-1">
                            {YIELD_MAP[type]} (Per Unit)
                        </div>
                    </PixelCard>
                </div>

                <div className="flex justify-center mt-2">
                    <PixelButton onClick={handleConfirm} variant="primary">
                        CONFIRM
                    </PixelButton>
                </div>
            </div>
        </Modal>
    );
};

export default AllocationPopup;
