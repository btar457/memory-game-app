import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ReactConfetti from "react-confetti";
import { useMemoryGame } from "@/lib/stores/useMemoryGame";
import { useAudio } from "@/lib/stores/useAudio";
import AdInterstitial from "./AdInterstitial";

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function getStars(moves: number, pairs: number): number {
  const ratio = moves / pairs;
  if (ratio <= 1.5) return 3;
  if (ratio <= 2.5) return 2;
  return 1;
}

export default function WinScreen() {
  const { moves, timer, currentLevel, totalPairs, startLevel, setScreen, getThemeConfig } = useMemoryGame();
  const { playSuccess } = useAudio();
  const [showInterstitial, setShowInterstitial] = useState(true);
  const [windowSize, setWindowSize] = useState({ w: 0, h: 0 });
  const theme = getThemeConfig();
  const nextLevel = Math.min(currentLevel + 1, 10);

  useEffect(() => {
    setWindowSize({ w: window.innerWidth, h: window.innerHeight });
    playSuccess();
    const handleResize = () => setWindowSize({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [playSuccess]);

  const stars = getStars(moves, totalPairs);

  if (showInterstitial) {
    return <AdInterstitial onClose={() => setShowInterstitial(false)} />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <ReactConfetti
        width={windowSize.w}
        height={windowSize.h}
        recycle={false}
        numberOfPieces={300}
        gravity={0.1}
        colors={["#FFD700", "#FF6B6B", "#4ECDC4", "#45B7D1", "#F7DC6F", "#BB8FCE"]}
      />

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 12 }}
        className="bg-white/10 backdrop-blur-md rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl border border-white/20"
      >
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-6xl mb-2"
        >
          🎉
        </motion.div>

        <motion.h2
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-extrabold text-white mb-1"
        >
          Level {currentLevel} Complete!
        </motion.h2>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex justify-center gap-1 mb-4"
        >
          {[1, 2, 3].map((star) => (
            <motion.span
              key={star}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.5 + star * 0.15, type: "spring" }}
              className={`text-4xl ${star <= stars ? "" : "opacity-30"}`}
            >
              ⭐
            </motion.span>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="space-y-2 mb-6"
        >
          <div className="flex justify-between text-white/80">
            <span>Moves:</span>
            <span className="font-bold text-white">{moves}</span>
          </div>
          <div className="flex justify-between text-white/80">
            <span>Time:</span>
            <span className="font-bold text-white">{formatTime(timer)}</span>
          </div>
          <div className="flex justify-between text-white/80">
            <span>Pairs:</span>
            <span className="font-bold text-white">{totalPairs}</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="flex flex-col gap-3"
        >
          {currentLevel < 10 && (
            <button
              onClick={() => startLevel(nextLevel)}
              className={`bg-gradient-to-r ${theme.color} text-white font-bold py-3 px-6 rounded-2xl hover:shadow-lg hover:scale-105 active:scale-95 transition-all`}
            >
              Next Level →
            </button>
          )}
          <button
            onClick={() => startLevel(currentLevel)}
            className="bg-gradient-to-r from-green-400 to-emerald-500 text-white font-bold py-3 px-6 rounded-2xl hover:shadow-lg hover:scale-105 active:scale-95 transition-all"
          >
            Play Again
          </button>
          <button
            onClick={() => setScreen("level_select")}
            className="bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-6 rounded-2xl transition-all"
          >
            Level Select
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
