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
    const { isPlaying, processTick, recoverPower, togglePlay } = useGameStore();

    // Auto-Save Effect (Handled inside useGameStore or manually? Plan said separate)
    // Actually, saveSystem imports are circular if used directly here vs store?
    // Let's rely on manual save or add auto-save back if essential.
    // For now, removing auto-save effect to simplify dev and avoid lag, verifying manual save works in SystemBar.

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
        let interval: ReturnType<typeof setInterval>;
        if (isPlaying && !currentEvent) {
            interval = setInterval(() => {
                processTick();
            }, 4000); // 4 seconds per week
        } else if (currentEvent && isPlaying) {
            togglePlay(); // Pause on Event
        }
        return () => clearInterval(interval);
    }, [isPlaying, currentEvent, processTick, togglePlay]);

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
                    {['normal', 'choice', 'quest'].includes(currentEvent.type) && (
                        <EventPopup
                            isOpen={true}
                            onClose={dismissEvent}
                            title={currentEvent.title}
                            description={currentEvent.description || ''}
                            choices={currentEvent.choices?.map(c => ({
                                label: c.label,
                                action: () => {
                                    const store = useGameStore.getState();
                                    const updates = c.action(store);
                                    useGameStore.setState(updates);
                                }
                            }))}
                        />
                    )}
                    {currentEvent.type === 'stock' && (
                        <StockMarketPopup isOpen={true} onClose={dismissEvent} />
                    )}
                    {currentEvent.type === 'career' && (
                        <CareerPathPopup isOpen={true} onSelect={() => dismissEvent()} />
                    )}
                    {currentEvent.type === 'notification' && (
                        <EventPopup
                            isOpen={true}
                            onClose={dismissEvent}
                            title={currentEvent.title}
                            description={currentEvent.description || ''}
                            choices={currentEvent.choices ? currentEvent.choices.map(c => ({
                                label: c.label,
                                action: () => {
                                    if (c.action) {
                                        const store = useGameStore.getState();
                                        const updates = c.action(store);
                                        useGameStore.setState(updates);
                                    }
                                    dismissEvent();
                                }
                            })) : [{ label: 'OK', action: dismissEvent }]}
                        />
                    )}
                    {currentEvent.type === 'ending' && (
                        <EndingPopup
                            isOpen={true}
                            type={currentEvent.data?.type || 'retirement'}
                            totalAssets={currentEvent.data?.assets || 0}
                            age={currentEvent.data?.age || 60}
                            jobTitle={currentEvent.data?.jobTitle || 'Unknown'}
                            onRestart={() => window.location.reload()}
                        />
                    )}

                    {/* Fallback for Broken/Unknown Events */}
                    {!['normal', 'choice', 'quest', 'stock', 'career', 'ending', 'notification'].includes(currentEvent.type as string) && (
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

            <DevControls />
        </div>
    );
};

export default MainGameScreen;
