import React from 'react';

interface PixelCardProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
}

const PixelCard: React.FC<PixelCardProps> = ({ children, className = '', title }) => {
    return (
        <div className={`relative border-4 border-gray-700 bg-gray-800 p-4 ${className}`}>
            {/* Corner Decorations could go here */}
            {title && (
                <div className="absolute -top-3 left-4 bg-gray-900 px-2 text-yellow-500 font-bold text-xs">
                    {title}
                </div>
            )}
            {children}
        </div>
    );
};

export default PixelCard;
