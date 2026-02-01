import React, { useState } from 'react';
import PixelButton from '../ui/8.2_PixelButton';
import GameHUD from '../game/3.2_GameHUD';
import RoomView from '../game/3.4_RoomView';
import ActionBar from '../game/3.6_ActionBar';
import EventPopup from '../events/4.2_EventPopup';
import CareerPathPopup from '../events/4.3_CareerPathPopup';
import StockMarketPopup from '../events/4.5_StockMarketPopup';
import QuestPopup from '../events/4.7_QuestPopup';
import ResultPopup from '../events/4.4_ResultPopup';
// import AuthModal from '../auth/AuthModal'; // Import Auth
import CharacterCreationScreen from '../screens/2.1_CharacterCreationScreen';
import MainGameScreen from '../screens/3.1_MainGameScreen';
import SettingsPanel from '../ui/7.1_SettingsPanel';
import PixelTable from '../ui/5.2_PixelTable';
import Toast from '../ui/7.2_Toast';
import LoadingSpinner from '../ui/7.3_LoadingSpinner';

interface DevPreviewScreenProps {
    onBack: () => void;
}

const DevPreviewScreen: React.FC<DevPreviewScreenProps> = ({ onBack }) => {
    const [activeComponent, setActiveComponent] = useState<string | null>(null);
    const [showToast, setShowToast] = useState(false);

    // Mock Data for Table
    const mockTableData = [
        { id: 1, rank: '#1', name: 'RichGuy', assets: '100억' },
        { id: 2, rank: '#2', name: 'LifeMaster', assets: '50억' },
        { id: 3, rank: '#3', name: 'Newbie', assets: '1억' },
    ];
    const mockTableColumns = [
        { header: 'Rank', key: 'rank' as const, width: 'w-12' },
        { header: 'Name', key: 'name' as const },
        { header: 'Assets', key: 'assets' as const, width: 'w-24' },
    ];

    const renderComponent = () => {
        switch (activeComponent) {
            // Screens
            case 'CharCreate':
                return <CharacterCreationScreen onComplete={() => alert('Creation Complete!')} />;
            case 'MainGame':
                return <MainGameScreen />;

            // HUD & Views
            case 'HUD':
                return (
                    <div className="w-full max-w-md bg-gray-900 h-20">
                        <GameHUD />
                    </div>
                );
            case 'Room':
                return (
                    <div className="w-full max-w-md h-full relative">
                        <RoomView />
                    </div>
                );
            case 'ActionBar':
                return (
                    <div className="w-full max-w-md bg-gray-900 h-24">
                        <ActionBar />
                    </div>
                );

            // Popups
            case 'EventPopup':
                return (
                    <EventPopup
                        isOpen={true}
                        onClose={() => setActiveComponent(null)}
                        title="TEST EVENT"
                        description="This is a test event description.\nIt can have multiple lines."
                        confirmText="GOT IT"
                    />
                );
            case 'CareerPopup':
                return (
                    <CareerPathPopup
                        isOpen={true}
                        onSelect={(path) => alert(`Selected: ${path}`)}
                        onClose={() => setActiveComponent(null)}
                    />
                );
            case 'StockMarket':
                return (
                    <StockMarketPopup
                        isOpen={true}
                        onClose={() => setActiveComponent(null)}
                    />
                );
            case 'Quest':
                return (
                    <QuestPopup
                        isOpen={true}
                        onClose={() => setActiveComponent(null)}
                        type="parent"
                        title="Mom's Visit"
                        description="Your mom wants to visit you."
                        successChance={50}
                        cost={100000}
                        reward="Stress -10"
                        onAttempt={() => alert('Attempted!')}
                    />
                );
            case 'ResultSuccess':
                return (
                    <ResultPopup
                        isOpen={true}
                        onClose={() => setActiveComponent(null)}
                        success={true}
                        title="GREAT SUCCESS"
                        message="You did it!"
                        rewards={['Intelligence +3', 'Cash +1,000,000']}
                    />
                );

            // UI Elements
            case 'Settings':
                return <SettingsPanel onClose={() => setActiveComponent(null)} />;
            case 'Table':
                return (
                    <div className="w-full max-w-md p-4">
                        <PixelTable data={mockTableData} columns={mockTableColumns} />
                    </div>
                );
            case 'Spinner':
                return <LoadingSpinner />;
            case 'Toast':
                return (
                    <div className="flex flex-col items-center gap-4">
                        <PixelButton onClick={() => setShowToast(true)}>Show Toast</PixelButton>
                        {showToast && (
                            <Toast
                                message="This is a toast message!"
                                onClose={() => setShowToast(false)}
                            />
                        )}
                    </div>
                );

            default:
                return (
                    <div className="text-gray-500 text-center mt-20">
                        Select a component to preview
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 p-4 font-pixel relative">
            <div className="mb-4 flex justify-between items-center bg-gray-800 p-2 rounded border border-gray-700">
                <h1 className="text-xl text-yellow-400">🛠️ DEV MODE</h1>
                <PixelButton onClick={onBack} size="sm" variant="secondary">EXIT</PixelButton>
            </div>

            <div className="flex gap-4 h-[calc(100vh-100px)]">
                {/* Sidebar */}
                <div className="w-64 flex flex-col gap-2 overflow-y-auto pr-2 border-r border-gray-700 pb-10">
                    <div className="text-xs text-yellow-500 font-bold mb-1 border-b border-gray-700 pb-1">FULL SCREENS</div>
                    <button onClick={() => setActiveComponent('CharCreate')} className="text-left bg-gray-800 p-2 hover:bg-gray-700 rounded text-xs mb-1">Character Creation</button>
                    <button onClick={() => setActiveComponent('MainGame')} className="text-left bg-gray-800 p-2 hover:bg-gray-700 rounded text-xs mb-1">Main Game (Playable)</button>

                    <div className="text-xs text-yellow-500 font-bold mb-1 mt-4 border-b border-gray-700 pb-1">GAME UI</div>
                    <button onClick={() => setActiveComponent('HUD')} className="text-left bg-gray-800 p-2 hover:bg-gray-700 rounded text-xs mb-1">Game HUD</button>
                    <button onClick={() => setActiveComponent('Room')} className="text-left bg-gray-800 p-2 hover:bg-gray-700 rounded text-xs mb-1">Room View</button>
                    <button onClick={() => setActiveComponent('ActionBar')} className="text-left bg-gray-800 p-2 hover:bg-gray-700 rounded text-xs mb-1">Action Bar</button>

                    <div className="text-xs text-yellow-500 font-bold mb-1 mt-4 border-b border-gray-700 pb-1">POPUPS & EVENTS</div>
                    <button onClick={() => setActiveComponent('EventPopup')} className="text-left bg-gray-800 p-2 hover:bg-gray-700 rounded text-xs mb-1">Event Modal</button>
                    <button onClick={() => setActiveComponent('CareerPopup')} className="text-left bg-gray-800 p-2 hover:bg-gray-700 rounded text-xs mb-1">Career Path</button>
                    <button onClick={() => setActiveComponent('StockMarket')} className="text-left bg-gray-800 p-2 hover:bg-gray-700 rounded text-xs mb-1">Stock Market</button>
                    <button onClick={() => setActiveComponent('Quest')} className="text-left bg-gray-800 p-2 hover:bg-gray-700 rounded text-xs mb-1">Quest Modal</button>
                    <button onClick={() => setActiveComponent('ResultSuccess')} className="text-left bg-gray-800 p-2 hover:bg-gray-700 rounded text-xs mb-1">Result (Success)</button>

                    <div className="text-xs text-yellow-500 font-bold mb-1 mt-4 border-b border-gray-700 pb-1">COMMON UI</div>
                    <button onClick={() => setActiveComponent('Settings')} className="text-left bg-gray-800 p-2 hover:bg-gray-700 rounded text-xs mb-1">Settings Panel</button>
                    <button onClick={() => setActiveComponent('Table')} className="text-left bg-gray-800 p-2 hover:bg-gray-700 rounded text-xs mb-1">Pixel Table (Ranking)</button>
                    <button onClick={() => setActiveComponent('Spinner')} className="text-left bg-gray-800 p-2 hover:bg-gray-700 rounded text-xs mb-1">Loading Spinner</button>
                    <button onClick={() => setActiveComponent('Toast')} className="text-left bg-gray-800 p-2 hover:bg-gray-700 rounded text-xs mb-1">Toast Message</button>
                </div>

                {/* Preview Area */}
                <div className="flex-1 bg-black/50 border border-dashed border-gray-600 rounded flex items-center justify-center overflow-hidden p-4 relative">
                    {renderComponent()}
                </div>
            </div>
        </div>
    );
};

export default DevPreviewScreen;
