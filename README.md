### Folder Structure 

endless-runner/
├── index.html
├── package.json
├── pnpm-lock.yaml
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── src/
    ├── main.jsx                # React entry
    ├── App.jsx                 # Root component, mounts Game
    ├── index.css               # Tailwind base styles
    │
    ├── components/             # UI + game objects
    │   ├── Game.jsx            # Main game loop + state
    │   ├── Player.jsx          # Dino/player component
    │   ├── Obstacle.jsx        # Obstacle component
    │   ├── Ground.jsx          # Ground / background
    │   ├── Scoreboard.jsx      # Score + best score display
    │   └── Controls.jsx        # Pause/Resume, Restart buttons
    │
    ├── hooks/                  # Reusable logic
    │   └── useGameLoop.js      # requestAnimationFrame, update logic
    │
    ├── utils/                  # Helpers
    │   ├── collision.js        # AABB collision detection
    │   ├── constants.js        # Speeds, gravity, thresholds
    │   └── storage.js          # localStorage helpers
    │
    ├── assets/                 # Images, sounds
    │   ├── sounds/
    │   │   ├── jump.mp3
    │   │   ├── flame.mp3
    │   │   └── hit.mp3
    │   └── images/
    │       ├── player.png
    │       ├── flame.png
    │       └── obstacle.png
    │
    └── data/
        └── leaderboard.json     # Mock leaderboard scores
