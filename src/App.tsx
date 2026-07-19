

import { GameProvider, useGame } from './game/GameContext';
import { HomeScreen } from './screens/HomeScreen';
import { CharacterScreen } from './screens/CharacterScreen';
import { GuideScreen } from './screens/GuideScreen';
import { PlayScreen } from './screens/PlayScreen';
import { RoundSummaryScreen } from './screens/RoundSummaryScreen';
import { FinalSummaryScreen } from './screens/FinalSummaryScreen';

import { ModeSelectScreen } from './screens/ModeSelectScreen';

function Router() {
  const { state } = useGame();
  switch (state.screen) {
    case 'home':
      return <HomeScreen />;
    case 'modeSelect':
      return <ModeSelectScreen />;
    case 'characters':
      return <CharacterScreen />;
    case 'guide':
      return <GuideScreen />;
    case 'playing':
      return <PlayScreen />;
    case 'roundSummary':
      return <RoundSummaryScreen />;
    case 'finalSummary':
      return <FinalSummaryScreen />;
    default:
      return <HomeScreen />;
  }
}

export function App() {
  return (
    <div className="dark min-h-full w-full bg-ink-950 text-white">
      <GameProvider>
        <Router />
      </GameProvider>
    </div>);

}