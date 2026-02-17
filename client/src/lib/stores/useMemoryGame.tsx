import { create } from "zustand";

export type GameScreen = "home" | "theme_select" | "level_select" | "playing" | "won" | "game_over";
export type ThemeId = "animals" | "superheroes" | "fruits" | "vehicles";
export type MatchFeedback = "none" | "success" | "fail";

interface CardImage {
  id: string;
  src: string;
}

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  emoji: string;
  color: string;
  cardBack: string;
  frameBg: string;
  frameGlow: string;
  locked: boolean;
  images: CardImage[];
}

interface CardData {
  id: number;
  imageId: string;
  imageSrc: string;
  isFlipped: boolean;
  isMatched: boolean;
}

type MixMode = "single" | "dual" | "all";

interface LevelConfig {
  level: number;
  pairs: number;
  lives: number;
  mixMode: MixMode;
  label: string;
  locked: boolean;
}

interface SavedProgress {
  highestLevel: number;
  unlockedThemes: ThemeId[];
  bestScores: Record<number, { moves: number; time: number } | null>;
}

interface MemoryGameState {
  screen: GameScreen;
  selectedTheme: ThemeId;
  currentLevel: number;
  cards: CardData[];
  flippedCards: number[];
  moves: number;
  matches: number;
  totalPairs: number;
  isLocked: boolean;
  timer: number;
  timerRunning: boolean;
  hintsRemaining: number;
  timerExtensionsRemaining: number;
  showRewardedAd: boolean;
  rewardedAdCallback: (() => void) | null;
  showBuyFullVersion: boolean;
  progress: SavedProgress;
  lives: number;
  maxLives: number;
  matchFeedback: MatchFeedback;
  lastFailedCards: number[];
  showMatchConfetti: boolean;
  previewPhase: boolean;
  previewCountdown: number;
  showExtraLifeMessage: boolean;
  levelMixMode: MixMode;

  setScreen: (screen: GameScreen) => void;
  selectTheme: (theme: ThemeId) => void;
  startLevel: (level: number) => void;
  flipCard: (id: number) => void;
  checkMatch: () => void;
  resetToHome: () => void;
  incrementTimer: () => void;
  useHint: () => void;
  useTimerExtension: () => void;
  showRewardedAdForHint: () => void;
  showRewardedAdForTime: () => void;
  showRewardedAdForTheme: (themeId: ThemeId) => void;
  showRewardedAdForLevel: () => void;
  showRewardedAdForContinue: () => void;
  closeRewardedAd: () => void;
  closeBuyFullVersion: () => void;
  unlockPremiumLevels: () => void;
  clearMatchFeedback: () => void;
  endPreview: () => void;
  setPreviewCountdown: (n: number) => void;
  getThemes: () => ThemeConfig[];
  getLevels: () => LevelConfig[];
  getThemeConfig: () => ThemeConfig;
}

