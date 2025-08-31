# LSOYS Game - Simplified Endless Runner

A simplified React + Vite endless runner game with core mechanics only.

## Features

- **Player Controls**: Jump (SPACE/↑) and Duck (↓)
- **Obstacles**: Two types - Jump obstacles (gray) and Duck obstacles (red)
- **Collision Detection**: Game over when player hits obstacle (unless ducking under red obstacles)
- **Difficulty Scaling**: Speed and spawn rate increase over time
- **Simple UI**: Basic game state display and controls

## Removed Features

This is a simplified version with the following features removed:
- Score system and leaderboard
- Flame power system
- localStorage for best scores
- Pause/resume functionality  
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
    ├── main.jsx                # React entry
    ├── App.jsx                 # Root component, mounts Game
    ├── index.css               # Tailwind base styles
    │
    ├── components/             # Core game components
    │   ├── Game.jsx            # Main game loop + state (simplified)
    │   ├── Player.jsx          # Player component (no flame effects)
    │   ├── Obstacle.jsx        # Obstacle component (no animations)
    │   └── Ground.jsx          # Ground / background
    │
    ├── hooks/                  # Game loop hook
    │   └── useGameLoop.js      # requestAnimationFrame logic
    │
    └── utils/                  # Core utilities
        ├── collision.js        # Simple AABB collision detection
        └── constants.js        # Game constants (simplified)

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

