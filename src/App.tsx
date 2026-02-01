import { useState } from 'react';
import TitleScreen from './app/components/screens/1.1_TitleScreen';
import CharacterCreationScreen from './app/components/screens/2.1_CharacterCreationScreen';
import MainGameScreen from './app/components/screens/3.1_MainGameScreen';
import DevPreviewScreen from './app/components/dev/DevPreviewScreen';

type ScreenState = 'title' | 'create' | 'game' | 'dev';

function App() {
  const [screen, setScreen] = useState<ScreenState>('title');

  return (
    <div className="min-h-screen bg-black font-pixel text-white">
      {screen === 'title' && (
        <TitleScreen
          onStart={() => setScreen('create')}
          onDevMode={() => setScreen('dev')}
        />
      )}

      {screen === 'create' && (
        <CharacterCreationScreen onComplete={() => setScreen('game')} />
      )}

      {screen === 'game' && (
        <MainGameScreen />
      )}

      {screen === 'dev' && (
        <DevPreviewScreen onBack={() => setScreen('title')} />
      )}
    </div>
  );
}

export default App
