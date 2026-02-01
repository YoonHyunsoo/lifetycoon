import React from 'react';
import { useGameStore } from '../../../store/gameStore';
import type { Quest } from '../../../store/gameStore';

interface QuestPopupProps {
    isOpen: boolean;
    onClose: () => void;
    category: string; // e.g. "M&D", "LOVE"
}

const QuestPopup: React.FC<QuestPopupProps> = ({ isOpen, onClose, category }) => {
    if (!isOpen) return null;

    const { player } = useGameStore();
    const quests = player.activeQuests || [];

    // Filter by category? For now, we only have M&D active. 
    // Maybe valid quests have a 'type' or we just show all if generic.
    // User asked "M&D 누르면... 부모님 퀘스트 목록".
    // Let's assume quests have a 'source' or we filter by ID prefix or check if title relates to Parents.
    // For simplicity MVP: Show ALL active quests, or filtered if we add 'type' to Quest interface.
    // Quest interface: id, title, description, progress, goal, reward.
    // Let's filter by ID prefix "quest-md-" or just show all for now.
    // Actually, let's show all for now as only M&D is implemented.

    const displayQuests = quests;

    const getTitle = (cat: string) => {
        if (cat === "M&D") return "Mom & Dad Quests";
        return `${cat} Quests`;
    };

    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center backdrop-blur-sm">
            <div className="bg-gray-800 border-4 border-yellow-600 rounded-lg p-6 w-96 shadow-2xl animate-fade-in relative flex flex-col gap-4 max-h-[80vh]">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute -top-3 -right-3 bg-red-500 text-white w-8 h-8 rounded-full border-2 border-red-700 flex items-center justify-center text-sm font-bold hover:bg-red-600 z-10"
                >
                    X
                </button>

                {/* Title */}
                <h2 className="text-xl font-bold text-yellow-400 text-center border-b-2 border-yellow-600 pb-2">
                    {getTitle(category)}
                </h2>

                {/* List */}
                <div className="flex flex-col gap-2 overflow-y-auto">
                    {displayQuests.length === 0 ? (
                        <div className="text-gray-500 text-center py-8 italic">
                            No Active Quests
                        </div>
                    ) : (
                        displayQuests.map(quest => (
                            <div key={quest.id} className="bg-gray-900 p-3 rounded border border-gray-700 flex flex-col gap-1">
                                <div className="flex justify-between items-start">
                                    <span className="font-bold text-yellow-200 text-sm">{quest.title}</span>
                                    <span className="text-xs text-green-400">{quest.reward}</span>
                                </div>
                                <p className="text-xs text-gray-400">{quest.description}</p>

                                {/* Progress Bar */}
                                <div className="mt-1">
                                    <div className="flex justify-between text-[10px] text-gray-500 mb-0.5">
                                        <span>Progress</span>
                                        <span>{quest.progress} / {quest.goal}</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-yellow-500 transition-all duration-500"
                                            style={{ width: `${Math.min(100, (quest.progress / quest.goal) * 100)}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuestPopup;
