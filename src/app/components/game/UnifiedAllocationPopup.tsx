import React, { useState, useEffect } from 'react';
import Modal from '../ui/4.1_Modal';
import PixelButton from '../ui/8.2_PixelButton';
import PixelCard from '../ui/8.1_PixelCard';
import { useGameStore } from '../../../store/gameStore';

interface UnifiedAllocationPopupProps {
    isOpen: boolean;
    onClose: () => void;
}

const UnifiedAllocationPopup: React.FC<UnifiedAllocationPopupProps> = ({ isOpen, onClose }) => {
    const { allocation, setAllocation, maxPower } = useGameStore();

    // Temp state for all 4
    const [tempAlloc, setTempAlloc] = useState(allocation);

    useEffect(() => {
        if (isOpen) setTempAlloc(allocation);
    }, [isOpen, allocation]);

    const COST_PER_UNIT = 10;

    const handleChange = (type: keyof typeof tempAlloc, delta: number) => {
        const newVal = Math.max(0, tempAlloc[type] + delta);
        setTempAlloc(prev => ({ ...prev, [type]: newVal }));
    };

    const totalUnits = Object.values(tempAlloc).reduce((a, b) => a + b, 0);
    const totalCost = totalUnits * COST_PER_UNIT;
    const remainingPower = maxPower - totalCost;

    // Calculate Net Effects
    const netStress = (tempAlloc.study * 2) - (tempAlloc.exercise * 1) - (tempAlloc.club * 1) - (tempAlloc.rest * 5);
    const netInt = tempAlloc.study;
    const netSta = tempAlloc.exercise;
    const netSen = tempAlloc.club;

    const handleConfirm = () => {
        Object.keys(tempAlloc).forEach((key) => {
            setAllocation(key as any, tempAlloc[key as keyof typeof tempAlloc]);
        });
        onClose();
    };

    const items = [
        { id: 'study', label: 'Study', color: 'text-blue-400', stat: 'INT' },
        { id: 'exercise', label: 'Exercise', color: 'text-red-400', stat: 'STA' },
        { id: 'club', label: 'Club', color: 'text-purple-400', stat: 'SEN' },
        { id: 'rest', label: 'Rest', color: 'text-green-400', stat: 'STR' },
    ] as const;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="WEEKLY SCHEDULE">
            <div className="flex flex-col gap-4 w-full">

                {/* Power Gauge */}
                <div className="bg-gray-800 p-2 rounded border border-gray-600">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>POWER USAGE</span>
                        <span>{totalCost} / {maxPower} PWR</span>
                    </div>
                    <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div
                            className={`h-full transition-all ${remainingPower < 0 ? 'bg-red-500' : 'bg-blue-500'}`}
                            style={{ width: `${Math.min(100, (totalCost / maxPower) * 100)}%` }}
                        ></div>
                    </div>
                    {remainingPower < 0 && (
                        <div className="text-center text-red-500 text-xs font-bold mt-1 animate-pulse">
                            OVER CAPACITY!
                        </div>
                    )}
                </div>

                {/* Rows */}
                <div className="flex flex-col gap-2">
                    {items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between bg-gray-800 p-2 rounded border border-gray-700">
                            <div className="flex flex-col w-20">
                                <span className={`font-bold text-sm ${item.color}`}>{item.label}</span>
                                <span className="text-[10px] text-gray-500">
                                    {item.id === 'rest' ? '-5 STR' : `+1 ${item.stat}`}
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                <PixelButton size="sm" onClick={() => handleChange(item.id, -1)}>-</PixelButton>
                                <span className="w-6 text-center text-xl font-pixel text-white">{tempAlloc[item.id]}</span>
                                <PixelButton size="sm" onClick={() => handleChange(item.id, 1)}>+</PixelButton>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Summary */}
                <PixelCard className="bg-gray-900 border-gray-600">
                    <div className="text-xs font-bold text-center text-gray-400 mb-2 border-b border-gray-700 pb-1">PROJECTED WEEKLY EFFECT</div>
                    <div className="grid grid-cols-2 gap-y-1 gap-x-4 text-xs font-mono">
                        <div className="flex justify-between">
                            <span className="text-blue-400">INT</span>
                            <span>+{netInt}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-red-400">STA</span>
                            <span>+{netSta}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-purple-400">SEN</span>
                            <span>+{netSen}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-red-500 font-bold">STRESS</span>
                            <span className={`${netStress > 0 ? 'text-red-400' : 'text-green-400'}`}>
                                {netStress > 0 ? `+${netStress}` : netStress}
                            </span>
                        </div>
                    </div>
                </PixelCard>

                <div className="flex justify-center mt-2">
                    <PixelButton
                        onClick={handleConfirm}
                        variant="primary"
                        disabled={remainingPower < 0}
                        className="w-full"
                    >
                        CONFIRM SCHEDULE
                    </PixelButton>
                </div>
            </div>
        </Modal>
    );
};

export default UnifiedAllocationPopup;
