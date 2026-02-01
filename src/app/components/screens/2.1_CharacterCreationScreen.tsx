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
    const [step, setStep] = useState(1);
    const [name, setName] = useState('');
    const [stats, setStats] = useState({ intelligence: 5, stamina: 5, sense: 5, luck: 5 });
    const [isRolling, setIsRolling] = useState(false);

    const handleRoll = () => {
        setIsRolling(true);
        // Simulate rolling delay
        setTimeout(() => {
            setStats({
                intelligence: Math.floor(Math.random() * 13) + 3, // 3~15
                stamina: Math.floor(Math.random() * 13) + 3,
                sense: Math.floor(Math.random() * 13) + 3,
                luck: Math.floor(Math.random() * 13) + 3,
            });
            setIsRolling(false);
        }, 600);
    };

    const handleStart = () => {
        if (!name.trim()) return alert('Please enter a name!');
        initializeGame(name, [stats.intelligence, stats.stamina, stats.sense, stats.luck]);
        onComplete();
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen w-full max-w-md mx-auto bg-gray-900 p-6 gap-6">
            <h2 className="text-2xl text-yellow-400 font-bold mb-4 font-pixel">Create Character</h2>

            {step === 1 && (
                <PixelCard className="w-full flex flex-col gap-6">
                    <PixelInput
                        label="CHARACTER NAME"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter name..."
                    />
                    <PixelButton onClick={() => setStep(2)}>NEXT</PixelButton>
                </PixelCard>
            )}

            {step === 2 && (
                <div className="w-full flex flex-col gap-6">
                    <DiceRoller onRoll={handleRoll} rolling={isRolling} />

                    <StatDistribution stats={stats} />

                    <div className="flex gap-2 w-full">
                        <PixelButton variant="secondary" onClick={() => setStep(1)} className="flex-1">BACK</PixelButton>
                        <PixelButton onClick={handleStart} className="flex-1">START LIFE</PixelButton>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CharacterCreationScreen;
