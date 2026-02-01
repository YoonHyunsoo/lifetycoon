import React, { useState } from 'react';
import PixelButton from '../ui/8.2_PixelButton';
import PixelCard from '../ui/8.1_PixelCard';
import PixelInput from '../ui/2.2_PixelInput';
import DiceRoller from '../character/2.3_DiceRoller';
import StatDistribution from '../character/2.4_StatDistribution';
import { useGameStore } from '../../../store/gameStore';

interface CharacterCreationScreenProps {
    onComplete: () => void;
}

const CharacterCreationScreen: React.FC<CharacterCreationScreenProps> = ({ onComplete }) => {
    const { initializeGame } = useGameStore();

    // Combined State
    const [name, setName] = useState('');
    const [stats, setStats] = useState({ intelligence: 5, stamina: 5, sense: 5, luck: 5 }); // Luck initial is dummy
    const [isRolling, setIsRolling] = useState(false);

    // Animation State
    const [showGodDice, setShowGodDice] = useState(false);
    const [godMessage, setGodMessage] = useState("");

    const handleRoll = () => {
        setIsRolling(true);
        // Simulate rolling delay
        setTimeout(() => {
            setStats({
                intelligence: Math.floor(Math.random() * 13) + 3, // 3~15
                stamina: Math.floor(Math.random() * 13) + 3,
                sense: Math.floor(Math.random() * 13) + 3,
                luck: 5, // Placeholder, hidden
            });
            setIsRolling(false);
        }, 600);
    };

    const handleStartLife = () => {
        if (!name.trim()) return alert('Please enter a name!');

        // Trigger God's Dice Animation
        setShowGodDice(true);
        setGodMessage("God is rolling the dice of fate...");

        // Sequence
        setTimeout(() => {
            // Roll Luck Result
            const finalLuck = Math.floor(Math.random() * 26) + 5; // 5 ~ 30
            setGodMessage(`LUCK: ${finalLuck}!`);

            // Update Stats locally for visual (optional)
            setStats(prev => ({ ...prev, luck: finalLuck }));

            setTimeout(() => {
                // Initialize & Start
                initializeGame(name, [stats.intelligence, stats.stamina, stats.sense, finalLuck]);
                onComplete();
            }, 1500); // Wait 1.5s to see result
        }, 2000); // 2s Rolling anticipation
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen w-full max-w-md mx-auto bg-gray-900 p-6 gap-6 relative overflow-hidden">
            <h2 className="text-2xl text-yellow-400 font-bold mb-2 font-pixel">Create Character</h2>

            <div className="w-full flex flex-col gap-4 overflow-y-auto pb-4">
                {/* 1. Name Input */}
                <PixelInput
                    label="CHARACTER NAME"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter name..."
                />

                {/* 2. Stat Dice */}
                <div className="flex gap-4 items-center justify-between bg-gray-800 p-3 border-2 border-gray-700">
                    <div className="text-xs text-gray-400 w-1/2">
                        Roll for <span className="text-blue-300">Int</span>, <span className="text-red-300">Sta</span>, <span className="text-purple-300">Sen</span>.
                    </div>
                    <DiceRoller onRoll={handleRoll} rolling={isRolling} />
                </div>

                {/* 3. Stat View (Luck Hidden) */}
                <StatDistribution stats={stats} hiddenLuck={true} />

                {/* 4. Start Button */}
                <PixelButton
                    onClick={handleStartLife}
                    className="w-full py-4 text-lg animate-pulse"
                    disabled={isRolling || !name}
                >
                    START LIFE
                </PixelButton>
            </div>

            {/* GOD'S DICE OVERLAY */}
            {showGodDice && (
                <div className="absolute inset-0 bg-black/90 z-50 flex flex-col items-center justify-center animate-fade-in">
                    <div className="text-6xl mb-8 animate-bounce">🎲</div>
                    <div className="text-2xl text-yellow-400 font-bold text-center px-4 font-pixel whitespace-pre-line">
                        {godMessage}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CharacterCreationScreen;
