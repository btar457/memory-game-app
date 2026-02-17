import { motion } from "framer-motion";
import { useMemoryGame } from "@/lib/stores/useMemoryGame";

export default function LevelSelect() {
  const { getLevels, startLevel, setScreen, selectedTheme, getThemeConfig, progress } = useMemoryGame();
  const levels = getLevels();
  const theme = getThemeConfig();

  function getMixBadge(mixMode: string) {
    if (mixMode === "all") return { text: "🌀", color: "bg-purple-500" };
    if (mixMode === "dual") return { text: "🔀", color: "bg-blue-500" };
    return null;
  }

  return (
    <div className="flex flex-col items-center min-h-screen px-4 py-8">
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={() => setScreen("theme_select")}
        className="self-start mb-4 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-full text-sm font-bold transition-all backdrop-blur-sm"
      >
        ← Themes
      </motion.button>

      <motion.h2
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-3xl font-extrabold text-white mb-1 text-center"
      >
        {theme.emoji} {theme.name}
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="text-white/60 mb-6 text-center"
      >
        Select a level to play
      </motion.p>

      <div className="grid grid-cols-5 gap-3 w-full max-w-md">
        {levels.map((lvl, i) => {
          const best = progress.bestScores[lvl.level];
          const badge = getMixBadge(lvl.mixMode);
          return (
            <motion.button
              key={lvl.level}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + i * 0.05, type: "spring" }}
              onClick={() => startLevel(lvl.level)}
              disabled={lvl.locked}
              className={`relative aspect-square rounded-2xl flex flex-col items-center justify-center font-bold text-lg transition-all duration-200 ${
                lvl.locked
                  ? "bg-gray-700/50 text-gray-500 cursor-not-allowed border-2 border-dashed border-gray-600"
                  : `bg-gradient-to-br ${theme.color} text-white shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 border-2 border-white/20`
              }`}
            >
              {lvl.locked ? (
                <span className="text-xl">🔒</span>
              ) : (
                <>
                  <span>{lvl.level}</span>
                  <span className="text-[10px] opacity-70">{lvl.pairs}p</span>
                  <span className="text-[8px] opacity-60">❤️×{lvl.lives}</span>
                  {badge && (
                    <span className="absolute -top-1 -right-1 text-[10px] rounded-full w-5 h-5 flex items-center justify-center">
                      {badge.text}
                    </span>
                  )}
                  {best && (
                    <span className="text-[7px] opacity-50 absolute bottom-0.5">⭐{best.moves}</span>
                  )}
                </>
              )}
            </motion.button>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="mt-5 flex flex-wrap justify-center gap-3 text-[11px] text-white/50"
      >
        <span>🔀 = 2 themes mixed</span>
        <span>🌀 = Crazy Mix (all themes)</span>
      </motion.div>

      {levels.some((l) => l.locked) && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-white/40 text-xs mt-3 text-center"
        >
          Complete levels to unlock the next ones!
        </motion.p>
      )}
    </div>
  );
}
