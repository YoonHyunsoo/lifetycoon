import React, { useEffect, useState } from 'react';
import { getLeaderboard, LeaderboardEntry } from '../../../lib/saveSystem';
import { fetchGlobalLeaderboard, GlobalLeaderboardEntry } from '../../../lib/leaderboard';

const MOCK_LEADERS: LeaderboardEntry[] = [
    { rank: 1, name: "Elon M.", assets: 300000000000000, displayAssets: "300 Trillion ₩", date: '2024' },
    { rank: 2, name: "Bill G.", assets: 150000000000000, displayAssets: "150 Trillion ₩", date: '2024' },
    { rank: 3, name: "Jay L.", assets: 50000000000000, displayAssets: "50 Trillion ₩", date: '2024' },
    { rank: 4, name: "Warren B.", assets: 40000000000000, displayAssets: "40 Trillion ₩", date: '2024' },
];

interface HallOfWealthProps {
    isOpen: boolean;
    onClose: () => void;
    currentAssets: number;
}

const HallOfWealth: React.FC<HallOfWealthProps> = ({ isOpen, onClose, currentAssets }) => {
    const [localLeaders, setLocalLeaders] = useState<LeaderboardEntry[]>([]);
    const [globalLeaders, setGlobalLeaders] = useState<GlobalLeaderboardEntry[]>([]);
    const [activeTab, setActiveTab] = useState<'local' | 'global'>('global');
    const [isLoading, setIsLoading] = useState(false);

    // Fetch Local
    useEffect(() => {
        if (isOpen) {
            const localScores = getLeaderboard();
            let allScores = [...MOCK_LEADERS, ...localScores];

            // Add CURRENT Game (Virtual Entry)
            const currentEntry: LeaderboardEntry = {
                rank: 0,
                name: "YOU (NOW)",
                assets: currentAssets,
                displayAssets: currentAssets.toLocaleString() + " ₩",
                date: "NOW"
            };
            allScores.push(currentEntry);
            allScores.sort((a, b) => b.assets - a.assets);
            allScores = allScores.slice(0, 10).map((s, i) => ({ ...s, rank: i + 1 }));

            setLocalLeaders(allScores);
        }
    }, [isOpen, currentAssets]);

    // Fetch Global
    useEffect(() => {
        if (isOpen && activeTab === 'global') {
            const loadGlobal = async () => {
                setIsLoading(true);
                const data = await fetchGlobalLeaderboard(20);
                setGlobalLeaders(data);
                setIsLoading(false);
            };
            loadGlobal();
        }
    }, [isOpen, activeTab]);

    if (!isOpen) return null;

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
            <div className="w-full max-w-sm bg-gray-800 border-2 border-yellow-500 rounded-lg shadow-2xl flex flex-col overflow-hidden animate-slide-up h-[70vh]">
                {/* Header */}
                <div className="bg-yellow-600 p-3 text-center border-b-2 border-yellow-500 relative">
                    <h2 className="text-xl font-bold text-white tracking-widest uppercase text-shadow">Hall of Wealth</h2>
                    <p className="text-xs text-yellow-200">World's Richest Tycoons</p>
                    <button onClick={onClose} className="absolute right-2 top-2 text-white/50 hover:text-white">✕</button>

                    {/* Tabs */}
                    <div className="flex justify-center gap-4 mt-2 text-xs font-bold">
                        <button
                            onClick={() => setActiveTab('global')}
                            className={`px-3 py-1 rounded ${activeTab === 'global' ? 'bg-white text-yellow-600' : 'bg-yellow-800 text-yellow-200 hover:bg-yellow-700'}`}
                        >
                            GLOBAL
                        </button>
                        <button
                            onClick={() => setActiveTab('local')}
                            className={`px-3 py-1 rounded ${activeTab === 'local' ? 'bg-white text-yellow-600' : 'bg-yellow-800 text-yellow-200 hover:bg-yellow-700'}`}
                        >
                            LOCAL
                        </button>
                    </div>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto p-2 space-y-2">
                    {activeTab === 'global' ? (
                        isLoading ? (
                            <div className="text-center text-gray-400 py-10">Loading Global Rankings...</div>
                        ) : globalLeaders.length === 0 ? (
                            <div className="text-center text-gray-400 py-10">No records found.<br />Be the first!</div>
                        ) : (
                            globalLeaders.map((entry) => (
                                <div key={entry.rank} className="flex items-center bg-gray-700 p-2 rounded border border-gray-600 animate-fade-in">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mr-3 ${entry.rank <= 3 ? 'bg-yellow-500 text-black' : 'bg-gray-600 text-gray-400'}`}>
                                        {entry.rank}
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <div className="font-bold text-gray-200 truncate">{entry.username}</div>
                                    </div>
                                    <div className="text-yellow-400 font-mono font-bold text-sm">
                                        {entry.display_assets}
                                    </div>
                                </div>
                            ))
                        )
                    ) : (
                        localLeaders.map((entry, idx) => {
                            const isMe = entry.name === "YOU (NOW)";
                            return (
                                <div key={idx} className={`flex items-center p-2 rounded border ${isMe ? 'bg-blue-900/50 border-blue-500' : 'bg-gray-700 border-gray-600'}`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mr-3 ${entry.rank <= 3 ? 'bg-yellow-500 text-black' : isMe ? 'bg-blue-500 text-white' : 'bg-gray-600 text-gray-400'}`}>
                                        {entry.rank}
                                    </div>
                                    <div className="flex-1">
                                        <div className={`font-bold ${isMe ? 'text-white' : 'text-gray-200'}`}>{entry.name}</div>
                                        <div className="text-[10px] text-gray-400">{entry.date}</div>
                                    </div>
                                    <div className={`font-mono font-bold text-sm ${isMe ? 'text-green-400' : 'text-yellow-400'}`}>
                                        {entry.displayAssets}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Footer */}
                <div className="p-3 border-t border-gray-700 bg-gray-800">
                    <div className="text-center text-[10px] text-gray-500 mb-2">
                        {activeTab === 'global' ? 'Supabase Global Rankings' : 'Top 10 Tycoons (Local Storage)'}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HallOfWealth;
