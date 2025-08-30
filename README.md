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

1. `Game.jsx` + `useGameLoop.js` → loop, ground, score ticking.
2. `Player.jsx` → running, jumping, ducking.
3. `Obstacle.jsx` + `collision.js` → spawn, move, collision check.
4. `Scoreboard.jsx` + `storage.js` → score, best score.
5. Add flame power logic in `Game.jsx` (state + shift key).
6. Add controls (pause/restart) and leaderboard stub.
7. Later replace placeholder visuals/sounds in `assets/`.

# checkList

### Core Game Loop

* [ ] Implement `requestAnimationFrame` loop.
* [ ] Create player object (position, velocity, state).
* [ ] Create ground and scrolling background.
* [ ] Spawn obstacles at intervals.
* [ ] Move obstacles left and remove when off-screen.
* [ ] Collision detection (player vs obstacles).
* [ ] Game over state and restart logic.

### Player Actions

* [ ] Jump (space/arrow up/tap).
* [ ] Duck (arrow down/swipe down).
* [ ] State transitions (running, jumping, ducking, dead).

### Score & Progress

* [ ] Increment score over time.
* [ ] Reset score on restart.
* [ ] Track distance or obstacles cleared.
* [ ] Store and display best score (localStorage).

### Flame Power System

* [ ] Track progress toward flame power (distance or obstacles jumped).
* [ ] Trigger flame-ready state when threshold reached.
* [ ] Shift key burns nearest obstacle (consume flame).
* [ ] Reset flame progress after use.
* [ ] Add cooldown logic (prevent spam).

### Obstacle System

* [ ] Normal obstacles (for jumping).
* [ ] Duck obstacles (low height).
* [ ] Increase obstacle speed and spawn rate over time.
* [ ] Mix obstacle types for difficulty scaling.

### Game States

* [ ] Idle (before start).
* [ ] Running.
* [ ] FlameReady.
* [ ] FlameUsed (short effect).
* [ ] Dead (on collision).
* [ ] Transition handling between states.

### Polish Later (after functional core works)

* [ ] Visual flame effect when burning obstacle.
* [ ] Player glow/indicator when flame power available.
* [ ] Sound effects (jump, collision, flame).
* [ ] Responsive layout (desktop + mobile).
* [ ] Leaderboard (mock JSON).
* [ ] Pause/Resume button.

### **Step 7. Duck Obstacles**

* Add different obstacle type with shorter height.
* Ensure collision only if player not ducking.

---

### **Step 8. Difficulty Scaling**

* Gradually increase obstacle speed as score rises.
* Optionally reduce spawn interval over time.

---

### **Step 9. Game States**

* Refine transitions: idle, running, flameReady, flameUsed, dead.
* Reset all state properly on restart.

---

### **Step 10. UI Controls**

* Confirm pause/resume works (just toggling `isRunning`).
* Restart fully resets game state.

---

After this, move to  **UI/UX polish** : animations, flame effect, responsive design, sound effects, leaderboard.
