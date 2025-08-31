# LSOYS Game - Enhanced Endless Runner

A feature-rich React + Vite endless runner game with responsive design and mobile support.

## 🎮 Features

### Core Gameplay

- **Player Controls**: Jump (SPACE/↑) and Duck (↓/S)
- **Obstacle Types**:
  - Gray obstacles: Jump over them ⚠️
  - Red obstacles: Duck under them ✈️
- **Physics**: Delta-time integration for smooth, frame-rate independent gameplay
- **Collision Detection**: AABB collision with proper ducking mechanics

### Scoring & Progression

- **Time-based Scoring**: Points awarded based on survival time
- **Best Score Tracking**: Automatically saved to localStorage
- **Difficulty Scaling**: Speed and spawn rate gradually increase
- **New Best Score Indicators**: Visual celebration for personal records

### UI/UX Features

- **Responsive Design**: Works on desktop and mobile devices
- **Mobile Touch Controls**: Tap top half to jump, bottom half to duck
- **Pause/Resume**: Press ESC or use the pause button
- **Game State Management**: Clear win/loss states with restart functionality
- **Sound Effects**: Basic jump and collision sounds
- **Visual Polish**: Hover effects, transitions, and animations

### Data & Leaderboard

- **Leaderboard**: View top scores from pre-populated JSON data
- **Score Comparison**: See how your current score compares to leaderboard
- **Persistent Storage**: Best scores saved locally

### Keyboard Controls

- **SPACE/↑**: Jump
- **↓/S**: Duck
- **ESC**: Pause/Resume
- **M**: Toggle sound
- **L**: View leaderboard
- **R**: Restart (when dead)
- **ENTER**: Start game

### Mobile Features

- **Touch Controls**: Full-screen touch areas for jump/duck
- **Responsive Layout**: Optimized for mobile screens
- **Mobile-friendly UI**: Adapted controls and layout

## 🛠️ Technical Features

- **React + Vite**: Modern development setup with fast HMR
- **Tailwind CSS**: Responsive utility-first styling
- **Delta-time Physics**: Frame-rate independent game loop
- **Component Architecture**: Modular, reusable components
- **localStorage Integration**: Persistent best score tracking
- **JSON Data Loading**: Dynamic leaderboard from external file
- Sound effects and animations
- Touch controls for mobile
- Complex UI screens (start, game over, help)

### Folder Structure

simplified-endless-runner/
├── index.html
├── package.json
├── pnpm-lock.yaml
├── vite.config.js
└── src/
├── main.jsx # React entry
├── App.jsx # Root component, mounts Game
├── index.css # Tailwind base styles
│
├── components/ # Core game components
│ ├── Game.jsx # Main game loop + state (simplified)
│ ├── Player.jsx # Player component (no flame effects)
│ ├── Obstacle.jsx # Obstacle component (no animations)
│ └── Ground.jsx # Ground / background
│
├── hooks/ # Game loop hook
│ └── useGameLoop.js # requestAnimationFrame logic
│
└── utils/ # Core utilities
├── collision.js # Simple AABB collision detection
└── constants.js # Game constants (simplified)

## Core Game Flow

1. `Game.jsx` + `useGameLoop.js` → main game loop and state management
2. `Player.jsx` → running, jumping, ducking states
3. `Obstacle.jsx` + `collision.js` → obstacle spawning and collision detection
4. Difficulty increases over time (speed and spawn rate)

## Getting Started

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

## Controls

- **SPACE** or **↑**: Jump over gray obstacles
- **↓**: Duck under red obstacles
- **R**: Restart game (when dead)

## Game States

- **IDLE**: Press SPACE to start
- **RUNNING**: Game in progress
- **DEAD**: Collision detected, press R to restart
