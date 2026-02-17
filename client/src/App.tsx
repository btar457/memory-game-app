import { useEffect } from "react";
import { useMemoryGame } from "./lib/stores/useMemoryGame";
import { useAudio } from "./lib/stores/useAudio";
import HomeScreen from "./components/game/HomeScreen";
import ThemeSelect from "./components/game/ThemeSelect";
import LevelSelect from "./components/game/LevelSelect";
import GameBoard from "./components/game/GameBoard";
import WinScreen from "./components/game/WinScreen";
import GameOverScreen from "./components/game/GameOverScreen";
import RewardedAdModal from "./components/game/RewardedAdModal";
import BuyFullVersionModal from "./components/game/BuyFullVersionModal";
import "@fontsource/inter";

function App() {
  const screen = useMemoryGame((s) => s.screen);
  const { setHitSound, setSuccessSound, setBackgroundMusic, isMuted, backgroundMusic } = useAudio();

  useEffect(() => {
    const hit = new Audio("/sounds/hit.mp3");
    hit.volume = 0.4;
    setHitSound(hit);

    const success = new Audio("/sounds/success.mp3");
    success.volume = 0.6;
    setSuccessSound(success);

    const bg = new Audio("/sounds/background.mp3");
    bg.loop = true;
    bg.volume = 0.2;
    setBackgroundMusic(bg);
  }, [setHitSound, setSuccessSound, setBackgroundMusic]);

  useEffect(() => {
    if (backgroundMusic) {
      if (isMuted) {
        backgroundMusic.pause();
      } else {
        backgroundMusic.play().catch(() => {});
      }
    }
  }, [isMuted, backgroundMusic]);

  return (
    <div className="game-background min-h-screen w-full overflow-y-auto">
      {screen === "home" && <HomeScreen />}
      {screen === "theme_select" && <ThemeSelect />}
      {screen === "level_select" && <LevelSelect />}
      {screen === "playing" && <GameBoard />}
      {screen === "won" && <WinScreen />}
      {screen === "game_over" && <GameOverScreen />}
      <RewardedAdModal />
      <BuyFullVersionModal />
    </div>
  );
}

export default App;
