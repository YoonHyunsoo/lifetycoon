import React, { useEffect, useState } from 'react';
import { useGameStore } from '../../../store/gameStore';

const FX_FloatingText: React.FC = () => {
    const { feedback } = useGameStore();
    const [animationKey, setAnimationKey] = useState(0);

    useEffect(() => {
        if (feedback) {
            // Trigger animation
            setAnimationKey(prev => prev + 1);
        }
    }, [feedback]);

    if (!feedback) return null;

    return (
        <div key={animationKey} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50 flex flex-col items-center">
            {/* Icon Animation */}
            {feedback.icon && <div className="text-4xl animate-bounce mb-1">{feedback.icon}</div>}

            {/* Text Animation */}
            <div className={`animate-float-up font-bold text-xl shadow-black drop-shadow-md ${feedback.color} whitespace-nowrap`}>
                {feedback.text}
            </div>
        </div>
    );
};

export default FX_FloatingText;
