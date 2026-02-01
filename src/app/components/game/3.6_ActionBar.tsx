import React from 'react';
import { useGameStore } from '../../../store/gameStore';
import { ActionIcons } from '../../utils/9.1_ActionIcons';

const ActionBar: React.FC = () => {
    const { performAction, power } = useGameStore();

    const handleAction = (action: 'study' | 'exercise' | 'club' | 'rest') => {
        if (power < 1) return; // Simple check, store does internal check too
        performAction(action);
    };

    const actions: { id: 'study' | 'exercise' | 'club' | 'rest', label: string }[] = [
        { id: 'study', label: 'Study' },
        { id: 'exercise', label: 'Exercise' },
        { id: 'club', label: 'Club' },
        { id: 'rest', label: 'Rest' },
    ];

    return (
        <div className="w-full h-full bg-gray-900 border-t-4 border-gray-700 p-2 grid grid-cols-4 gap-2">
            {actions.map((act) => (
                <button
                    key={act.id}
                    onClick={() => handleAction(act.id)}
                    className="bg-gray-800 hover:bg-gray-700 active:bg-gray-600 transition-colors cursor-pointer flex flex-col items-center justify-center p-2 rounded disabled:opacity-50"
                    disabled={power < 1}
                >
                    <span className="text-2xl">{ActionIcons[act.id]}</span>
                    <span className="text-[10px] uppercase mt-1 text-gray-300">{act.label}</span>
                </button>
            ))}
        </div>
    );
};

export default ActionBar;
