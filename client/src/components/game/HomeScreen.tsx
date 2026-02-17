import { motion } from "framer-motion";
import { useAudio } from "@/lib/stores/useAudio";
import { useMemoryGame } from "@/lib/stores/useMemoryGame";

export default function HomeScreen() {
  const { setScreen } = useMemoryGame();
  const { isMuted, toggleMute } = useAudio();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8">
      <motion.div
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="mb-2"
      >
        <h1 className="text-5xl md:text-7xl font-extrabold text-center leading-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-500">
            Memory
          </span>
          <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-green-400">
            Match!
          </span>
        </h1>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-white/80 text-lg mb-8 text-center"
      >
        Find all the matching pairs!
      </motion.p>

      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, type: "spring" }}
        onClick={() => setScreen("theme_select")}
        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-2xl py-5 px-12 rounded-3xl shadow-lg hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 mb-6"
      >
        Play Now!
      </motion.button>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        onClick={toggleMute}
        className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-full text-sm font-medium transition-all backdrop-blur-sm"
      >
        {isMuted ? "🔇 Sound Off" : "🔊 Sound On"}
      </motion.button>
    </div>
  );
}
