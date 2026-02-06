import React from 'react';
import { useGameStore } from '../../../store/gameStore';
import { useEventStore } from '../../../store/eventStore';
// import { ActionIcons } from '../../utils/9.1_ActionIcons';
import { getActionCost } from '../../../lib/gameLogic';

const ActionBar: React.FC = () => {
    const { performAction, power, player, setTutorialFlag } = useGameStore();
    const { triggerEvent } = useEventStore();

    // Determine Actions based on Role
    let currentActions: { id: string; label: string; icon: string }[] = [];

    if (player.isStudent && player.jobTitle === 'High School Student') {
        currentActions = [
            { id: 'study', label: 'Study', icon: '📖' },
            { id: 'exercise', label: 'Exercise', icon: '💪' },
            { id: 'club', label: 'Play', icon: '🎮' },
            { id: 'rest', label: 'Rest', icon: '💤' },
        ];
    } else if (player.isStudent && player.jobTitle === 'College Student') {
        currentActions = [
            { id: 'major_study', label: 'Major', icon: '🎓' }, // Better stats
            { id: 'part_time', label: 'Part-time', icon: '💵' }, // Convert power to cash
            { id: 'club', label: 'Club', icon: '🍺' }, // Social
            { id: 'rest', label: 'Rest', icon: '💤' },
        ];
    } else if (player.jobTitle === 'Job Seeker') {
        currentActions = [
            { id: 'cert_study', label: 'Certify', icon: '✏️' }, // Raise stats for job
            { id: 'cv', label: 'Write CV', icon: '📝' }, // Sense/Luck?
            { id: 'part_time', label: 'Part-time', icon: '💵' },
            { id: 'rest', label: 'Rest', icon: '💤' },
        ];
    } else {
        // Employment (Intern, Regular, etc)
        currentActions = [
            { id: 'work', label: 'Work', icon: '💼' }, // Rep++, Stress++
            { id: 'overtime', label: 'Overtime', icon: '🔥' }, // Rep++++, Stress++++
            { id: 'politics', label: 'Politics', icon: '🤝' }, // Sense++, Rep+
            { id: 'rest', label: 'Rest', icon: '💤' },
        ];
    }

    // Calculate Dynamic Cost
    const currentCost = getActionCost(10, player.stress, player.stamina);
    const isHighCost = currentCost > 10;
    const isVeryHighCost = currentCost >= 20;

    const handleAction = (action: string) => {
        // cast to any because performAction handles strings now
        const act = action as any;

        if (power < currentCost) {
            console.warn('[ActionBar] Not enough power');
            return;
        }

        // [TUTORIAL CHECK] - Only for HS actions for now, or add more tutorials later
        if (['study', 'exercise', 'club', 'rest'].includes(act) && !(player.tutorialFlags as any)?.[act]) {
            // ... (Existing Tutorial Logic, keep simple)
            // For now, let's just trigger event if it is in the list.
            // If we add new tutorials for Job, we add them here.
            // Since we are refactoring, let's keep the HS tutorial logic but skip for new actions for now.
            if (player.jobTitle === 'High School Student') {
                // ... original logic ...
                triggerEvent({
                    id: `tut-${act}`,
                    type: 'notification',
                    title: `Tutorial: ${act.toUpperCase()}`,
                    description: "This is your first time doing this.\nManage your stats carefully.",
                    choices: [{ label: "Got it!", action: () => setTutorialFlag(act) }]
                });
                return;
            }
        }

        performAction(act);
    };

    return (
        <div className="w-full h-full bg-gray-900 border-t-4 border-gray-700 p-2 grid grid-cols-4 gap-2">
            {currentActions.map((act) => {
                const isRest = act.id === 'rest';
                const isRestRecommended = isRest && player.stress >= 40;

                return (
                    <button
                        key={act.id}
                        onClick={() => handleAction(act.id)}
                        className={`
                            relative flex flex-col items-center justify-center p-2 rounded transition-all cursor-pointer
                            ${isRestRecommended ? 'bg-yellow-900/50 border border-yellow-500 animate-pulse' : 'bg-gray-800 hover:bg-gray-700 active:bg-gray-600'}
                            disabled:opacity-50 disabled:cursor-not-allowed
                        `}
                        disabled={power < currentCost}
                    >
                        {/* Cost Badge */}
                        <div className={`absolute top-0.5 right-1 text-[8px] font-bold ${isVeryHighCost ? 'text-red-500' : isHighCost ? 'text-yellow-500' : 'text-blue-300'}`}>
                            -{currentCost}⚡
                        </div>

                        <span className="text-2xl mt-1">{act.icon}</span>
                        <span className="text-[10px] uppercase mt-0.5 text-gray-300">{act.label}</span>
                    </button>
                );
            })}
        </div>
    );
};

export default ActionBar;
