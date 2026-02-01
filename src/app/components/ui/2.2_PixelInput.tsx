import React from 'react';

interface PixelInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

const PixelInput: React.FC<PixelInputProps> = ({ label, className, ...props }) => {
    return (
        <div className="flex flex-col gap-2">
            {label && <label className="text-xs text-gray-400">{label}</label>}
            <input
                className={`bg-gray-800 border-2 border-gray-600 text-white px-3 py-2 font-pixel focus:border-yellow-500 outline-none ${className}`}
                {...props}
            />
        </div>
    );
};

export default PixelInput;