const THEMES: Record<ThemeId, Omit<ThemeConfig, "locked">> = {
  animals: {
    id: "animals",
    name: "Animals",
    emoji: "🐾",
    color: "from-green-400 to-emerald-600",
    cardBack: "linear-gradient(135deg, #8B6914 0%, #A0522D 50%, #8B6914 100%)",
    frameBg: "linear-gradient(135deg, #2d5016 0%, #1a3a0a 30%, #0d2b06 60%, #2d5016 100%)",
    frameGlow: "rgba(76, 175, 80, 0.3)",
    images: [
      { id: "cat", src: "/cards/cat.webp" },
      { id: "dog", src: "/cards/dog.webp" },
      { id: "elephant", src: "/cards/elephant.webp" },
      { id: "lion", src: "/cards/lion.webp" },
      { id: "panda", src: "/cards/panda.webp" },
      { id: "rabbit", src: "/cards/rabbit.webp" },
      { id: "fox", src: "/cards/fox.webp" },
      { id: "owl", src: "/cards/owl.webp" },
      { id: "unicorn", src: "/cards/unicorn.webp" },
      { id: "dolphin", src: "/cards/dolphin.webp" },
    ],
  },
  superheroes: {
    id: "superheroes",
    name: "Superheroes",
    emoji: "🦸",
    color: "from-red-500 to-orange-500",
    cardBack: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    frameBg: "linear-gradient(135deg, #1a0033 0%, #2d1b69 30%, #4a1a8a 60%, #1a0033 100%)",
    frameGlow: "rgba(156, 39, 176, 0.4)",
    images: [
      { id: "hero1", src: "/cards/hero1.webp" },
      { id: "hero2", src: "/cards/hero2.webp" },
      { id: "hero3", src: "/cards/hero3.webp" },
      { id: "hero4", src: "/cards/hero4.webp" },
      { id: "hero5", src: "/cards/hero5.webp" },
      { id: "hero6", src: "/cards/hero6.webp" },
      { id: "hero7", src: "/cards/hero7.webp" },
      { id: "hero8", src: "/cards/hero8.webp" },
    ],
  },
  fruits: {
    id: "fruits",
    name: "Fruits",
    emoji: "🍎",
    color: "from-yellow-400 to-orange-500",
    cardBack: "linear-gradient(135deg, #a8e063 0%, #56ab2f 100%)",
    frameBg: "linear-gradient(135deg, #1a3300 0%, #2d5500 30%, #408000 60%, #1a3300 100%)",
    frameGlow: "rgba(139, 195, 74, 0.3)",
    images: [
      { id: "apple", src: "/cards/apple.webp" },
      { id: "banana", src: "/cards/banana.webp" },
      { id: "strawberry", src: "/cards/strawberry.webp" },
      { id: "orange", src: "/cards/orange.webp" },
      { id: "watermelon", src: "/cards/watermelon.webp" },
      { id: "grape", src: "/cards/grape.webp" },
      { id: "pineapple", src: "/cards/pineapple.webp" },
      { id: "cherry", src: "/cards/cherry.webp" },
    ],
  },
  vehicles: {
    id: "vehicles",
    name: "Vehicles",
    emoji: "🚗",
    color: "from-blue-500 to-cyan-500",
    cardBack: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    frameBg: "linear-gradient(135deg, #0a1628 0%, #0d2847 30%, #1a4a7a 60%, #0a1628 100%)",
    frameGlow: "rgba(33, 150, 243, 0.4)",
    images: [
      { id: "car", src: "/cards/car.webp" },
      { id: "plane", src: "/cards/plane.webp" },
      { id: "train", src: "/cards/train.webp" },
      { id: "rocket", src: "/cards/rocket.webp" },
      { id: "boat", src: "/cards/boat.webp" },
      { id: "helicopter", src: "/cards/helicopter.webp" },
      { id: "bus", src: "/cards/bus.webp" },
      { id: "firetruck", src: "/cards/firetruck.webp" },
    ],
  },
};

interface LevelDef {
  pairs: number;
  lives: number;
  time: number;
  mixMode: MixMode;
}

const LEVELS: LevelDef[] = [
  { pairs: 6,  lives: 3, time: 60,  mixMode: "single" },
  { pairs: 6,  lives: 3, time: 55,  mixMode: "single" },
  { pairs: 8,  lives: 4, time: 75,  mixMode: "dual" },
  { pairs: 8,  lives: 4, time: 70,  mixMode: "dual" },
  { pairs: 8,  lives: 4, time: 65,  mixMode: "dual" },
  { pairs: 12, lives: 5, time: 100, mixMode: "all" },
  { pairs: 12, lives: 5, time: 95,  mixMode: "all" },
  { pairs: 12, lives: 5, time: 90,  mixMode: "all" },
  { pairs: 15, lives: 6, time: 110, mixMode: "all" },
  { pairs: 15, lives: 6, time: 100, mixMode: "all" },
];

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function getAllThemeImages(): CardImage[] {
  const all: CardImage[] = [];
  for (const t of Object.values(THEMES)) {
    all.push(...t.images);
  }
  return all;
}

function getDualThemeImages(primaryTheme: ThemeId): CardImage[] {
  const themeIds = Object.keys(THEMES) as ThemeId[];
  const others = themeIds.filter((t) => t !== primaryTheme);
  const secondTheme = others[Math.floor(Math.random() * others.length)];
  return [...THEMES[primaryTheme].images, ...THEMES[secondTheme].images];
}

