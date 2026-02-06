import React from 'react';
import { useGameStore } from '../../../store/gameStore';

const RoomView: React.FC = () => {
    const { player, currentVisualAction } = useGameStore();

    const bgImage = player.isStudent ? '/assets/bg_classroom.png' : '/assets/bg_studio_room.png';

    return (
        <div className="w-full h-full relative bg-gray-700 flex flex-col items-center justify-end overflow-hidden border-x border-gray-800">
            {/* Room Background */}
            <div
                className="absolute inset-0 bg-cover bg-center pixelated opacity-80"
                style={{ backgroundImage: `url(${bgImage})` }}
            />

            {/* Thought Bubble / Status Message */}
            <div className="absolute top-8 animate-bounce-small z-10">
                <div className="bg-white text-black text-xs p-2 rounded-lg border-2 border-black relative">
                    {player.stress > 30 ? "I'm so tired..." : "Let's do this!"}
                    <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-r-2 border-b-2 border-black rotate-45 transform"></div>
                </div>
            </div>

            {/* Character Sprite Placeholder */}
            {/* Character Sprite */}
            {/* Character Sprite Logic */}
            {(() => {
                // 1. Determine Base Path (Age/Job Role)
                // For now, simplify to just 'char' as requested, or 'char_student', 'char_adult' if we had them. 
                // Using 'char' prefix.
                // const rolePrefix = player.age < 20 ? 'student' : 'adult'; 
                // User only uploaded char_idle.png, let's stick to base for now but implement logic structure.

                // 2. Determine State Suffix
                let suffix = 'idle';

                if (currentVisualAction) {
                    // Action State (1.5s)
                    suffix = currentVisualAction; // e.g., 'study', 'exercise'
                } else {
                    // Idle State (Based on Stress)
                    if (player.stress >= 40) suffix = 'exhausted';
                    else if (player.stress >= 20) suffix = 'tired';
                    else suffix = 'idle'; // Happy/Normal
                }

                // 3. Construct Path
                // Fallback Logic: Since we only have char_idle.png right now,
                // we'll try to use specific ones, but onError will fallback to char_idle.
                // Filename format: char_{suffix}.png
                const spritePath = `/assets/char_${suffix}.png`;

                return (
                    <div className="z-10 mb-8 transform scale-150 origin-bottom h-[15vh] max-h-[150px] aspect-square flex items-end justify-center">
                        <img
                            key={spritePath} // Force re-render on change
                            src={spritePath}
                            alt={`Character ${suffix}`}
                            className="w-full h-full object-contain pixelated animate-bounce-small mix-blend-multiply"
                            onError={(e) => {
                                // Fallback to char_idle.png if specific action sprite missing
                                if (e.currentTarget.src.includes('char_idle.png')) {
                                    // If even idle fails, hide
                                    e.currentTarget.style.display = 'none';
                                } else {
                                    e.currentTarget.src = '/assets/char_idle.png';
                                }
                            }}
                        />
                    </div>
                );
            })()}

            {/* Floor */}
            <div className="absolute bottom-0 w-full h-8 bg-[#3a2e26] border-t-4 border-[#2a221c]" />
        </div>
    );
};

export default RoomView;
