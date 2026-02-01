import React from 'react';

interface PixelBackgroundProps {
    children?: React.ReactNode;
}

const PixelBackground: React.FC<PixelBackgroundProps> = ({ children }) => {
    return (
        <div className="relative w-full h-full bg-blue-900 overflow-hidden">
            {/* 도시 배경 레이어 (추후 이미지로 교체) */}
            <div className="absolute inset-0 opacity-20 bg-[url('https://placehold.co/800x600/101040/FFF?text=City+BG')] bg-cover bg-center" />
            <div className="relative z-10 w-full h-full">
                {children}
            </div>
        </div>
    );
};

export default PixelBackground;
