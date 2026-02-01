import React from 'react';

interface PixelGaugeProps {
    value: number;
    max: number;
    color?: 'red' | 'blue' | 'green' | 'yellow';
    label?: string;
}

const PixelGauge: React.FC<PixelGaugeProps> = ({ value, max, color = 'green', label }) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));

    const colors = {
        red: 'bg-red-500',
        blue: 'bg-blue-500',
        green: 'bg-green-500',
        yellow: 'bg-yellow-500',
    };

    return (
        <div className="w-full">
            {label && <div className="text-xxs text-gray-400 mb-1">{label}</div>}
            <div className="w-full h-3 bg-gray-900 border border-gray-600 p-[1px]">
                <div
                    className={`h-full ${colors[color]} transition-all duration-300`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
};

export default PixelGauge;
