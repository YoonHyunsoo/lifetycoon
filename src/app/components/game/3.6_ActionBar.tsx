import React from 'react';
import { useGameStore } from '../../../store/gameStore';
import { useEventStore } from '../../../store/eventStore';
import { ActionIcons } from '../../utils/9.1_ActionIcons';
import { getActionCost } from '../../../lib/gameLogic';

const ActionBar: React.FC = () => {
    const { performAction, power, player, setTutorialFlag } = useGameStore();
    const { triggerEvent } = useEventStore(); // We need this

    // Calculate Dynamic Cost
    const currentCost = getActionCost(10, player.stress, player.stamina);
    const isHighCost = currentCost > 10;
    const isVeryHighCost = currentCost >= 20;

    const handleAction = (action: 'study' | 'exercise' | 'club' | 'rest') => {
        console.log(`[ActionBar] Clicked: ${action}, Power: ${power}, Cost: ${currentCost}`); // DEBUG check

        if (power < currentCost) {
            console.warn('[ActionBar] Not enough power');
            return;
        }

        // [TUTORIAL CHECK]
        console.log(`[ActionBar] Tutorial Flag [${action}]:`, player.tutorialFlags?.[action]);
        if (!player.tutorialFlags?.[action]) {
            console.log('[ActionBar] Triggering Tutorial Event for:', action);
            // content for tutorials
            const tutorials = {
                study: { title: "Tutorial: STUDY", desc: "Gain INTELLIGENCE.\nCrucial for Exam Scores (Month 5,7,10,12).\n⚠️ Increases Stress significantly." },
                exercise: { title: "Tutorial: EXERCISE", desc: "Gain STAMINA.\nReduces Action Cost for ALL actions.\nEssential for long-term efficiency." },
                club: { title: "Tutorial: PLAY", desc: "Gain SENSE.\nRequired for romance & special jobs.\n⚠️ Lowers Intelligence slightly." },
                rest: { title: "Tutorial: REST", desc: "Recover STRESS.\nHigh Stress increases Action Costs.\nManage stress to keep costs low." }
            };

            triggerEvent({
                id: `tut-${action}`,
                type: 'notification',
                title: tutorials[action].title,
                description: tutorials[action].desc,
                choices: [{
                    label: "Got it!",
                    action: () => {
                        console.log('[Tutorial] Confirmed:', action);
                        setTutorialFlag(action);
                    }
                }]
            });
            return;
        }

        console.log('[ActionBar] Performing Action:', action);
        performAction(action);
    };

    const actions: { id: 'study' | 'exercise' | 'club' | 'rest', label: string }[] = [
        { id: 'study', label: 'Study' },
        { id: 'exercise', label: 'Exercise' },
        { id: 'club', label: 'Play' },
        { id: 'rest', label: 'Rest' },
    ];

    return (
        <div className="w-full h-full bg-gray-900 border-t-4 border-gray-700 p-2 grid grid-cols-4 gap-2">
            {actions.map((act) => {
                const isRest = act.id === 'rest';
                // Rest Warning: If stress is high, make Rest button pulsate
                const isRestRecommended = isRest && player.stress >= 40;

                // Effective Cost Display
                // Rest also consumes power? Yes, per mechanics (Power -10/Cost).
                // But visualized, maybe we want to show it clearly.

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

                        <span className="text-2xl mt-1">{act.id === 'club' ? '🎮' : ActionIcons[act.id]}</span>
                        <span className="text-[10px] uppercase mt-0.5 text-gray-300">{act.label}</span>

                        {/* Hint for Study exam impact? */}
                        {act.id === 'study' && (
                            <div className="absolute bottom-0.5 text-[6px] text-gray-500 opacity-0 hover:opacity-100 transition-opacity">
                                Exams++
                            </div>
                        )}
                    </button>
                );
            })}
        </div>
    );
};

export default ActionBar;