function createCards(themeId: ThemeId, pairs: number, mixMode: MixMode): CardData[] {
  let available: CardImage[];
  if (mixMode === "all") {
    available = getAllThemeImages();
  } else if (mixMode === "dual") {
    available = getDualThemeImages(themeId);
  } else {
    available = [...THEMES[themeId].images];
  }
  const unique = shuffleArray(available);
  const pool: CardImage[] = [];
  while (pool.length < pairs) {
    pool.push(...unique);
  }
  const selected = pool.slice(0, pairs);
  const cards: CardData[] = [];
  let id = 0;
  for (const img of selected) {
    cards.push({ id: id++, imageId: img.id, imageSrc: img.src, isFlipped: false, isMatched: false });
    cards.push({ id: id++, imageId: img.id, imageSrc: img.src, isFlipped: false, isMatched: false });
  }
  return shuffleArray(cards);
}

function loadProgress(): SavedProgress {
  try {
    const saved = localStorage.getItem("memoryMatchProgress");
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        highestLevel: parsed.highestLevel || 1,
        unlockedThemes: parsed.unlockedThemes || ["animals", "fruits"],
        bestScores: parsed.bestScores || {},
      };
    }
  } catch {}
  return { highestLevel: 1, unlockedThemes: ["animals", "fruits"], bestScores: {} };
}

function saveProgress(progress: SavedProgress) {
  try {
    localStorage.setItem("memoryMatchProgress", JSON.stringify(progress));
  } catch {}
}

