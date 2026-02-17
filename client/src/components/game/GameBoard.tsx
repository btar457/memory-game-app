import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMemoryGame } from "@/lib/stores/useMemoryGame";
import { useAudio } from "@/lib/stores/useAudio";
import MemoryCard from "./MemoryCard";
import AdBanner from "./AdBanner";

function getGridCols(totalCards: number): string {
  if (totalCards <= 12) return "grid-cols-3 sm:grid-cols-4";
  if (totalCards <= 16) return "grid-cols-4";
  if (totalCards <= 20) return "grid-cols-4 sm:grid-cols-5";
  if (totalCards <= 24) return "grid-cols-4 sm:grid-cols-6";
  if (totalCards <= 30) return "grid-cols-5 sm:grid-cols-6";
  return "grid-cols-5 sm:grid-cols-6";
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default function GameBoard() {
  const {
    cards, moves, matches, totalPairs, currentLevel,
    setScreen, incrementTimer, timer, timerRunning,
    hintsRemaining, timerExtensionsRemaining,
    showRewardedAdForHint, showRewardedAdForTime, useHint, useTimerExtension,
    getThemeConfig, lives, maxLives, matchFeedback, showMatchConfetti,
    previewPhase, previewCountdown, endPreview, setPreviewCountdown,
    showExtraLifeMessage, levelMixMode,
  } = useMemoryGame();
  const { playSuccess, playHit } = useAudio();
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const previewRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const theme = getThemeConfig();
  const prevFeedback = useRef(matchFeedback);

  useEffect(() => {
    if (matchFeedback === "success" && prevFeedback.current !== "success") {
      playSuccess();
    }
    prevFeedback.current = matchFeedback;
  }, [matchFeedback, playSuccess]);

  useEffect(() => {
    if (previewPhase) {
      previewRef.current = setInterval(() => {
        const current = useMemoryGame.getState().previewCountdown;
        if (current <= 1) {
          if (previewRef.current) clearInterval(previewRef.current);
          endPreview();
        } else {
          setPreviewCountdown(current - 1);
        }
      }, 1000);
    }
    return () => {
      if (previewRef.current) clearInterval(previewRef.current);
    };
  }, [previewPhase, endPreview, setPreviewCountdown]);

  useEffect(() => {
    if (timerRunning) {
      timerRef.current = setInterval(() => {
        incrementTimer();
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerRunning, incrementTimer]);

  return (
    <div
      className="flex flex-col items-center w-full min-h-screen px-2 pb-20 pt-2 relative"
      style={{ background: theme.frameBg }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 30% 20%, ${theme.frameGlow} 0%, transparent 50%), radial-gradient(circle at 70% 80%, ${theme.frameGlow} 0%, transparent 50%)`,
        }}
      />

      <div className="relative z-10 w-full max-w-2xl mx-auto">
        <div className="w-full flex items-center justify-between mb-3 px-2">
          <button
            onClick={() => setScreen("level_select")}
            className="bg-white/15 hover:bg-white/25 text-white px-4 py-2 rounded-full text-sm font-bold transition-all backdrop-blur-sm border border-white/10"
          >
            ← Back
          </button>
          <div className="text-center">
            <div className="text-white font-bold text-lg drop-shadow-lg">
              {theme.emoji} Level {currentLevel}
            </div>
            {levelMixMode !== "single" && (
              <div className="text-[10px] text-yellow-300/80 font-medium">
                {levelMixMode === "all" ? "🌀 Crazy Mix" : "🔀 2-Theme Mix"}
              </div>
            )}
          </div>
          <div className="flex gap-1">
            {Array.from({ length: maxLives }).map((_, i) => (
              <span key={i} className={`text-xl ${i < lives ? "heart-pulse" : "opacity-30"}`}>
                {i < lives ? "❤️" : "🖤"}
              </span>
            ))}
          </div>
        </div>

        <div className="w-full flex items-center justify-center gap-3 mb-3 flex-wrap">
          <div className="bg-black/20 backdrop-blur-sm rounded-2xl px-3 py-1.5 text-center border border-white/10">
            <div className="text-white/50 text-[10px] font-medium uppercase tracking-wider">Moves</div>
            <div className="text-white text-lg font-bold">{moves}</div>
          </div>
          <div className="bg-black/20 backdrop-blur-sm rounded-2xl px-3 py-1.5 text-center border border-white/10">
            <div className="text-white/50 text-[10px] font-medium uppercase tracking-wider">Pairs</div>
            <div className="text-white text-lg font-bold">{matches}/{totalPairs}</div>
          </div>
          <div className={`backdrop-blur-sm rounded-2xl px-3 py-1.5 text-center border ${timer <= 15 ? "bg-red-900/40 border-red-500/30 animate-pulse" : timer <= 30 ? "bg-orange-900/30 border-orange-500/20" : "bg-black/20 border-white/10"}`}>
            <div className="text-white/50 text-[10px] font-medium uppercase tracking-wider">Time</div>
            <div className={`text-lg font-bold ${timer <= 15 ? "text-red-400" : timer <= 30 ? "text-orange-400" : "text-white"}`}>{formatTime(timer)}</div>
          </div>
        </div>

        <AnimatePresence>
          {showExtraLifeMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.8 }}
              className="w-full flex justify-center mb-2"
            >
              <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white text-sm font-bold px-5 py-2 rounded-full shadow-lg shadow-pink-500/30 flex items-center gap-2">
                <span className="text-lg">💖</span> Extra Life Earned!
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="w-full flex items-center justify-center gap-2 mb-3">
          {hintsRemaining > 0 ? (
            <button
              onClick={useHint}
              className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white text-xs font-bold py-2 px-4 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-yellow-500/30"
            >
              💡 Hint ({hintsRemaining})
            </button>
          ) : (
            <button
              onClick={showRewardedAdForHint}
              className="bg-gradient-to-r from-gray-600 to-gray-700 text-white text-xs font-bold py-2 px-4 rounded-xl hover:scale-105 active:scale-95 transition-all border border-white/10"
            >
              🎬 Watch Ad for Hint
            </button>
          )}

          {timerExtensionsRemaining > 0 ? (
            <button
              onClick={useTimerExtension}
              className="bg-gradient-to-r from-blue-400 to-cyan-500 text-white text-xs font-bold py-2 px-4 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-blue-500/30"
            >
              ⏱️ +30s ({timerExtensionsRemaining})
            </button>
          ) : (
            <button
              onClick={showRewardedAdForTime}
              className="bg-gradient-to-r from-gray-600 to-gray-700 text-white text-xs font-bold py-2 px-4 rounded-xl hover:scale-105 active:scale-95 transition-all border border-white/10"
            >
              🎬 Watch Ad for +30s
            </button>
          )}
        </div>

        <AnimatePresence>
          {showMatchConfetti && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
            >
              <div className="text-6xl animate-bounce">🎉</div>
            </motion.div>
          )}
        </AnimatePresence>

        {previewPhase && (
          <div className="w-full flex flex-col items-center mb-3">
            <div className="bg-black/30 backdrop-blur-sm rounded-2xl px-6 py-3 text-center border border-white/15">
              <div className="text-white/70 text-sm font-medium mb-1">Memorize the cards!</div>
              <motion.div
                key={previewCountdown}
                initial={{ scale: 1.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                className="text-5xl font-extrabold text-yellow-400 drop-shadow-lg"
              >
                {previewCountdown}
              </motion.div>
              <button
                onClick={endPreview}
                className="mt-2 bg-gradient-to-r from-green-400 to-emerald-500 text-white text-sm font-bold py-2 px-5 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-green-500/30"
              >
                Start Now!
              </button>
            </div>
          </div>
        )}

        <div
          className={`grid ${getGridCols(cards.length)} gap-1.5 sm:gap-2 md:gap-3 w-full ${cards.length > 24 ? "max-w-2xl" : "max-w-lg"} mx-auto p-3 rounded-3xl`}
          style={{
            background: "rgba(0,0,0,0.15)",
            border: "2px solid rgba(255,255,255,0.08)",
            boxShadow: `0 0 30px ${theme.frameGlow}, inset 0 0 30px rgba(0,0,0,0.2)`,
          }}
        >
          {cards.map((card) => (
            <MemoryCard
              key={card.id}
              id={card.id}
              imageId={card.imageId}
              imageSrc={card.imageSrc}
              isFlipped={card.isFlipped}
              isMatched={card.isMatched}
            />
          ))}
        </div>
      </div>

      <AdBanner />
    </div>
  );
}
