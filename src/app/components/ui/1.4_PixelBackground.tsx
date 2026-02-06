import React from 'react';

interface PixelBackgroundProps {
    children?: React.ReactNode;
}

const PixelBackground: React.FC<PixelBackgroundProps> = ({ children }) => {
    return (
        <div className="relative w-full h-full bg-blue-900 overflow-hidden">
            {/* City Background Layer */}
            <div className="absolute inset-0 opacity-40">
                <img
                    src="/assets/bg_city_night.png"
                    alt="City Background"
                    className="w-full h-full object-cover pixelated"
                    onError={(e) => {
                        e.currentTarget.src = 'https://placehold.co/800x600/101040/FFF?text=Mudspoon+City';
                    }}
                />
            </div>
            <div className="relative z-10 w-full h-full">
                {children}
            </div>
        </div>
    );
};

export default PixelBackground;
