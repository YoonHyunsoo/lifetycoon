import React from 'react';
import { useGameStore } from '../../../store/gameStore';

const RoomView: React.FC = () => {
    const { player } = useGameStore();

    const bgImage = player.isStudent ? '/assets/bg_classroom.png' : '/assets/bg_city.png';

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
            <div className="z-10 mb-8 transform scale-150 origin-bottom">
                <div className="w-16 h-16 bg-blue-500 rounded-lg border-4 border-black animate-pulse flex items-center justify-center text-white text-xs text-center leading-tight">
                    PIXEL<br />CHAR
                </div>
            </div>

            {/* Floor */}
            <div className="absolute bottom-0 w-full h-8 bg-[#3a2e26] border-t-4 border-[#2a221c]" />
        </div>
    );
};

export default RoomView;
