import { motion } from "framer-motion";
import { useMemoryGame } from "@/lib/stores/useMemoryGame";

export default function ThemeSelect() {
  const { getThemes, selectTheme, showRewardedAdForTheme, resetToHome } = useMemoryGame();
  const themes = getThemes();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8">
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={resetToHome}
        className="self-start mb-4 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-full text-sm font-bold transition-all backdrop-blur-sm"
      >
        ← Back
      </motion.button>

      <motion.h2
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-3xl md:text-4xl font-extrabold text-white mb-2 text-center"
      >
        Choose a Theme
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-white/60 mb-8 text-center"
      >
        Pick your favorite card set!
      </motion.p>

      <div className="grid grid-cols-2 gap-4 w-full max-w-md">
        {themes.map((theme, i) => (
          <motion.div
            key={theme.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.1 }}
          >
            {theme.locked ? (
              <div className="relative">
                <div className="bg-gray-700/50 backdrop-blur-sm rounded-2xl p-6 text-center border-2 border-dashed border-gray-500 opacity-70">
                  <div className="text-4xl mb-2">{theme.emoji}</div>
                  <div className="text-white font-bold text-lg mb-1">{theme.name}</div>
                  <div className="text-gray-400 text-xs mb-3">Locked</div>
                  <button
                    onClick={() => showRewardedAdForTheme(theme.id)}
                    className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold py-2 px-4 rounded-xl hover:scale-105 active:scale-95 transition-all w-full"
                  >
                    🎬 Watch Ad to Unlock
                  </button>
                </div>
                <div className="absolute top-2 right-2 text-2xl">🔒</div>
              </div>
            ) : (
              <button
                onClick={() => selectTheme(theme.id)}
                className={`bg-gradient-to-br ${theme.color} rounded-2xl p-6 text-center shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 w-full border-2 border-white/20`}
              >
                <div className="text-4xl mb-2">{theme.emoji}</div>
                <div className="text-white font-bold text-lg">{theme.name}</div>
                <div className="text-white/70 text-xs mt-1">{theme.images.length} cards</div>
              </button>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
