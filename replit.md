# replit.md

## Overview

This is a **Memory Match** card-flipping educational game for kids, built as a full-stack web application. Features include:
- **4 Themes**: Animals (free), Fruits (free), Superheroes (locked), Vehicles (locked)
- **10 Progressive Levels** with Crazy Mix integration:
  - Levels 1-2: 6 pairs, 3 lives, single theme
  - Levels 3-5: 8 pairs, 4 lives, 2-theme mix
  - Levels 6-8: 12 pairs, 5 lives, Crazy Mix (all themes)
  - Levels 9-10: 15 pairs, 6 lives, Crazy Mix + faster timer
- **Countdown Timer**: Time limit per level (55s-110s), visual warnings at 30s/15s, Watch Ad for +30s
- **Power-ups**: Hint (reveals a matching pair) and Add Time (+30s via rewarded ad)
- **Monetization placeholders**: AdMob Banner, Interstitial after winning, Rewarded Video Ads for hints and unlocking themes/levels, Buy Full Version button
- **Lives System**: Scaled per level (3-6 lives), "Extra Life Earned!" animation, game over with "Watch Ad to Continue"
- **Progress saving** via localStorage (highest level, unlocked themes, best scores)
- **Theme-specific visuals**: Unique background gradients and glow effects per theme (wooden/green for Animals, cosmic purple for Superheroes, metallic blue for Vehicles, fruit-green for Fruits)
- **Card effects**: Hover glow, shimmer animation on card backs, shake on failed match, pulse on successful match
- **Match feedback**: Confetti burst on successful match with success sound, shake animation with buzz on failed match
- Sound effects, background music, animations via Framer Motion, confetti on win

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript, bundled via Vite
- **Styling**: Tailwind CSS with a shadcn/ui component library (Radix UI primitives)
- **State Management**: Zustand stores
  - `useMemoryGame` — core game state: themes, levels, cards, power-ups, monetization, progress saving
  - `useAudio` — sound management: background music, hit/success sounds, mute toggle
- **Screens** (conditional rendering via Zustand `screen` field):
  - `HomeScreen` — title + play button
  - `ThemeSelect` — choose theme (with locked/unlockable themes)
  - `LevelSelect` — 10 levels grid with progress tracking
  - `GameBoard` — card grid with stats, hint/timer buttons
  - `WinScreen` — results with stars, next level, interstitial ad
- **Modals**: `RewardedAdModal`, `BuyFullVersionModal`
- **Ad Placeholders**: `AdBanner` (fixed bottom), `AdInterstitial` (after win)
- **Animations**: Framer Motion for card flips, screen transitions, and UI elements
- **Card Images**: 34 cartoon images across 4 themes in `client/public/cards/`
- **Entry point**: `client/src/main.tsx` renders `<App />` into `#root`

### Backend Architecture
- **Framework**: Express.js on Node with TypeScript (run via `tsx`)
- **HTTP Server**: Node's `createServer` wrapping Express
- **API Pattern**: Routes prefixed with `/api` (currently minimal — mostly scaffolding)
- **Dev Server**: Vite middleware is used in development mode for HMR; in production, static files are served from `dist/public`

### Database Schema
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema** (`shared/schema.ts`): Single `users` table (not actively used — game is client-side)

### Path Aliases
- `@/*` → `./client/src/*`
- `@shared/*` → `./shared/*`

### Key Commands
- `npm run dev` — Start dev server with Vite HMR
- `npm run build` — Build client (Vite) and server (esbuild) to `dist/`
- `npm run start` — Run production build

## Recent Changes
- Added 10 progressive levels (2-12 pairs per level)
- Added 4 themes: Animals, Fruits, Superheroes, Vehicles
- Added power-ups: Hint and Timer Extension
- Added monetization: Rewarded Video Ad placeholders, Buy Full Version modal
- Added progress saving via localStorage
- Generated 24 new card images (8 superheroes, 8 fruits, 8 vehicles)
- Added 3-lives system with Game Over screen and Watch Ad to Continue
- Added theme-specific backgrounds (wooden/green, cosmic purple, metallic blue, fruit-green)
- Added card glow on hover, shimmer animation, shake on fail, pulse on match
- Added per-match confetti burst with success sound feedback
- Restructured levels: 6-24 pairs (was 2-12), +2 pairs per level
- Added countdown timer with per-level time limits (60s-160s)
- Timer visual warnings at 30s (orange) and 15s (red pulsing)
- Rewarded ad for +30s time extension, responsive grid for large card counts
