import React from 'react';

interface PixelButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
}

const PixelButton: React.FC<PixelButtonProps> = ({ onClick, children, variant = 'primary', size = 'md', className = '', type = 'button', disabled = false, isLoading = false, ...props }) => {

    const baseStyles = "font-pixel font-bold uppercase transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2";

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
            onClick={onClick}
            disabled={disabled || isLoading}
            type={type}
            {...props}
        >
            {children}
        </button>
    );
};

export default PixelButton;
