import React from 'react';
import PixelCard from './8.1_PixelCard';
import { useGameStore } from '../../../store/gameStore';
import { useEventStore } from '../../../store/eventStore';

interface SettingsPanelProps {
    onClose: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ onClose }) => {
    return (
        <PixelCard title="SETTINGS" className="w-64">
            <div className="flex flex-col gap-4">
                <label className="flex justify-between text-sm">
                    <span>BGM</span>
                    <input type="checkbox" defaultChecked />
                </label>
                <label className="flex justify-between text-sm">
                    <span>SFX</span>
                    <input type="checkbox" defaultChecked />
                </label>

                <div className="border-t border-gray-700 my-2"></div>

                <button
                    onClick={async () => {
                        const { saveGame } = await import('../../../lib/saveSystem');
                        await saveGame(useGameStore.getState(), useEventStore.getState(), 'manual');
                        alert('Game Saved!');
                    }}
                    className="w-full bg-blue-900/50 border border-blue-500 text-blue-200 py-1 text-xs hover:bg-blue-800 mb-2"
                >
                    SAVE GAME
                </button>

                <button onClick={onClose} className="mt-2 text-center text-yellow-500 text-xs hover:text-yellow-400">
                    CLOSE
                </button>
            </div>
        </PixelCard>
    );
};

export default SettingsPanel;
