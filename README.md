# LSOYS Game

A fun endless runner game where you control a player character to avoid obstacles by jumping or ducking. Built with React and Vite.

## Setup

To get started with the LSOYS Game:

1. **Install dependencies:**

   ```bash
   pnpm install
   ```
2. **Run the development server:**

   ```bash
   pnpm dev
   ```

The game will be available at `http://localhost:5173` (or the next available port).

## Controls

- **Jump:** Space / Arrow Up / W
- **Duck:** Arrow Down / S
- **Pause/Resume:** P
- **Restart:** R / Restart button

The game supports both keyboard and touch controls for mobile devices.

---



## [Demo](https://www.loom.com/share/ccfbab214a7947009bd907762e4758ce?sid=ef7b9359-c21c-4381-8ab6-528d10d3d2a1)       [Play](https://endless-game-seven.vercel.app/)

---



## Features

- **Jump and duck mechanics** - Navigate through obstacles with responsive movement
- **Ground and flying obstacles** - Face different types of challenges that require different strategies
- **Collision detection and game over** - Precise collision system with immediate feedback
- **Score and best score with localStorage** - Track your progress with persistent high scores
- **Difficulty scaling** - Game becomes progressively more challenging as you advance
- **Responsive UI** - Complete interface with:
  - Scoreboard displaying current and best scores
  - Difficulty indicator showing current game speed
  - Touch controls for mobile devices
  - Game over screen with restart options
- **Basic sound effects** - Audio feedback for jumps, game music, and game over events

## Known issues

In the mobile screen the game is little hard to controle for the user.

## Development

This project uses:

- **React** - Frontend framework
- **Vite** - Build tool and development server
- **pnpm** - Package manager
- **ESLint** - Code linting

## Project Structure

```
src/
├── components/     # Game components (Player, Obstacles, UI elements)
├── hooks/         # Custom React hooks (game loop logic)
├── utils/         # Utility functions (collision, sound, storage)
├── assets/        # Game assets (images and sounds)
└── data/          # Game data (leaderboard)
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

Enjoy playing LSOYS Game!
