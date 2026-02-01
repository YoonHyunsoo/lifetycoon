import React, { useEffect, useState } from 'react';
import Modal from '../ui/4.1_Modal';
import PixelButton from '../ui/8.2_PixelButton';
import PixelCard from '../ui/8.1_PixelCard';
import { getSaveInfo, loadGame } from '../../../lib/saveSystem';
import { useGameStore } from '../../../store/gameStore';
import { useEventStore } from '../../../store/eventStore';

interface LoadGamePopupProps {
    isOpen: boolean;
    onClose: () => void;
    onLoadComplete: () => void;
}

interface SaveSlotInfo {
    exists: boolean;
    timestamp?: number;
    summary?: string;
}

const LoadGamePopup: React.FC<LoadGamePopupProps> = ({ isOpen, onClose, onLoadComplete }) => {
    const [autoSave, setAutoSave] = useState<SaveSlotInfo>({ exists: false });
    const [manualSave, setManualSave] = useState<SaveSlotInfo>({ exists: false });

    useEffect(() => {
        if (isOpen) {
            const autoData = getSaveInfo('auto');
            setAutoSave({
                exists: !!autoData,
                timestamp: autoData?.timestamp,
                summary: autoData ? `Day ${Math.floor((autoData.player.age - 17) * 48)}` : undefined
            });

            const manualData = getSaveInfo('manual');
            setManualSave({
                exists: !!manualData,
                timestamp: manualData?.timestamp,
                summary: manualData ? `Day ${Math.floor((manualData.player.age - 17) * 48)}` : undefined
            });
        }
    }, [isOpen]);

    const handleLoad = (type: 'auto' | 'manual') => {
        if (loadGame(useGameStore, useEventStore, type)) {
            onLoadComplete();
        } else {
            alert("Failed to load save file.");
        }
    };

    const formatDate = (ts?: number) => {
        if (!ts) return '-';
        return new Date(ts).toLocaleString();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="LOAD GAME">
            <div className="flex flex-col gap-4 w-full">

                {/* Auto Save Slot */}
                <PixelCard className={`bg-gray-800 ${autoSave.exists ? 'border-blue-500' : 'border-gray-600 opacity-50'}`}>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-blue-400 font-bold">AUTO SAVE</span>
                        <span className="text-[10px] text-gray-400">{formatDate(autoSave.timestamp)}</span>
                    </div>
                    {autoSave.exists ? (
                        <div className="flex justify-between items-end">
                            <div className="text-sm text-white">{autoSave.summary}</div>
                            <PixelButton size="sm" onClick={() => handleLoad('auto')}>LOAD</PixelButton>
                        </div>
                    ) : (
                        <div className="text-xs text-center text-gray-500 py-2">No Auto Save Data</div>
                    )}
                </PixelCard>

                {/* Manual Save Slot */}
                <PixelCard className={`bg-gray-800 ${manualSave.exists ? 'border-yellow-500' : 'border-gray-600 opacity-50'}`}>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-yellow-400 font-bold">MANUAL SAVE</span>
                        <span className="text-[10px] text-gray-400">{formatDate(manualSave.timestamp)}</span>
                    </div>
                    {manualSave.exists ? (
                        <div className="flex justify-between items-end">
                            <div className="text-sm text-white">{manualSave.summary}</div>
                            <PixelButton size="sm" onClick={() => handleLoad('manual')}>LOAD</PixelButton>
                        </div>
                    ) : (
                        <div className="text-xs text-center text-gray-500 py-2">No Manual Save Data</div>
                    )}
                </PixelCard>

            </div>
        </Modal>
    );
};

export default LoadGamePopup;
