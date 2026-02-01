import React, { useState } from 'react';
import { useGameStore } from '../../../store/gameStore';
import { useEventStore } from '../../../store/eventStore';
import { saveGame } from '../../../lib/saveSystem';
import UnifiedAllocationPopup from './UnifiedAllocationPopup';
import MenuPopup from '../ui/MenuPopup';
import SavePopup from '../ui/SavePopup';

const AllocationControl: React.FC = () => {
    const { allocation, time, isPlaying, togglePlay } = useGameStore();
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSavePopupOpen, setIsSavePopupOpen] = useState(false);
    const [saveFeedback, setSaveFeedback] = useState<string | null>(null);

    // const COST_PER_UNIT = 10;
    const totalUnits = allocation.study + allocation.exercise + allocation.club + allocation.rest;

    // Trigger Popup
    const handleSaveClick = () => {
        setIsSavePopupOpen(true);
    };

    // Actual Save (Passed to Popup)
    const handleConfirmSave = () => {
        saveGame(useGameStore.getState(), useEventStore.getState(), 'manual');
        setSaveFeedback('SAVED');
        setTimeout(() => setSaveFeedback(null), 1000);
    };

    return (
        <>
            <div className="w-full bg-gray-900 border-t-4 border-gray-700 p-2 flex flex-col gap-2">
                {/* NEW HEADER AREA: Date | Play */}
                <div className="flex justify-between items-center bg-gray-800 rounded p-1 border border-gray-600 px-3">
                    {/* Left: Date */}
                    <div className="flex gap-2 text-sm font-bold items-center">
                        <span className="text-yellow-400">Year{(time.year - 2023).toString().padStart(2, '0')}</span>
                        <span className="text-gray-500">Month{time.month.toString().padStart(2, '0')}</span>

                        {/* Week Gauge */}
                        <div className="flex gap-0.5 ml-1">
                            {[1, 2, 3, 4].map(w => (
                                <div
                                    key={w}
                                    className={`w-2 h-3 rounded-sm ${w <= time.week ? 'bg-green-400' : 'bg-gray-700'}`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Right: Controls (Menu, Save, Play) */}
                    <div className="flex gap-2">
                        {/* MENU BUTTON */}
                        <button
                            onClick={() => setIsMenuOpen(true)}
                            className={`h-9 w-10 rounded border-2 flex flex-col items-center justify-center shadow-lg transition-all gap-0.5 bg-gray-700 border-gray-500 text-gray-300 hover:bg-gray-600 active:scale-95`}
                        >
                            <span className="text-[8px] font-bold uppercase leading-none mt-0.5">MENU</span>
                            <div className="text-[10px]">☰</div>
                        </button>

                        {/* SAVE BUTTON */}
                        <button
                            onClick={handleSaveClick}
                            className={`h-9 w-10 rounded border-2 flex flex-col items-center justify-center shadow-lg transition-all gap-0.5 bg-blue-900/80 border-blue-500 text-blue-400 hover:bg-blue-800 active:scale-95`}
                        >
                            <span className="text-[8px] font-bold uppercase leading-none mt-0.5">{saveFeedback || 'SAVE'}</span>
                            <div className="text-[10px]">💾</div>
                        </button>

                        {/* PLAY BUTTON */}
                        <button
                            onClick={togglePlay}
                            className={`h-9 w-10 rounded border-2 flex flex-col items-center justify-center shadow-lg transition-all gap-0.5 ${isPlaying
                                ? 'bg-yellow-900/80 border-yellow-500 text-yellow-500 hover:bg-yellow-800'
                                : 'bg-green-900/80 border-green-500 text-green-500 hover:bg-green-800 animate-pulse'
                                }`}
                        >
                            <span className="text-[8px] font-bold uppercase leading-none mt-0.5">{isPlaying ? 'PAUSE' : 'PLAY'}</span>
                            {isPlaying ? (
                                <div className="flex gap-1 mb-0.5">
                                    <div className="w-1 h-2.5 bg-current"></div>
                                    <div className="w-1 h-2.5 bg-current"></div>
                                </div>
                            ) : (
                                <div className="w-0 h-0 border-t-4 border-t-transparent border-l-[6px] border-l-current border-b-4 border-b-transparent ml-0.5 mb-0.5"></div>
                            )}
                        </button>
                    </div>
                </div>

                {/* WEEKLY SCHEDULE BUTTON */}
                <button
                    onClick={() => setIsPopupOpen(true)}
                    className="w-full h-12 bg-gray-800 hover:bg-gray-700 active:bg-gray-600 border-2 border-dashed border-gray-600 rounded flex items-center justify-between px-4 transition-colors group"
                >
                    <div className="flex flex-col items-start gap-0">
                        <span className="text-gray-400 text-[10px] font-bold group-hover:text-white transition-colors">WEEKLY SCHEDULE</span>
                        <div className="flex gap-2 text-xs font-pixel text-white">
                            {allocation.study > 0 && <span className="text-blue-400">STU {allocation.study}</span>}
                            {allocation.exercise > 0 && <span className="text-red-400">EXE {allocation.exercise}</span>}
                            {allocation.club > 0 && <span className="text-purple-400">CLB {allocation.club}</span>}
                            {allocation.rest > 0 && <span className="text-green-400">RST {allocation.rest}</span>}
                            {totalUnits === 0 && <span className="text-gray-500">No Actions Planned</span>}
                        </div>
                    </div>

                    <div className="text-[10px] text-gray-500">
                        CLICK TO EDIT
                    </div>
                </button>
            </div>

            <UnifiedAllocationPopup
                isOpen={isPopupOpen}
                onClose={() => setIsPopupOpen(false)}
            />

            <MenuPopup
                isOpen={isMenuOpen}
                onClose={() => setIsMenuOpen(false)}
            />

            <SavePopup
                isOpen={isSavePopupOpen}
                onClose={() => setIsSavePopupOpen(false)}
                onConfirm={handleConfirmSave}
            />
        </>
    );
};

export default AllocationControl;
