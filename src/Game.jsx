import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useAnimation } from "framer-motion";

// Game constants
const GAME_WIDTH = 800;
const GAME_HEIGHT = 400;
const GROUND_HEIGHT = 20;
const PLAYER_SIZE = 40;
const PLAYER_X = 80;
const JUMP_HEIGHT = 120;
const OBSTACLE_SPEED = 200; // pixels per second
const OBSTACLE_SPAWN_RATE = 2000; // milliseconds

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

export default function Game() {
  const gameRef = useRef(null);
  const animationRef = useRef();
  const lastTimeRef = useRef(0);
  const nextObstacleRef = useRef(0);

  // Game state
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(() => {
    const stored = localStorage.getItem("lsoys-best-score");
    return stored ? parseInt(stored, 10) : 0;
  });
  const [obstacles, setObstacles] = useState([]);
  const [gameOver, setGameOver] = useState(false);

  // Player state
  const [isJumping, setIsJumping] = useState(false);
  const [isDucking, setIsDucking] = useState(false);
  const [playerY, setPlayerY] = useState(0); // Track actual Y position for collision
  const playerControls = useAnimation();

  // Leaderboard
  const [leaderboard, setLeaderboard] = useState([]);

  // Load leaderboard
  useEffect(() => {
    fetch("/leaderboard.json")
      .then((res) => res.json())
      .then((data) => setLeaderboard(data))
      .catch(() =>
        setLeaderboard([
          { name: "Alice", score: 128 },
          { name: "Bob", score: 104 },
          { name: "Charlie", score: 87 },
        ])
      );
  }, []);

  // Start game
  const startGame = useCallback(() => {
    setIsPlaying(true);
    setGameOver(false);
    setScore(0);
    setObstacles([]);
    setIsPaused(false);
    setPlayerY(0); // Reset player position
    lastTimeRef.current = 0;
    nextObstacleRef.current = OBSTACLE_SPAWN_RATE;
  }, []);

  // Game over
  const endGame = useCallback(() => {
    setIsPlaying(false);
    setGameOver(true);
    if (score > bestScore) {
      setBestScore(score);
      localStorage.setItem("lsoys-best-score", score.toString());
    }
  }, [score, bestScore]);

  // Jump function
  const jump = useCallback(() => {
    if (!isPlaying || isPaused || isJumping || isDucking) return;

    setIsJumping(true);
    playerControls.start({
      y: -JUMP_HEIGHT,
      transition: {
        duration: 0.3,
        ease: "easeOut",
        onUpdate: (y) => setPlayerY(y), // Track Y position for collision
        onComplete: () => {
          playerControls.start({
            y: 0,
            transition: {
              duration: 0.3,
              ease: "easeIn",
              onUpdate: (y) => setPlayerY(y), // Track Y position for collision
              onComplete: () => {
                setIsJumping(false);
                setPlayerY(0);
              },
            },
          });
        },
      },
    });
  }, [isPlaying, isPaused, isJumping, isDucking, playerControls]);

  // Duck function
  const duck = useCallback(() => {
    if (!isPlaying || isPaused || isJumping) return;

    setIsDucking(true);
    setTimeout(() => setIsDucking(false), 400);
  }, [isPlaying, isPaused, isJumping]);

  // Pause/Resume
  const togglePause = useCallback(() => {
    if (!isPlaying) return;
    setIsPaused((prev) => !prev);
  }, [isPlaying]);

  // Input handlers
  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.code) {
        case "Space":
        case "ArrowUp":
          e.preventDefault();
          if (!isPlaying) {
            startGame();
          } else {
            jump();
          }
          break;
        case "ArrowDown":
          e.preventDefault();
          duck();
          break;
        case "KeyP":
          e.preventDefault();
          togglePause();
          break;
        case "KeyR":
          e.preventDefault();
          startGame();
          break;
      }
    };

    // Touch controls
    const handleTouchStart = (e) => {
      e.preventDefault();
      if (!isPlaying) {
        startGame();
      } else {
        jump();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("touchstart", handleTouchStart, { passive: false });

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("touchstart", handleTouchStart);
    };
  }, [startGame, jump, duck, togglePause, isPlaying]);

  // Game loop
  useEffect(() => {
    if (!isPlaying || isPaused) return;

    const gameLoop = (currentTime) => {
      const deltaTime = currentTime - lastTimeRef.current;
      lastTimeRef.current = currentTime;

      // Update score
      setScore((prev) => prev + deltaTime * 0.01); // 1 point per 100ms

      // Spawn obstacles
      nextObstacleRef.current -= deltaTime;
      if (nextObstacleRef.current <= 0) {
        const newObstacle = {
          id: Date.now(),
          x: GAME_WIDTH + 50,
          y: GAME_HEIGHT - GROUND_HEIGHT,
          width: randomBetween(20, 40),
          height: randomBetween(40, 80),
        };
        setObstacles((prev) => [...prev, newObstacle]);
        nextObstacleRef.current = randomBetween(1500, 3000); // Random spawn rate
      }

      // Update obstacles
      setObstacles((prev) =>
        prev
          .map((obstacle) => ({
            ...obstacle,
            x: obstacle.x - OBSTACLE_SPEED * (deltaTime / 1000),
          }))
          .filter((obstacle) => obstacle.x + obstacle.width > 0)
      );

      // Collision detection
      const playerRect = {
        x: PLAYER_X,
        y:
          GAME_HEIGHT -
          GROUND_HEIGHT -
          (isDucking ? PLAYER_SIZE / 2 : PLAYER_SIZE) +
          playerY, // Use actual Y position
        width: PLAYER_SIZE,
        height: isDucking ? PLAYER_SIZE / 2 : PLAYER_SIZE,
      };

      const collision = obstacles.some((obstacle) => {
        return (
          playerRect.x < obstacle.x + obstacle.width &&
          playerRect.x + playerRect.width > obstacle.x &&
          playerRect.y < obstacle.y &&
          playerRect.y + playerRect.height > obstacle.y - obstacle.height
        );
      });

      if (collision) {
        endGame();
        return;
      }

      animationRef.current = requestAnimationFrame(gameLoop);
    };

    animationRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, isPaused, obstacles, isDucking, playerY, endGame]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-700 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-6xl mx-auto">
        {/* Game Container */}
        <div className="relative mb-6">
          <div
            ref={gameRef}
            className="relative mx-auto bg-gradient-to-b from-sky-200 to-green-200 rounded-lg overflow-hidden shadow-2xl border-4 border-white/20"
            style={{
              width: `min(${GAME_WIDTH}px, 100vw - 2rem)`,
              height: `min(${GAME_HEIGHT}px, 60vh)`,
              aspectRatio: `${GAME_WIDTH} / ${GAME_HEIGHT}`,
            }}
          >
            {/* Score Display */}
            <div className="absolute top-4 left-4 z-10">
              <div className="bg-black/70 text-white px-3 py-2 rounded-lg font-mono text-sm">
                <div>Score: {Math.floor(score)}</div>
                <div className="text-yellow-400">Best: {bestScore}</div>
              </div>
            </div>

            {/* Controls */}
            <div className="absolute top-4 right-4 z-10 flex gap-2">
              {isPlaying && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={togglePause}
                  className="bg-black/70 text-white px-3 py-2 rounded-lg text-sm font-medium"
                >
                  {isPaused ? "Resume" : "Pause"}
                </motion.button>
              )}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startGame}
                className="bg-black/70 text-white px-3 py-2 rounded-lg text-sm font-medium"
              >
                Restart
              </motion.button>
            </div>

            {/* Ground */}
            <div
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-green-600 to-green-400"
              style={{ height: GROUND_HEIGHT }}
            />

            {/* Player */}
            <motion.div
              animate={playerControls}
              className="absolute bottom-0 rounded-lg"
              style={{
                left: PLAYER_X,
                bottom: GROUND_HEIGHT,
                width: PLAYER_SIZE,
                height: isDucking ? PLAYER_SIZE / 2 : PLAYER_SIZE,
                background: "linear-gradient(45deg, #3b82f6, #1d4ed8)",
                boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
              }}
            />

            {/* Obstacles */}
            {obstacles.map((obstacle) => (
              <div
                key={obstacle.id}
                className="absolute rounded-lg"
                style={{
                  left: obstacle.x,
                  bottom: GROUND_HEIGHT,
                  width: obstacle.width,
                  height: obstacle.height,
                  background: "linear-gradient(45deg, #ef4444, #dc2626)",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
                }}
              />
            ))}

            {/* Game States */}
            {!isPlaying && !gameOver && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="text-center text-white">
                  <h2 className="text-3xl font-bold mb-4">LSOYS Game</h2>
                  <p className="text-lg mb-6">Press SPACE or tap to start!</p>
                  <div className="text-sm opacity-75">
                    <p>SPACE/UP = Jump | DOWN = Duck | P = Pause</p>
                  </div>
                </div>
              </div>
            )}

            {isPaused && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="text-center text-white">
                  <h2 className="text-3xl font-bold mb-4">PAUSED</h2>
                  <p className="text-lg">Press P to resume</p>
                </div>
              </div>
            )}

            {gameOver && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="text-center text-white">
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-black/70 p-6 rounded-lg"
                  >
                    <h2 className="text-3xl font-bold mb-2 text-red-400">
                      Game Over!
                    </h2>
                    <p className="text-xl mb-4">
                      Final Score: {Math.floor(score)}
                    </p>
                    {score === bestScore && score > 0 && (
                      <p className="text-yellow-400 mb-4">🎉 New Best Score!</p>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={startGame}
                      className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-bold"
                    >
                      Play Again
                    </motion.button>
                  </motion.div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Leaderboard */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 max-w-md mx-auto">
          <h3 className="text-xl font-bold text-white mb-4 text-center">
            🏆 Leaderboard
          </h3>
          <div className="space-y-2">
            {leaderboard.map((entry, index) => (
              <div
                key={index}
                className="flex justify-between items-center bg-white/10 rounded-lg p-3"
              >
                <span className="text-white font-medium">
                  <span className="text-yellow-400 mr-2">#{index + 1}</span>
                  {entry.name}
                </span>
                <span className="text-white font-mono font-bold">
                  {entry.score}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Instructions */}
        <div className="mt-6 text-center text-white/70 text-sm md:hidden">
          <p>Tap to jump • Swipe down to duck</p>
        </div>
      </div>
    </div>
  );
}
