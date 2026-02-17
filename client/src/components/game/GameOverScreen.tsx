import { motion } from "framer-motion";
import { useMemoryGame } from "@/lib/stores/useMemoryGame";

export default function GameOverScreen() {
  const { currentLevel, moves, matches, totalPairs, startLevel, setScreen, resetToHome, showRewardedAdForContinue, getThemeConfig, lives } = useMemoryGame();
  const theme = getThemeConfig();

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen px-4"
      style={{ background: theme.frameBg }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 50%, rgba(244, 67, 54, 0.15) 0%, transparent 60%)`,
        }}
      />

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 12 }}
        className="bg-black/30 backdrop-blur-md rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl border border-red-500/30 relative z-10"
      >
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-6xl mb-3"
        >
          💔
        </motion.div>

        <motion.h2
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-extrabold text-white mb-2"
        >
          Game Over!
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-white/60 text-sm mb-4"
        >
          {lives <= 0 ? "You ran out of lives" : "Time's up!"} on Level {currentLevel}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="space-y-2 mb-6"
        >
          <div className="flex justify-between text-white/70">
            <span>Moves Made:</span>
            <span className="font-bold text-white">{moves}</span>
          </div>
          <div className="flex justify-between text-white/70">
            <span>Pairs Found:</span>
            <span className="font-bold text-white">{matches}/{totalPairs}</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col gap-3"
        >
          <button
            onClick={showRewardedAdForContinue}
            className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold py-3 px-6 rounded-2xl hover:shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-500/30"
          >
            <span>🎬</span> Watch Ad to Continue
          </button>

          <button
            onClick={() => startLevel(currentLevel)}
            className={`bg-gradient-to-r ${theme.color} text-white font-bold py-3 px-6 rounded-2xl hover:shadow-lg hover:scale-105 active:scale-95 transition-all`}
          >
            Try Again
          </button>

          <button
            onClick={() => setScreen("level_select")}
            className="bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-6 rounded-2xl transition-all border border-white/10"
          >
            Level Select
          </button>

          <button
            onClick={resetToHome}
            className="text-white/50 hover:text-white/80 text-sm font-medium py-2 transition-all"
          >
            Main Menu
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
