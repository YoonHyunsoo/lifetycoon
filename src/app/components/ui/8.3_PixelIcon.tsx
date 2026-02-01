import React from 'react';

interface PixelIconProps {
    icon: React.ReactNode; // SVG or Lucide Icon
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

const PixelIcon: React.FC<PixelIconProps> = ({ icon, size = 'md', className = '' }) => {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-6 h-6',
        lg: 'w-8 h-8',
    };

    return (
        <div className={`flex items-center justify-center ${sizeClasses[size]} ${className}`}>
            {icon}
        </div>
    );
};

export default PixelIcon;
