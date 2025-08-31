import { useState, useEffect, useRef } from "react";
import Player from "./Player";
import Obstacle from "./Obstacle";
import Ground from "./Ground";
import Scoreboard from "./Scoreboard";
import DifficultyIndicator from "./DifficultyIndicator";
import ControllerInstructions from "./ControllerInstructions";
import Leaderboard from "./Leaderboard";
import PauseScreen from "./PauseScreen";
import GameOverScreen from "./GameOverScreen";
import TouchControls from "./TouchControls";
import { checkCollision } from "../utils/collision";
import { soundManager } from "../utils/sound";
import { loadBestScore, saveBestScore } from "../utils/storage";
import {
  GAME,
  OBSTACLE,
  PLAYER,
  DIFFICULTY,
  GAME_STATES,
  SCORE,
} from "../utils/constants";

// FEATURE: Enhanced Game Component with score, pause, sound, and mobile support
export default function Game() {
  // Main game state
  const [gameState, setGameState] = useState(GAME_STATES.IDLE);
  const [obstacles, setObstacles] = useState([]);
  const [gameTime, setGameTime] = useState(0);
  const [lastObstacleSpawn, setLastObstacleSpawn] = useState(0);

  // FEATURE: Score and best score tracking
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [isNewBest, setIsNewBest] = useState(false);

  // FEATURE: UI state management
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // FIX: jump/duck - Player physics state with proper variables
  const [player, setPlayer] = useState({
    x: 50,
    y: PLAYER.GROUND_Y, // Start exactly at ground level
    vy: 0, // Velocity in px/ms
    width: PLAYER.WIDTH,
    height: PLAYER.HEIGHT,
    onGround: true,
    isJumping: false,
    isDucking: false,
    state: "running",
  });

  // FIX: jump/duck - Input state tracking
  const [controls, setControls] = useState({
    jumpDown: false,
    duckDown: false,
  });

  const animationRef = useRef();
  const lastTimeRef = useRef(performance.now());

  const isRunning = gameState === GAME_STATES.RUNNING;

  // FEATURE: Load best score on component mount
  useEffect(() => {
    const savedBest = loadBestScore();
    setBestScore(savedBest);
  }, []);

  // FIX: jump/duck - Proper input handling with keydown/keyup events
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Handle game state changes
      if (e.code === "Space" || e.code === "ArrowUp" || e.code === "KeyW") {
        e.preventDefault();
        if (gameState === GAME_STATES.IDLE) {
          startGame();
          return;
        }
        if (gameState === GAME_STATES.RUNNING && !controls.jumpDown) {
          // FEATURE: Play jump sound
          soundManager.playJump();
        }
        setControls((prev) => ({ ...prev, jumpDown: true }));
      }

      if (e.code === "ArrowDown" || e.code === "KeyS") {
        e.preventDefault();
        setControls((prev) => ({ ...prev, duckDown: true }));
      }

      // FEATURE: Pause/resume with ESC key
      if (e.code === "Escape") {
        e.preventDefault();
        if (gameState === GAME_STATES.RUNNING) {
          pauseGame();
        } else if (gameState === GAME_STATES.PAUSED) {
          resumeGame();
        }
      }

      // FEATURE: Toggle sound with M key
      if (e.code === "KeyM") {
        e.preventDefault();
        setSoundEnabled(soundManager.toggle());
      }

      // FEATURE: Show leaderboard with L key
      if (e.code === "KeyL") {
        e.preventDefault();
        if (gameState === GAME_STATES.IDLE || gameState === GAME_STATES.DEAD) {
          setShowLeaderboard(true);
        }
      }

      if (e.code === "KeyR" && gameState === GAME_STATES.DEAD) {
        handleRestart();
      }
    };

    const handleKeyUp = (e) => {
      if (e.code === "Space" || e.code === "ArrowUp" || e.code === "KeyW") {
        e.preventDefault();
        setControls((prev) => ({ ...prev, jumpDown: false }));
      }

      if (e.code === "ArrowDown" || e.code === "KeyS") {
        e.preventDefault();
        setControls((prev) => ({ ...prev, duckDown: false }));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [gameState]);

  const startGame = () => {
    setGameState(GAME_STATES.RUNNING);
    setScore(0);
    setIsNewBest(false);
    lastTimeRef.current = performance.now();
  };

  // FIX: Pause functionality with sound
  const pauseGame = () => {
    setGameState(GAME_STATES.PAUSED);
    soundManager.playPause(); // FIX: Pause sound
  };

  // FIX: Resume functionality with sound
  const resumeGame = () => {
    setGameState(GAME_STATES.RUNNING);
    lastTimeRef.current = performance.now(); // Reset timer to prevent time jumps
    soundManager.playResume(); // FIX: Resume sound
  };

  const gameOver = () => {
    setGameState(GAME_STATES.DEAD);
    setPlayer((prev) => ({ ...prev, state: "dead" }));

    // FIX: Play collision and lose music sounds
    soundManager.playCollision();
    soundManager.playLoseMusic();

    // FEATURE: Check and save best score
    if (score > bestScore) {
      setBestScore(score);
      setIsNewBest(true);
      saveBestScore(score);
    }
  };

  const getDifficultyModifiers = (currentTime) => {
    const speedIntervals = Math.floor(
      currentTime / DIFFICULTY.SPEED_INCREASE_INTERVAL
    );
    const speedMultiplier = Math.min(
      1 + speedIntervals * DIFFICULTY.SPEED_INCREASE_RATE,
      DIFFICULTY.MAX_SPEED_MULTIPLIER
    );

    const spawnIntervals = Math.floor(
      currentTime / DIFFICULTY.SPAWN_RATE_INTERVAL
    );
    const spawnRate = Math.min(
      GAME.OBSTACLE_SPAWN_RATE +
        spawnIntervals * DIFFICULTY.SPAWN_RATE_INCREASE,
      DIFFICULTY.MAX_SPAWN_RATE
    );

    return { speedMultiplier, spawnRate };
  };

  const spawnObstacle = () => {
    const obstacleType = Math.random() > 0.7 ? "duck" : "jump";

    const newObstacle = {
      id: Date.now() + Math.random(),
      x: OBSTACLE.SPAWN_X,
      y: obstacleType === "duck" ? OBSTACLE.FLY_Y : PLAYER.GROUND_Y, // FIX: jump/duck - use FLY_Y for flying obstacles
      width: OBSTACLE.WIDTH,
      height: obstacleType === "duck" ? OBSTACLE.DUCK_HEIGHT : OBSTACLE.HEIGHT,
      type: obstacleType,
    };

    setObstacles((prev) => [...prev, newObstacle]);
    setLastObstacleSpawn(gameTime);
  };

  // FIX: jump/duck - Delta-time game loop with proper physics
  useEffect(() => {
    if (!isRunning) return;

    const gameLoop = () => {
      const currentTime = performance.now();
      const dt = currentTime - lastTimeRef.current; // Delta time in ms
      lastTimeRef.current = currentTime;

      setGameTime((prevTime) => prevTime + dt);

      // FEATURE: Update score based on time survived
      setScore((prevScore) => prevScore + dt * SCORE.TIME_MULTIPLIER);

      // Get difficulty modifiers
      const { speedMultiplier, spawnRate } = getDifficultyModifiers(gameTime);

      // FIX: jump/duck - Player physics with proper delta-time integration
      setPlayer((prev) => {
        let newY = prev.y;
        let newVy = prev.vy;
        let newOnGround = prev.onGround;
        let newIsJumping = prev.isJumping;
        let newIsDucking = prev.isDucking;
        let newHeight = prev.height;
        let newState = prev.state;

        // Handle jump input - only if on ground and not ducking
        if (controls.jumpDown && newOnGround && !newIsDucking) {
          newVy = -PLAYER.JUMP_VELOCITY; // Negative = upward
          newOnGround = false;
          newIsJumping = true;
          newState = "jumping";
        }

        // Handle duck input - only when on ground
        if (controls.duckDown && newOnGround) {
          newIsDucking = true;
          newHeight = PLAYER.HEIGHT * PLAYER.DUCK_HEIGHT_RATIO;
          newState = "ducking";
        } else if (!controls.duckDown && newIsDucking) {
          newIsDucking = false;
          newHeight = PLAYER.HEIGHT;
          if (newOnGround) newState = "running";
        }

        // Apply gravity only when not on ground
        if (!newOnGround) {
          newVy += PLAYER.GRAVITY * dt;
          // Clamp velocity to terminal velocity
          newVy = Math.min(newVy, PLAYER.TERMINAL_VELOCITY);
        }

        // Apply velocity to position
        newY += newVy * dt;

        // Jump height cap - stop upward velocity if too high
        if (PLAYER.GROUND_Y - newY > PLAYER.MAX_JUMP_HEIGHT && newVy < 0) {
          newVy = 0;
        }

        // Ground collision - clamp to ground level
        if (newY >= PLAYER.GROUND_Y) {
          newY = PLAYER.GROUND_Y;
          newVy = 0;
          newOnGround = true;
          newIsJumping = false;
          if (!newIsDucking) {
            newState = "running";
          }
        }

        return {
          ...prev,
          y: newY,
          vy: newVy,
          onGround: newOnGround,
          isJumping: newIsJumping,
          isDucking: newIsDucking,
          height: newHeight,
          state: newState,
        };
      });

      // Update obstacles
      setObstacles((prev) =>
        prev
          .map((obs) => ({
            ...obs,
            x: obs.x - (OBSTACLE.SPEED * speedMultiplier * dt) / 16.67, // Normalize for 60fps equivalent
          }))
          .filter((obs) => obs.x + obs.width > 0)
      );

      // FIX: Spawn obstacles with random variance for better spacing
      const timeSinceLastSpawn = gameTime - lastObstacleSpawn;
      const lastObstacle = obstacles[obstacles.length - 1];

      // FIX: Add random variance to minimum gap
      const randomGap =
        GAME.OBSTACLE_MIN_GAP + Math.random() * GAME.OBSTACLE_GAP_VARIANCE;
      const hasMinimumGap =
        !lastObstacle || lastObstacle.x <= OBSTACLE.SPAWN_X - randomGap;

      if (
        Math.random() < spawnRate &&
        timeSinceLastSpawn > randomGap &&
        hasMinimumGap
      ) {
        spawnObstacle();
      }

      // Collision detection using current hitbox
      for (const obstacle of obstacles) {
        if (checkCollision(player, obstacle)) {
          gameOver();
          return;
        }
      }

      animationRef.current = requestAnimationFrame(gameLoop);
    };

    animationRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRunning, controls, gameTime, obstacles, player]);

  const handleRestart = () => {
    // FIX: Restart sound
    soundManager.playRestart();

    setGameState(GAME_STATES.IDLE);
    setObstacles([]);
    setGameTime(0);
    setLastObstacleSpawn(0);
    setScore(0);
    setIsNewBest(false);
    setControls({ jumpDown: false, duckDown: false });
    setPlayer({
      x: 50,
      y: PLAYER.GROUND_Y,
      vy: 0,
      width: PLAYER.WIDTH,
      height: PLAYER.HEIGHT,
      onGround: true,
      isJumping: false,
      isDucking: false,
      state: "running",
    });
    lastTimeRef.current = performance.now();
  };

  // FIX: Mobile touch control handlers with sounds
  const handleJump = () => {
    if (gameState === GAME_STATES.IDLE) {
      startGame();
      return;
    }
    if (gameState === GAME_STATES.RUNNING && !controls.jumpDown) {
      soundManager.playJump(); // FIX: Jump sound
    }
    setControls((prev) => ({ ...prev, jumpDown: true }));
  };

  const handleDuck = () => {
    // FIX: Duck sound when starting to duck
    if (gameState === GAME_STATES.RUNNING && !controls.duckDown) {
      soundManager.playDuck();
    }
    setControls((prev) => ({ ...prev, duckDown: true }));
  };

  const handleJumpRelease = () => {
    setControls((prev) => ({ ...prev, jumpDown: false }));
  };

  const handleDuckRelease = () => {
    setControls((prev) => ({ ...prev, duckDown: false }));
  };

  return (
    <div className="game-container relative w-full min-h-screen bg-gradient-to-b from-sky-400 to-sky-200 overflow-hidden">
      {/* FIX: Top bar layout - left: scoreboard, center: instructions, right: difficulty */}
      <div className="absolute top-4 left-0 right-0 z-20">
        <div className="flex justify-between items-start px-4 gap-4">
          {/* FIX: Scoreboard fixed on left */}
          <div className="flex-shrink-0">
            <Scoreboard
              score={score}
              bestScore={bestScore}
              isNewBest={isNewBest}
            />
          </div>

          {/* FIX: Controller instructions centered (hidden on small screens) */}
          <div className="flex-1 flex justify-center">
            <ControllerInstructions soundEnabled={soundEnabled} />
          </div>

          {/* FIX: Difficulty board fixed on right */}
          <div className="flex-shrink-0">
            {isRunning && (
              <DifficultyIndicator
                gameTime={gameTime}
                speedMultiplier={
                  getDifficultyModifiers(gameTime).speedMultiplier
                }
                spawnRate={getDifficultyModifiers(gameTime).spawnRate}
              />
            )}
          </div>
        </div>
      </div>

      {/* Game objects */}
      <Player data={player} />
      {obstacles.map((obs) => (
        <Obstacle key={obs.id} data={obs} />
      ))}
      <Ground />

      {/* FEATURE: Touch controls for mobile */}
      <TouchControls
        gameState={gameState}
        onJump={handleJump}
        onDuck={handleDuck}
        onJumpRelease={handleJumpRelease}
        onDuckRelease={handleDuckRelease}
      />

      {/* FEATURE: Pause screen */}
      {gameState === GAME_STATES.PAUSED && (
        <PauseScreen onResume={resumeGame} />
      )}

      {/* FEATURE: Game over screen */}
      {gameState === GAME_STATES.DEAD && (
        <GameOverScreen
          score={score}
          bestScore={bestScore}
          isNewBest={isNewBest}
          onRestart={handleRestart}
          onViewLeaderboard={() => setShowLeaderboard(true)}
        />
      )}

      {/* FEATURE: Leaderboard modal */}
      {showLeaderboard && (
        <Leaderboard
          currentScore={score}
          onClose={() => setShowLeaderboard(false)}
        />
      )}

      {/* FIX: Game action buttons moved below top bar */}
      <div className="absolute top-20 left-4 z-20">
        <div className="bg-black bg-opacity-40 backdrop-blur-md p-2 rounded-lg shadow-lg">
          <div className="flex gap-2">
            {gameState === GAME_STATES.IDLE && (
              <button
                onClick={startGame}
                className="px-3 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600 transition-colors"
              >
                Start
              </button>
            )}
            {gameState === GAME_STATES.RUNNING && (
              <button
                onClick={pauseGame}
                className="px-3 py-1 bg-yellow-500 text-white rounded text-xs hover:bg-yellow-600 transition-colors"
              >
                Pause
              </button>
            )}
            {gameState === GAME_STATES.PAUSED && (
              <button
                onClick={resumeGame}
                className="px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 transition-colors"
              >
                Resume
              </button>
            )}
            {gameState === GAME_STATES.DEAD && (
              <button
                onClick={handleRestart}
                className="px-3 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 transition-colors"
              >
                Restart
              </button>
            )}
          </div>
        </div>
      </div>

      {/* FIX: Game status text positioned to avoid UI overlap */}
      <div className="absolute top-16 sm:top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
        {gameState === GAME_STATES.IDLE && (
          <div className="bg-black bg-opacity-60 backdrop-blur-md p-4 sm:p-6 rounded-lg shadow-xl text-center max-w-xs sm:max-w-sm mx-4">
            <h1 className="text-xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">
              🎮 LSOYS Game
            </h1>
            <div className="text-sm sm:text-lg text-gray-300 mb-3 sm:mb-4">
              Endless Runner
            </div>
            <div className="text-green-300 font-bold animate-pulse">
              <div className="hidden sm:block">Press SPACE to Start</div>
              <div className="sm:hidden">Tap to Start</div>
            </div>
          </div>
        )}
        {gameState === GAME_STATES.PAUSED && (
          <div className="bg-black bg-opacity-60 text-white px-3 sm:px-4 py-2 rounded-lg text-lg sm:text-xl font-bold backdrop-blur-md">
            ⏸️ PAUSED
          </div>
        )}
        {gameState === GAME_STATES.RUNNING && (
          <div className="bg-green-500 bg-opacity-60 text-white px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-bold backdrop-blur-md">
            🏃 RUNNING
          </div>
        )}
        {gameState === GAME_STATES.DEAD && (
          <div className="bg-red-500 bg-opacity-60 text-white px-3 sm:px-4 py-2 rounded-lg text-lg sm:text-xl font-bold backdrop-blur-md">
            💀 GAME OVER
          </div>
        )}
      </div>

      {/* Game entities - only render when game is active */}
      {gameState !== GAME_STATES.IDLE && (
        <>
          <Ground />
          <Player data={player} />
          {obstacles.map((obstacle) => (
            <Obstacle key={obstacle.id} data={obstacle} />
          ))}
        </>
      )}

      {/* Touch Controls for mobile */}
      <TouchControls
        onJump={handleJump}
        onDuck={handleDuck}
        onJumpRelease={handleJumpRelease}
        onDuckRelease={handleDuckRelease}
        gameState={gameState}
      />

      {/* Pause Screen */}
      {gameState === GAME_STATES.PAUSED && (
        <PauseScreen onResume={resumeGame} />
      )}

      {/* Game Over Screen */}
      {gameState === GAME_STATES.DEAD && (
        <GameOverScreen
          score={score}
          bestScore={bestScore}
          isNewBest={isNewBest}
          onRestart={handleRestart}
          onViewLeaderboard={() => setShowLeaderboard(true)}
        />
      )}

      {/* Leaderboard modal */}
      {showLeaderboard && (
        <Leaderboard
          currentScore={score}
          onClose={() => setShowLeaderboard(false)}
        />
      )}
    </div>
  );
}
