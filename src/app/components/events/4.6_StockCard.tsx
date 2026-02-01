import React from 'react';
import PixelCard from '../ui/8.1_PixelCard';

interface StockCardProps {
    name: string;
    price: number;
    rate: number; // 변동률
    type: string; // 안정형, 로또형 등
    owned: number;
    onBuy: () => void;
    onSell: () => void;
}

const StockCard: React.FC<StockCardProps> = ({
    name, price, rate, type, owned, onBuy, onSell
}) => {
    const isPlus = rate > 0;
    const isZero = rate === 0;
    const rateColor = isPlus ? 'text-red-500' : isZero ? 'text-gray-400' : 'text-blue-500'; // 한국장은 빨강이 상승

    return (
        <PixelCard className="p-2 bg-gray-900 border-gray-600 flex justify-between items-center group hover:bg-gray-800 transition-colors">
            <div className="flex flex-col">
                <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{name}</span>
                    <span className="text-[10px] bg-gray-700 px-1 rounded text-gray-300">{type}</span>
                </div>
                <div className="flex items-end gap-2 mt-1">
                    <span className="text-white font-mono">{price.toLocaleString()}</span>
                    <span className={`text-xs ${rateColor}`}>
                        {isPlus ? '▲' : isZero ? '-' : '▼'} {Math.abs(rate)}%
                    </span>
                </div>
                <div className="text-xxs text-gray-500 mt-1">Owned: {owned}</div>
            </div>

            <div className="flex flex-col gap-1">
                <button onClick={onBuy} className="bg-red-900/50 hover:bg-red-600 border border-red-700 text-red-200 text-xs px-2 py-1">
                    BUY
                </button>
                <button onClick={onSell} className="bg-blue-900/50 hover:bg-blue-600 border border-blue-700 text-blue-200 text-xs px-2 py-1">
                    SELL
                </button>
            </div>
        </PixelCard>
    );
};

export default StockCard;
