import { motion } from "framer-motion";
import { useMemoryGame } from "@/lib/stores/useMemoryGame";

export default function BuyFullVersionModal() {
  const { showBuyFullVersion, closeBuyFullVersion, showRewardedAdForLevel, unlockPremiumLevels } = useMemoryGame();

  if (!showBuyFullVersion) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gray-800 rounded-3xl p-6 max-w-sm w-full mx-4 text-center shadow-2xl border border-gray-600"
      >
        <div className="text-5xl mb-3">🔒</div>
        <h3 className="text-white text-xl font-bold mb-2">Premium Levels</h3>
        <p className="text-gray-400 text-sm mb-6">
          Levels 5-10 require unlocking. Choose how you'd like to proceed!
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => showRewardedAdForLevel()}
            className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold py-3 px-6 rounded-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <span>🎬</span> Watch Ad to Unlock
          </button>

          <button
            onClick={unlockPremiumLevels}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-6 rounded-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <span>💎</span> Buy Full Version
          </button>

          <button
            onClick={closeBuyFullVersion}
            className="bg-white/10 hover:bg-white/20 text-white/70 font-medium py-2 px-6 rounded-2xl transition-all text-sm"
          >
            Maybe Later
          </button>
        </div>
      </motion.div>
    </div>
  );
}
