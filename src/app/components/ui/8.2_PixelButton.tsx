import React from 'react';

interface PixelButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger';
    size?: 'sm' | 'md' | 'lg';
}

const PixelButton: React.FC<PixelButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    ...props
}) => {
    const baseStyles = "font-pixel border-4 active:border-b-0 active:translate-y-1 transition-all";

    const variants = {
        primary: "bg-blue-600 border-blue-800 text-white hover:bg-blue-500",
        secondary: "bg-gray-600 border-gray-800 text-white hover:bg-gray-500",
        danger: "bg-red-600 border-red-800 text-white hover:bg-red-500",
    };

    const sizes = {
        sm: "px-2 py-1 text-xs",
        md: "px-4 py-2 text-sm",
        lg: "px-6 py-3 text-base",
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default PixelButton;
