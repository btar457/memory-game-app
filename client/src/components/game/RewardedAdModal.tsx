import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useMemoryGame } from "@/lib/stores/useMemoryGame";

export default function RewardedAdModal() {
  const { showRewardedAd, rewardedAdCallback, closeRewardedAd } = useMemoryGame();
  const [watching, setWatching] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const REWARDED_ID = "ca-app-pub-2793977718393893/5647382910"; // Placeholder format

  useEffect(() => {
    if (!showRewardedAd) {
      setWatching(false);
      setCountdown(5);
    }
  }, [showRewardedAd]);

  useEffect(() => {
    if (!watching) return;
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [watching, countdown]);

  if (!showRewardedAd) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gray-800 rounded-3xl p-6 max-w-sm w-full mx-4 text-center shadow-2xl border border-gray-600"
      >
        {!watching ? (
          <>
            <div className="text-5xl mb-4">🎬</div>
            <h3 className="text-white text-xl font-bold mb-2">Watch a Short Ad</h3>
            <p className="text-gray-400 text-sm mb-6">
              Watch a short video to earn your reward!
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => setWatching(true)}
                className="bg-gradient-to-r from-green-400 to-emerald-500 text-white font-bold py-3 px-6 rounded-2xl hover:scale-105 active:scale-95 transition-all"
              >
                Watch Ad
              </button>
              <button
                onClick={closeRewardedAd}
                className="bg-white/10 hover:bg-white/20 text-white/70 font-medium py-2 px-6 rounded-2xl transition-all text-sm"
              >
                No Thanks
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="bg-gray-700/50 border-2 border-dashed border-gray-500 rounded-xl w-full h-48 flex flex-col items-center justify-center mb-4">
              <div className="text-gray-400 text-lg font-medium mb-1 uppercase tracking-widest">Rewarded Video</div>
              <div className="text-gray-600 text-[10px] font-mono mb-2">{REWARDED_ID}</div>
              <div className="mt-1 w-3/4 bg-gray-600 rounded-full h-2">
                <motion.div
                  className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 5, ease: "linear" }}
                />
              </div>
            </div>
            <button
              onClick={() => {
                if (rewardedAdCallback) rewardedAdCallback();
              }}
              disabled={countdown > 0}
              className={`w-full py-3 rounded-2xl font-bold text-lg transition-all ${
                countdown > 0
                  ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-green-400 to-emerald-500 text-white hover:scale-105 active:scale-95"
              }`}
            >
              {countdown > 0 ? `Claim Reward in ${countdown}s` : "Claim Reward!"}
            </button>
          </>
        )}
      </motion.div>
    </div>
  );
}
