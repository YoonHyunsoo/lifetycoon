import React, { useState } from 'react';
import { useGameStore } from '../../../store/gameStore';
import { useEventStore } from '../../../store/eventStore';

const DevControls: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { player, time } = useGameStore();
    const { triggerEvent } = useEventStore();
    const [customEventId, setCustomEventId] = useState("");

    const handleAddCash = () => {
        useGameStore.setState(state => ({
            player: { ...state.player, cash: state.player.cash + 10000000 }
        }));
    };

    const handleMaxStats = () => {
        useGameStore.setState(state => ({
            player: {
                ...state.player,
                intelligence: 999,
                stamina: 999,
                sense: 999,
                luck: 999
            }
        }));
    };

    const handleClearStress = () => {
        useGameStore.setState(state => ({
            player: { ...state.player, stress: 0 }
        }));
    };

    const handleSkipMonth = () => {
        // Force advance week 4 times
        const state = useGameStore.getState();
        for (let i = 0; i < 4; i++) state.advanceWeek();
    };

    const handleTriggerEvent = () => {
        if (!customEventId) return;
        triggerEvent({
            id: `dev-${Date.now()}`,
            type: 'normal',
            title: 'DEV FORCE EVENT',
            description: `Forced event ID: ${customEventId}`,
            choices: [{ label: 'OK', action: () => { } }]
        });
        // Real event ID logic would need a lookup from a database, 
        // but here we just simulate an event trigger.
        // If user wants to trigger a PRE-DEFINED event by ID, we need access to the event logic or definitions.
        // For now, let's just trigger a generic test event.
    };

    const handleToggleStudent = () => {
        useGameStore.setState(state => ({
            player: { ...state.player, isStudent: !state.player.isStudent }
        }));
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-1 left-1 bg-red-900/50 text-red-500 text-[8px] p-1 rounded z-50 hover:bg-red-900"
            >
                DEV
            </button>
        );
    }

    return (
        <div className="fixed bottom-10 left-4 bg-black/90 border-2 border-red-500 p-2 rounded z-50 w-48 text-[10px] flex flex-col gap-2 shadow-xl">
            <div className="flex justify-between items-center text-red-400 font-bold border-b border-red-800 pb-1">
                <span>DEV CONTROL</span>
                <button onClick={() => setIsOpen(false)}>X</button>
            </div>

            <div className="grid grid-cols-2 gap-1">
                <DevBtn label="+10M Cash" onClick={handleAddCash} />
                <DevBtn label="Clear Stress" onClick={handleClearStress} />
                <DevBtn label="Max Stats" onClick={handleMaxStats} />
                <DevBtn label="Skip Month" onClick={handleSkipMonth} />
                <DevBtn label="Toggle Student" onClick={handleToggleStudent} />
                <DevBtn label="Stock Crash" onClick={() => alert('TODO')} />
            </div>

            <div className="flex gap-1 mt-1">
                <input
                    className="bg-gray-800 text-white w-full px-1 border border-gray-600 rounded"
                    placeholder="Event ID"
                    value={customEventId}
                    onChange={(e) => setCustomEventId(e.target.value)}
                />
                <button onClick={handleTriggerEvent} className="bg-blue-900 text-blue-200 px-2 rounded border border-blue-700">
                    Run
                </button>
            </div>

            <div className="text-[8px] text-gray-500 font-mono mt-1">
                {player.jobTitle} | Age {player.age}
            </div>
        </div>
    );
};

const DevBtn: React.FC<{ label: string, onClick: () => void }> = ({ label, onClick }) => (
    <button
        onClick={onClick}
        className="bg-gray-800 text-gray-200 p-1 rounded hover:bg-gray-700 border border-gray-600 text-center active:bg-gray-600"
    >
        {label}
    </button>
);

export default DevControls;