export const useMemoryGame = create<MemoryGameState>((set, get) => ({
  screen: "home",
  selectedTheme: "animals",
  currentLevel: 1,
  cards: [],
  flippedCards: [],
  moves: 0,
  matches: 0,
  totalPairs: 0,
  isLocked: false,
  timer: 0,
  timerRunning: false,
  hintsRemaining: 1,
  timerExtensionsRemaining: 1,
  showRewardedAd: false,
  rewardedAdCallback: null,
  showBuyFullVersion: false,
  progress: loadProgress(),
  lives: 3,
  maxLives: 3,
  matchFeedback: "none",
  lastFailedCards: [],
  showMatchConfetti: false,
  previewPhase: false,
  previewCountdown: 10,
  showExtraLifeMessage: false,
  levelMixMode: "single" as MixMode,

  setScreen: (screen) => set({ screen }),

  selectTheme: (theme) => {
    const { progress } = get();
    if (theme !== "animals" && theme !== "fruits" && !progress.unlockedThemes.includes(theme)) {
      return;
    }
    set({ selectedTheme: theme, screen: "level_select" });
  },

  startLevel: (level) => {
    const { selectedTheme, progress } = get();
    if (level > 4 && level > progress.highestLevel) {
      set({ showBuyFullVersion: true });
      return;
    }
    const levelDef = LEVELS[level - 1] || LEVELS[LEVELS.length - 1];
    const cards = createCards(selectedTheme, levelDef.pairs, levelDef.mixMode);
    const previewCards = cards.map((c) => ({ ...c, isFlipped: true }));
    const prevLevelDef = level > 1 ? LEVELS[level - 2] : null;
    const gotExtraLife = prevLevelDef ? levelDef.lives > prevLevelDef.lives : false;
    set({
      screen: "playing",
      currentLevel: level,
      cards: previewCards,
      flippedCards: [],
      moves: 0,
      matches: 0,
      totalPairs: levelDef.pairs,
      isLocked: true,
      timer: levelDef.time,
      timerRunning: false,
      hintsRemaining: 1,
      timerExtensionsRemaining: 0,
      lives: levelDef.lives,
      maxLives: levelDef.lives,
      matchFeedback: "none",
      lastFailedCards: [],
      showMatchConfetti: false,
      previewPhase: true,
      previewCountdown: 10,
      showExtraLifeMessage: gotExtraLife,
      levelMixMode: levelDef.mixMode,
    });
    if (gotExtraLife) {
      setTimeout(() => set({ showExtraLifeMessage: false }), 3000);
    }
  },

  flipCard: (id) => {
    const { cards, flippedCards, isLocked } = get();
    if (isLocked) return;
    const card = cards.find((c) => c.id === id);
    if (!card || card.isFlipped || card.isMatched) return;
    if (flippedCards.length >= 2) return;

    const updatedCards = cards.map((c) => (c.id === id ? { ...c, isFlipped: true } : c));
    const newFlipped = [...flippedCards, id];
    set({ cards: updatedCards, flippedCards: newFlipped });

    if (newFlipped.length === 2) {
      set({ isLocked: true, moves: get().moves + 1 });
      setTimeout(() => get().checkMatch(), 800);
    }
  },

  checkMatch: () => {
    const { cards, flippedCards, matches, totalPairs, currentLevel, progress, moves, timer, lives } = get();
    if (flippedCards.length !== 2) return;

    const [first, second] = flippedCards;
    const card1 = cards.find((c) => c.id === first);
    const card2 = cards.find((c) => c.id === second);

    if (card1 && card2 && card1.imageId === card2.imageId) {
      const updatedCards = cards.map((c) =>
        c.id === first || c.id === second ? { ...c, isMatched: true } : c
      );
      const newMatches = matches + 1;

      set({
        cards: updatedCards,
        flippedCards: [],
        isLocked: false,
        matches: newMatches,
        matchFeedback: "success",
        showMatchConfetti: true,
      });

      setTimeout(() => set({ matchFeedback: "none", showMatchConfetti: false }), 1500);

      if (newMatches === totalPairs) {
        const newHighest = Math.max(progress.highestLevel, currentLevel + 1);
        const newBest = { ...progress.bestScores };
        const existing = newBest[currentLevel];
        if (!existing || moves < existing.moves) {
          newBest[currentLevel] = { moves, time: timer };
        }
        const updatedProgress = { ...progress, highestLevel: Math.min(newHighest, 10), bestScores: newBest };
        saveProgress(updatedProgress);
        setTimeout(() => {
          set({
            screen: "won",
            timerRunning: false,
            progress: updatedProgress,
            showMatchConfetti: false,
          });
        }, 800);
      }
    } else {
      const newLives = lives - 1;
      set({
        matchFeedback: "fail",
        lastFailedCards: [first, second],
      });

      setTimeout(() => {
        const updatedCards = cards.map((c) =>
          c.id === first || c.id === second ? { ...c, isFlipped: false } : c
        );

        if (newLives <= 0) {
          set({
            cards: updatedCards,
            flippedCards: [],
            isLocked: false,
            lives: 0,
            matchFeedback: "none",
            lastFailedCards: [],
            screen: "game_over",
            timerRunning: false,
          });
        } else {
          set({
            cards: updatedCards,
            flippedCards: [],
            isLocked: false,
            lives: newLives,
            matchFeedback: "none",
            lastFailedCards: [],
          });
        }
      }, 600);
    }
  },

  resetToHome: () => {
    set({
      screen: "home",
      cards: [],
      flippedCards: [],
      moves: 0,
      matches: 0,
      totalPairs: 0,
      isLocked: false,
      timer: 0,
      timerRunning: false,
      lives: 3,
      matchFeedback: "none",
      lastFailedCards: [],
      showMatchConfetti: false,
    });
  },

  incrementTimer: () => {
    if (get().timerRunning) {
      const newTime = get().timer - 1;
      if (newTime <= 0) {
        set({
          timer: 0,
          timerRunning: false,
          screen: "game_over",
          isLocked: true,
        });
      } else {
        set({ timer: newTime });
      }
    }
  },

  useHint: () => {
    const { cards, hintsRemaining } = get();
    if (hintsRemaining <= 0) return;

    const unmatched = cards.filter((c) => !c.isMatched && !c.isFlipped);
    const imageIds = Array.from(new Set(unmatched.map((c) => c.imageId)));
    if (imageIds.length === 0) return;

    const targetId = imageIds[0];
    const pair = unmatched.filter((c) => c.imageId === targetId).slice(0, 2);
    if (pair.length < 2) return;

    const updatedCards = cards.map((c) =>
      pair.some((p) => p.id === c.id) ? { ...c, isFlipped: true } : c
    );
    set({ cards: updatedCards, hintsRemaining: hintsRemaining - 1, isLocked: true });

    setTimeout(() => {
      const currentCards = get().cards;
      const resetCards = currentCards.map((c) =>
        pair.some((p) => p.id === c.id) && !c.isMatched ? { ...c, isFlipped: false } : c
      );
      set({ cards: resetCards, isLocked: false });
    }, 1500);
  },

  useTimerExtension: () => {
    const { timerExtensionsRemaining, timer } = get();
    if (timerExtensionsRemaining <= 0) return;
    set({ timer: timer + 30, timerExtensionsRemaining: timerExtensionsRemaining - 1 });
  },

  showRewardedAdForHint: () => {
    set({
      showRewardedAd: true,
      rewardedAdCallback: () => {
        set({ hintsRemaining: get().hintsRemaining + 1, showRewardedAd: false, rewardedAdCallback: null });
      },
    });
  },

  showRewardedAdForTime: () => {
    set({
      showRewardedAd: true,
      rewardedAdCallback: () => {
        set({ timerExtensionsRemaining: get().timerExtensionsRemaining + 1, showRewardedAd: false, rewardedAdCallback: null });
      },
    });
  },

  showRewardedAdForTheme: (themeId: ThemeId) => {
    set({
      showRewardedAd: true,
      rewardedAdCallback: () => {
        const { progress } = get();
        const updated = {
          ...progress,
          unlockedThemes: [...progress.unlockedThemes, themeId],
        };
        saveProgress(updated);
        set({ progress: updated, showRewardedAd: false, rewardedAdCallback: null });
      },
    });
  },

  showRewardedAdForLevel: () => {
    set({
      showRewardedAd: true,
      showBuyFullVersion: false,
      rewardedAdCallback: () => {
        const { progress } = get();
        const updated = {
          ...progress,
          highestLevel: 10,
        };
        saveProgress(updated);
        set({ progress: updated, showRewardedAd: false, rewardedAdCallback: null });
      },
    });
  },

  showRewardedAdForContinue: () => {
    set({
      showRewardedAd: true,
      rewardedAdCallback: () => {
        const { maxLives } = get();
        set({
          lives: maxLives,
          screen: "playing",
          timerRunning: true,
          showRewardedAd: false,
          rewardedAdCallback: null,
        });
      },
    });
  },

  closeRewardedAd: () => {
    set({ showRewardedAd: false, rewardedAdCallback: null });
  },

  closeBuyFullVersion: () => {
    set({ showBuyFullVersion: false });
  },

  unlockPremiumLevels: () => {
    const { progress } = get();
    const updated = { ...progress, highestLevel: 10 };
    saveProgress(updated);
    set({ progress: updated, showBuyFullVersion: false });
  },

  clearMatchFeedback: () => {
    set({ matchFeedback: "none", lastFailedCards: [], showMatchConfetti: false });
  },

  endPreview: () => {
    const { cards } = get();
    const hiddenCards = cards.map((c) => ({ ...c, isFlipped: false }));
    set({
      cards: hiddenCards,
      previewPhase: false,
      previewCountdown: 0,
      isLocked: false,
      timerRunning: true,
    });
  },

  setPreviewCountdown: (n: number) => {
    set({ previewCountdown: n });
  },

  getThemes: () => {
    const { progress } = get();
    return (Object.values(THEMES) as Omit<ThemeConfig, "locked">[]).map((t) => ({
      ...t,
      locked: t.id !== "animals" && t.id !== "fruits" && !progress.unlockedThemes.includes(t.id),
    }));
  },

  getLevels: () => {
    const { progress } = get();
    return LEVELS.map((def, i) => {
      const level = i + 1;
      const locked = level > progress.highestLevel;
      const mixLabel = def.mixMode === "all" ? "Crazy Mix" : def.mixMode === "dual" ? "Mix" : "";
      return { level, pairs: def.pairs, lives: def.lives, mixMode: def.mixMode, label: mixLabel ? `Lv${level} ${mixLabel}` : `Level ${level}`, locked };
    });
  },

  getThemeConfig: () => {
    const { selectedTheme, progress } = get();
    const t = THEMES[selectedTheme];
    return {
      ...t,
      locked: t.id !== "animals" && t.id !== "fruits" && !progress.unlockedThemes.includes(t.id),
    };
  },
}));
