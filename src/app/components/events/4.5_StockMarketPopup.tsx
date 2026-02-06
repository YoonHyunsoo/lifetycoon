import React from 'react';
import Modal from '../ui/4.1_Modal';
import StockCard from './4.6_StockCard';
import PixelButton from '../ui/8.2_PixelButton';
import { useGameStore } from '../../../store/gameStore';
import { AdManager } from '../../../lib/adSystem';

interface StockMarketPopupProps {
    isOpen: boolean;
    onClose: () => void;
}

const StockMarketPopup: React.FC<StockMarketPopupProps> = ({ isOpen, onClose }) => {
    const { stocks, player, buyStock, sellStock, getInsiderHint, insiderHint } = useGameStore();

    const handleBuy = (id: number) => {
        const amountStr = prompt("How many to BUY?");
        if (!amountStr) return;
        const amount = parseInt(amountStr);
        if (isNaN(amount) || amount <= 0) return;
        buyStock(id, amount);
    };

    const handleSell = (id: number) => {
        const amountStr = prompt("How many to SELL?");
        if (!amountStr) return;
        const amount = parseInt(amountStr);
        if (isNaN(amount) || amount <= 0) return;
        sellStock(id, amount);
    };

    const handleInsider = () => {
        AdManager.showRewardedAd({ rewardType: 'STOCK_HINT' }, () => {
            getInsiderHint();
        });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="STOCK MARKET">
            <div className="flex flex-col gap-2 max-h-[60vh] overflow-y-auto pr-1">
                <div className="flex justify-between items-center text-xs text-gray-400 mb-2">
                    <span>Capital: <span className="text-green-400">{player.cash.toLocaleString()} ₩</span></span>
                    {/* [MONETIZATION] Insider Button */}
                    {!insiderHint ? (
                        <button onClick={handleInsider} className="text-[10px] bg-purple-900 text-purple-200 px-2 py-1 rounded border border-purple-500 animate-pulse hover:bg-purple-800">
                            🕵️ Secret Info (Ad)
                        </button>
                    ) : (
                        <span className="text-[10px] text-purple-400">
                            Tip: Stock #{insiderHint.stockId} {insiderHint.trend === 'bull' ? '🚀' : '📉'}
                        </span>
                    )}
                </div>

                {stocks.map(stock => (
                    <StockCard
                        key={stock.id}
                        {...stock}
                        onBuy={() => handleBuy(stock.id)}
                        onSell={() => handleSell(stock.id)}
                    />
                ))}

                <div className="mt-4 flex justify-center">
                    <PixelButton onClick={onClose} size="sm">CLOSE MARKET</PixelButton>
                </div>
            </div>
        </Modal>
    );
};

export default StockMarketPopup;
