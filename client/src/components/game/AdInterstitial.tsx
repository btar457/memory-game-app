import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface AdInterstitialProps {
  onClose: () => void;
}

export default function AdInterstitial({ onClose }: AdInterstitialProps) {
  const [countdown, setCountdown] = useState(3);
  const INTERSTITIAL_ID = "ca-app-pub-2793977718393893/1029384756"; // Placeholder format

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gray-800 rounded-3xl p-8 max-w-md w-full mx-4 text-center shadow-2xl border border-gray-600"
      >
        <div className="bg-gray-700/50 border-2 border-dashed border-gray-500 rounded-xl w-full h-64 flex flex-col items-center justify-center mb-6">
          <div className="text-gray-400 text-lg font-medium mb-1 uppercase tracking-widest">AdMob Interstitial</div>
          <div className="text-gray-600 text-[10px] font-mono">{INTERSTITIAL_ID}</div>
        </div>

        <button
          onClick={onClose}
          disabled={countdown > 0}
          className={`px-8 py-3 rounded-2xl font-bold text-lg transition-all ${
            countdown > 0
              ? "bg-gray-600 text-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-400 to-purple-500 text-white hover:shadow-lg hover:scale-105 active:scale-95"
          }`}
        >
          {countdown > 0 ? `Close in ${countdown}s` : "Continue"}
        </button>
      </motion.div>
    </div>
  );
}
