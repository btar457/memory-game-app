import { motion } from "framer-motion";
import { useMemoryGame } from "@/lib/stores/useMemoryGame";
import { useAudio } from "@/lib/stores/useAudio";

interface MemoryCardProps {
  id: number;
  imageId: string;
  imageSrc: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export default function MemoryCard({ id, imageId, imageSrc, isFlipped, isMatched }: MemoryCardProps) {
  const flipCard = useMemoryGame((s) => s.flipCard);
  const getThemeConfig = useMemoryGame((s) => s.getThemeConfig);
  const lastFailedCards = useMemoryGame((s) => s.lastFailedCards);
  const matchFeedback = useMemoryGame((s) => s.matchFeedback);
  const { playHit } = useAudio();
  const theme = getThemeConfig();

  const isFailed = matchFeedback === "fail" && lastFailedCards.includes(id);

  const handleClick = () => {
    if (!isFlipped && !isMatched) {
      playHit();
      flipCard(id);
    }
  };

  const shakeAnimation = isFailed
    ? { x: [0, -8, 8, -6, 6, -3, 3, 0], transition: { duration: 0.5 } }
    : {};

  return (
    <motion.div
      className="perspective-1000 cursor-pointer card-container"
      onClick={handleClick}
      animate={shakeAnimation}
    >
      <motion.div
        className="relative w-full aspect-square"
        animate={{ rotateY: isFlipped || isMatched ? 180 : 0 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        style={{ transformStyle: "preserve-3d" }}
      >
        <div
          className={`absolute inset-0 rounded-2xl flex items-center justify-center backface-hidden card-back-face ${
            isMatched ? "opacity-60" : ""
          }`}
          style={{
            backfaceVisibility: "hidden",
            background: theme.cardBack,
            boxShadow: `0 4px 15px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2)`,
            border: "3px solid rgba(255,255,255,0.15)",
          }}
        >
          <div className="text-white text-3xl md:text-4xl font-bold select-none drop-shadow-lg">?</div>
          <div className="absolute inset-2 rounded-xl border-2 border-white/10" />
          <div className="absolute inset-0 rounded-2xl card-shimmer" />
        </div>

        <div
          className={`absolute inset-0 rounded-2xl flex items-center justify-center backface-hidden p-2 ${
            isMatched ? "card-matched" : "card-front-face"
          }`}
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            background: isMatched ? "#e8f5e9" : "#ffffff",
            boxShadow: isMatched
              ? "0 0 20px rgba(76, 175, 80, 0.5), 0 4px 15px rgba(0,0,0,0.2)"
              : "0 4px 15px rgba(0,0,0,0.2)",
            border: isMatched ? "3px solid #4CAF50" : "3px solid #e0e0e0",
          }}
        >
          <img
            src={imageSrc}
            alt={imageId}
            className="w-full h-full object-contain rounded-lg"
            draggable={false}
          />
          {isMatched && (
            <div className="absolute top-1 right-1 text-lg">✓</div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
