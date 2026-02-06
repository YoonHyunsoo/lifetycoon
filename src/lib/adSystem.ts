/**
 * Ad System Manager (Mock Implementation)
 * 
 * In a real implementation, this would wrap Google AdSense / AdMob SDKs.
 * Current Mock:
 * - Shows a "Simulated Ad" via window.confirm (or custom UI if needed later).
 * - Delays for 3 seconds to simulate watching.
 * - Triggers success callback.
 */

interface AdConfig {
    rewardType: 'REVIVE' | 'STOCK_HINT' | 'DOUBLE_REWARD';
}

export const AdManager = {
    /**
     * Shows a rewarded ad.
     * @param config Configuration for the ad (unused in mock but good for analytics)
     * @param onReward Callback function executed when user successfully watches ad
     * @param onCancel Callback function if user cancels or ad fails
     */
    showRewardedAd: (config: AdConfig, onReward: () => void, onCancel?: () => void) => {
        // 1. Initial Confirmation (User intent)
        const userWantsAd = window.confirm(`[MOCK AD]\nWatch a short video to get ${config.rewardType}?`);

        if (!userWantsAd) {
            if (onCancel) onCancel();
            return;
        }

        // 2. Simulate Ad Loading/Watching (Performance/Network delay)
        // In a real app, this is where the SDK takes over overlay.
        // We will use a simple alert sequence or console log for now to not block thread too annoyingly.

        console.log(`[AdManager] Showing Ad for ${config.rewardType}...`);

        // 3. Simulate "Watching" duration (e.g. 2 seconds)
        // We use a timeout to make it feel like "work"
        setTimeout(() => {
            console.log(`[AdManager] Ad Finished!`);
            alert(`[MOCK AD]\nAd Watched Successfully!\nReward: ${config.rewardType}`);
            onReward();
        }, 1500);
    }
};
