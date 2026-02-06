import React from 'react';
import Modal from '../ui/4.1_Modal';
import PixelButton from '../ui/8.2_PixelButton';
import PixelCard from '../ui/8.1_PixelCard';
import { saveScore } from '../../../lib/saveSystem';
import { useAuthStore } from '../../../store/authStore';
import { submitGlobalScore } from '../../../lib/leaderboard';
import { AdManager } from '../../../lib/adSystem';
import { useGameStore } from '../../../store/gameStore';
import { useEventStore } from '../../../store/eventStore';

interface EndingPopupProps {
    isOpen: boolean;
    type: 'retirement' | 'bankruptcy' | 'overwork';
    totalAssets: number;
    age: number;
    jobTitle: string;
    onRestart: () => void;
}

const EndingPopup: React.FC<EndingPopupProps> = ({ isOpen, type, totalAssets, age, jobTitle, onRestart }) => {
    const { user, profile } = useAuthStore();
    const [submitted, setSubmitted] = React.useState(false);
    const { player, revivePlayer } = useGameStore();
    const { dismissEvent } = useEventStore.getState();

    // Save Score (Local) on Open
    React.useEffect(() => {
        if (isOpen) {
            saveScore(`You (Age ${age})`, totalAssets);
        }
    }, [isOpen, totalAssets, age]);

    // Submit Global Score
    const handleSubmitGlobal = async () => {
        if (!user || !profile) return;
        const success = await submitGlobalScore(profile.username || 'Tycoon', totalAssets);
        if (success) setSubmitted(true);
    };

    const handleRevive = () => {
        AdManager.showRewardedAd({ rewardType: 'REVIVE' }, () => {
            revivePlayer();
            dismissEvent();
        });
    };

    let title = "";
    let message = "";
    let colorClass = "";

    switch (type) {
        case 'retirement':
            title = "HAPPY RETIREMENT";
            message = "Congratulations! You have reached the retirement age.";
            colorClass = "text-yellow-400";
            break;
        case 'bankruptcy':
            title = "BANKRUPTCY";
            message = "You have lost all your assets. Game Over.";
            colorClass = "text-red-500";
            break;
        case 'overwork':
            title = "HEALTH COLLAPSE";
            message = "You pushed yourself too hard. Game Over.";
            colorClass = "text-red-500";
            break;
    }

    const rank = totalAssets > 10000000000 ? "CHAEBOL"
        : totalAssets > 1000000000 ? "WEALTHY"
            : totalAssets > 100000000 ? "MIDDLE CLASS"
                : "COMMONER";

    return (
        <Modal isOpen={isOpen} title={title}>
            <div className="flex flex-col gap-6 text-center">
                <div className={`text-xl font-bold ${colorClass} animate-pulse`}>
                    {title}
                </div>

                <p className="text-sm text-gray-300 whitespace-pre-line">
                    {message}
                </p>

                <PixelCard className="bg-gray-900 border-gray-700">
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between text-xs text-gray-400">
                            <span>Final Age</span>
                            <span className="text-white">{age}</span>
                        </div>
                        <div className="flex justify-between text-xs text-gray-400">
                            <span>Last Job</span>
                            <span className="text-white">{jobTitle}</span>
                        </div>
                        <div className="border-t border-gray-700 my-1"></div>
                        <div className="flex justify-between text-sm font-bold">
                            <span className="text-blue-400">Total Assets</span>
                            <span className="text-green-400">{totalAssets.toLocaleString()} ₩</span>
                        </div>
                        <div className="mt-2 text-center">
                            <span className="text-xs text-yellow-600">RANK: </span>
                            <span className="text-lg text-yellow-400 font-pixel uppercase">{rank}</span>
                        </div>
                    </div>
                </PixelCard>

                {/* Submitting Score */}
                {user ? (
                    !submitted ? (
                        <PixelButton onClick={handleSubmitGlobal} variant="secondary">
                            🏆 SUBMIT TO GLOBAL RANK
                        </PixelButton>
                    ) : (
                        <div className="text-green-400 text-xs font-bold">✓ SCORE SUBMITTED!</div>
                    )
                ) : (
                    <div className="text-[10px] text-gray-500">
                        * Login to submit score to Global Leaderboard
                    </div>
                )}

                <div className="flex flex-col gap-3 mt-2">
                    {/* [MONETIZATION] Revive Button */}
                    {!player.hasRevived && (type === 'bankruptcy' || type === 'overwork') && (
                        <PixelButton onClick={handleRevive} className="bg-purple-600 hover:bg-purple-500 border-purple-400 text-white animate-pulse">
                            📺 REVIVE (Second Chance)
                        </PixelButton>
                    )}

                    <PixelButton onClick={onRestart} variant="primary">
                        RETURN TO TITLE
                    </PixelButton>
                </div>
            </div>
        </Modal>
    );
};

export default EndingPopup;
