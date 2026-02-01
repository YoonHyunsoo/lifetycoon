import React, { useEffect } from 'react';
import GameHUD from '../game/3.2_GameHUD';
import RoomView from '../game/3.4_RoomView';
import ActionBar from '../game/3.6_ActionBar';
// import AllocationControl from '../game/3.6_1_AllocationControl'; // Removed
import SystemBar from '../game/3.6_2_SystemBar'; // New System/Time Control
// import TimeControls from '../game/3.6_2_TimeControls';
import { useEventStore } from '../../../store/eventStore';
import { useGameStore } from '../../../store/gameStore';
import EventPopup from '../events/4.2_EventPopup';
import StockMarketPopup from '../events/4.5_StockMarketPopup';
import CareerPathPopup from '../events/4.3_CareerPathPopup';
import EndingPopup from '../events/4.8_EndingPopup';
import FX_FloatingText from '../ui/FX_FloatingText';
import DevControls from '../dev/DevControls';

// import { saveGame } from '../../../lib/saveSystem';

const MainGameScreen: React.FC = () => {
    const { currentEvent, dismissEvent } = useEventStore();

    // DEBUG: Check store initialization
    const gameState = useGameStore();

    // Use default values if gameState is undefined to prevent crash, but log error
    const { isPlaying, processTick, recoverPower, togglePlay } = gameState || {
        isPlaying: false,
        processTick: () => console.error("Store not loaded"),
        recoverPower: () => { },
        togglePlay: () => { }
    };

    if (!gameState) {
        console.error('[Main] Critical: Game State Load Failed', useGameStore);
    }

    // Game Loop 1: Power Recovery (Fast Tick: 100ms)
    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (isPlaying && !currentEvent) {
            interval = setInterval(() => {
                recoverPower();
            }, 100);
        }
        return () => clearInterval(interval);
    }, [isPlaying, currentEvent, recoverPower]);

    // Game Loop 2: Time Progression (Slow Tick: 4000ms = 1 Week)
    useEffect(() => {
        if (!gameState || !gameState.isPlaying || currentEvent) return; // Guard

        const timer = setInterval(() => {
            if (processTick) processTick();
        }, 4000); // User requested 4s per week
        return () => clearInterval(timer);
    }, [gameState?.isPlaying, currentEvent, processTick]); // Use optional chaining for dep

    if (!gameState) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white flex-col gap-4">
                <div className="text-red-500 font-bold text-xl">CRITICAL ERROR: Game State Failed to Load</div>
                <div className="text-gray-400">Please check console for details.</div>
                <button className="px-4 py-2 bg-blue-600 rounded" onClick={() => window.location.reload()}>Reload</button>
            </div>
        );
    }

    // Main Render
    return (
        <div className="flex flex-col h-screen w-full max-w-md mx-auto bg-gray-900 shadow-2xl overflow-hidden relative border-x border-gray-700">
            {/* Top HUD */}
            <div className="h-20 shrink-0 z-20">
                <GameHUD />
            </div>

            {/* Main Room View */}
            <div className="flex-1 relative z-10">
                <RoomView />
                <FX_FloatingText />
            </div>

            {/* Bottom Section: System Bar + Action Bar */}
            <div className="shrink-0 z-20 flex flex-col bg-gray-900 border-t-4 border-gray-700">
                {/* System Controls (Date, Menu, Play) */}
                <SystemBar />

                {/* Action Grid */}
                <div className="h-24">
                    <ActionBar />
                </div>
            </div>

            {/* Global Overlay: Event System */}
            {currentEvent && (
                <>
                    {/* Handle Normal, Choice, and Quest types with generic EventPopup */}
                    {['notification', 'choice', 'quest', 'normal', 'tutorial'].includes(currentEvent.type) && (
                        <EventPopup
                            isOpen={true}
                            onClose={dismissEvent}
                            title={currentEvent.title}
                            description={currentEvent.description || ''}
                            choices={currentEvent.choices ? currentEvent.choices.map(c => ({
                                label: c.label,
                                action: () => {
                                    // wrapper to handle state updates if action returns object
                                    const result = c.action(useGameStore.getState());
                                    if (result) useGameStore.setState(result);
                                }
                            })) : undefined}
                        />
                    )}

                    {/* Fallback for Broken/Unknown Events */}
                    {!['normal', 'choice', 'quest', 'stock', 'career', 'ending', 'notification'].includes(currentEvent.type) && (
                        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80">
                            <div className="bg-white p-4 rounded text-black text-center">
                                <h3 className="font-bold text-red-500">ERROR: Unknown Event</h3>
                                <p className="text-xs text-red-400 font-mono">Type: '{currentEvent.type}'</p>
                                <p className="text-xs text-gray-500 my-2">{JSON.stringify(currentEvent)}</p>
                                <button onClick={dismissEvent} className="bg-red-500 text-white px-4 py-2 rounded">
                                    FORCE DISMISS
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Other Fullscreen Popups */}
            <StockMarketPopup />
            <CareerPathPopup />
            {/* Ending Popup - Rendered via currentEvent data */}
            {currentEvent && currentEvent.type === 'ending' && (
                <EndingPopup
                    isOpen={true}
                    type={currentEvent.data?.type || 'retirement'}
                    totalAssets={currentEvent.data?.assets || 0}
                    age={currentEvent.data?.age || 60}
                    jobTitle={currentEvent.data?.jobTitle || 'Unknown'}
                    onRestart={() => window.location.reload()}
                />
            )}

            {/* Dev Controls (Overlay) */}
            <div className="absolute bottom-2 right-2 z-50 opacity-50 hover:opacity-100">
                <DevControls />
            </div>
        </div>
    );
};

export default MainGameScreen;
