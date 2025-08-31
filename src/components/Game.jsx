import { useState, useEffect } from "react";
import useGameLoop from "../hooks/useGameLoop";
import Player from "./Player";
import Obstacle from "./Obstacle";
import Ground from "./Ground";
import Scoreboard from "./Scoreboard";
import DifficultyIndicator from "./DifficultyIndicator";
import FlameIndicator from "./FlameIndicator";
import Controls from "./Controls";
import TouchControls from "./TouchControls";
import GameStateIndicator from "./GameStateIndicator";
import StartScreen from "./StartScreen";
import GameOverScreen from "./GameOverScreen";
import PauseScreen from "./PauseScreen";
import Leaderboard from "./Leaderboard";
import HelpScreen from "./HelpScreen";
import { checkCollision } from "../utils/collision";
import { loadBestScore, saveBestScore } from "../utils/storage";
import { soundManager } from "../utils/sound";
import { animations, injectAnimationStyles } from "../utils/animations";
import {
  GAME,
  OBSTACLE,
  PLAYER,
  FLAME,
  DIFFICULTY,
  GAME_STATES,
} from "../utils/constants";

export default function Game() {
  // Main game state
  const [gameState, setGameState] = useState(GAME_STATES.IDLE);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(loadBestScore());

  // Player state
  const [player, setPlayer] = useState({
    x: 50,
    y: 0,
    velocityY: 0,
    width: PLAYER.WIDTH,
    height: PLAYER.HEIGHT,
    state: "running",
  });

  // Game objects
  const [obstacles, setObstacles] = useState([]);

  // Flame power system
  const [flameReady, setFlameReady] = useState(false);
  const [flameProgress, setFlameProgress] = useState(0);
  const [lastFlameUse, setLastFlameUse] = useState(0);
  const [flameEffectTime, setFlameEffectTime] = useState(0);

  // Timing
  const [gameTime, setGameTime] = useState(0);
  const [lastObstacleSpawn, setLastObstacleSpawn] = useState(0);
  const [scoreAccumulator, setScoreAccumulator] = useState(0);

  // UI state
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Game state helpers
  const isRunning =
    gameState === GAME_STATES.RUNNING ||
    gameState === GAME_STATES.FLAME_READY ||
    gameState === GAME_STATES.FLAME_USED;
  const canTakeInput = isRunning && gameState !== GAME_STATES.DEAD;

  // Initialize animations and sounds
  useEffect(() => {
    injectAnimationStyles();
    soundManager.initializeSounds();
  }, []);

  useEffect(() => {
    soundManager.muted = !soundEnabled;
  }, [soundEnabled]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.code) {
        case "Space":
        case "ArrowUp":
          e.preventDefault();
          if (gameState === GAME_STATES.IDLE) {
            startGame();
          } else if (canTakeInput) {
            jump();
          }
          break;
        case "ArrowDown":
          e.preventDefault();
          if (canTakeInput) {
            duck();
          }
          break;
        case "ShiftLeft":
        case "ShiftRight":
          e.preventDefault();
          if (canTakeInput) {
            useFlame();
          }
          break;
        case "KeyR":
          e.preventDefault();
          if (gameState === GAME_STATES.DEAD) {
            handleRestart();
          }
          break;
        case "KeyL":
          e.preventDefault();
          if (gameState === GAME_STATES.DEAD || gameState === GAME_STATES.IDLE) {
            setShowLeaderboard(true);
          }
          break;
        case "KeyH":
          e.preventDefault();
          if (gameState === GAME_STATES.IDLE || gameState === GAME_STATES.PAUSED) {
            setShowHelp(true);
          }
          break;
        case "KeyM":
          e.preventDefault();
          toggleSound();
          break;
        case "Escape":
          e.preventDefault();
          if (isRunning) {
            pauseGame();
          } else if (gameState === GAME_STATES.PAUSED) {
            resumeGame();
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState, flameReady, gameTime, lastFlameUse]);

  // Game state transitions
  const startGame = () => {
    setGameState(GAME_STATES.RUNNING);
  };

  const pauseGame = () => {
    if (isRunning) {
      setGameState(GAME_STATES.PAUSED);
    }
  };

  const resumeGame = () => {
    if (gameState === GAME_STATES.PAUSED) {
      setGameState(flameReady ? GAME_STATES.FLAME_READY : GAME_STATES.RUNNING);
    }
  };

  const gameOver = () => {
    setGameState(GAME_STATES.DEAD);
    setPlayer((prev) => ({ ...prev, state: "dead" }));

    // Sound and visual effects
    soundManager.play('hit');
    animations.screenShake(500);

    // Update best score
    if (score > bestScore) {
      setBestScore(score);
      saveBestScore(score);
    }
  };

  const toggleSound = () => {
    setSoundEnabled(prev => {
      const newState = !prev;
      soundManager.muted = !newState;
      return newState;
    });
  };

  // Calculate current difficulty modifiers based on score
  const getDifficultyModifiers = (currentScore) => {
    const speedIntervals = Math.floor(
      currentScore / DIFFICULTY.SPEED_INCREASE_INTERVAL
    );
    const speedMultiplier = Math.min(
      1 + speedIntervals * DIFFICULTY.SPEED_INCREASE_RATE,
      DIFFICULTY.MAX_SPEED_MULTIPLIER
    );

    const spawnIntervals = Math.floor(
      currentScore / DIFFICULTY.SPAWN_RATE_INTERVAL
    );
    const spawnRate = Math.min(
      GAME.OBSTACLE_SPAWN_RATE +
        spawnIntervals * DIFFICULTY.SPAWN_RATE_INCREASE,
      DIFFICULTY.MAX_SPAWN_RATE
    );

    const gapIntervals = Math.floor(currentScore / DIFFICULTY.MIN_GAP_INTERVAL);
    const minGap = Math.max(
      GAME.OBSTACLE_MIN_GAP - gapIntervals * DIFFICULTY.MIN_GAP_DECREASE,
      DIFFICULTY.MIN_GAP_FLOOR
    );

    return { speedMultiplier, spawnRate, minGap };
  };

  const jump = () => {
    setPlayer((prev) => {
      if (prev.y <= 0) {
        // Sound effect
        soundManager.play('jump');
        
        // Add flame progress
        setFlameProgress((prevProgress) => {
          const newProgress = prevProgress + 10;
          return Math.min(newProgress, FLAME.CHARGE_THRESHOLD);
        });

        return {
          ...prev,
          velocityY: PLAYER.JUMP_VELOCITY,
          state: "jumping",
        };
      }
      return prev;
    });
  };

  const duck = () => {
    setPlayer((prev) => {
      if (prev.y <= 0) {
        // Add flame progress
        setFlameProgress((prevProgress) => {
          const newProgress = prevProgress + 5;
          return Math.min(newProgress, FLAME.CHARGE_THRESHOLD);
        });
      }

      return {
        ...prev,
        state: prev.y <= 0 ? "ducking" : prev.state,
        height: prev.y <= 0 ? PLAYER.DUCK_HEIGHT : prev.height,
      };
    });
  };

  const useFlame = () => {
    const timeSinceLastUse = gameTime - lastFlameUse;
    if (!flameReady || timeSinceLastUse < FLAME.COOLDOWN_TIME) {
      return;
    }

    // Transition to flame used state
    setGameState(GAME_STATES.FLAME_USED);
    setFlameEffectTime(gameTime);

    // Sound and visual effects
    soundManager.play('flame');
    
    const targetObstacle = obstacles.find(
      (obs) => obs.x > player.x && obs.x < player.x + FLAME.BURN_RANGE
    );

    if (targetObstacle) {
      // Visual effects at obstacle location
      animations.createParticle(
        targetObstacle.x + targetObstacle.width / 2,
        window.innerHeight - 100,
        '#ff6b35',
        'flame'
      );
      
      // Show score popup
      animations.showScorePopup(
        targetObstacle.x + targetObstacle.width / 2,
        window.innerHeight - 120,
        10
      );
      
      setObstacles((prev) =>
        prev.filter((obs) => obs.id !== targetObstacle.id)
      );
      setScore((prevScore) => prevScore + 10);
    }

    // Reset flame power
    setFlameReady(false);
    setFlameProgress(0);
    setLastFlameUse(gameTime);
  };

  const spawnObstacle = () => {
    const obstacleType = Math.random() > 0.7 ? "duck" : "jump";

    const newObstacle = {
      id: Date.now() + Math.random(),
      x: OBSTACLE.SPAWN_X,
      y: 0,
      width: OBSTACLE.WIDTH,
      height: obstacleType === "duck" ? OBSTACLE.DUCK_HEIGHT : OBSTACLE.HEIGHT,
      type: obstacleType,
    };

    setObstacles((prev) => [...prev, newObstacle]);
    setLastObstacleSpawn(gameTime);
  };

  // Main game loop
  useGameLoop(isRunning, (delta) => {
    const deltaInSeconds = delta / 1000;
    setGameTime((prevTime) => prevTime + delta);

    // Get current difficulty modifiers
    const { speedMultiplier, spawnRate, minGap } =
      getDifficultyModifiers(score);

    // Update score
    setScoreAccumulator((prev) => {
      const newAccumulator = prev + deltaInSeconds;
      if (newAccumulator >= 0.1) {
        setScore((prevScore) => {
          const newScore = prevScore + 1;
          setFlameProgress((prevProgress) => {
            const newProgress = prevProgress + 1;
            return Math.min(newProgress, FLAME.CHARGE_THRESHOLD);
          });
          return newScore;
        });
        return newAccumulator - 0.1;
      }
      return newAccumulator;
    });

    // Check flame state transitions
    if (
      flameProgress >= FLAME.CHARGE_THRESHOLD &&
      !flameReady &&
      gameState === GAME_STATES.RUNNING
    ) {
      setFlameReady(true);
      setGameState(GAME_STATES.FLAME_READY);
    }

    // Check flame effect duration
    if (
      gameState === GAME_STATES.FLAME_USED &&
      gameTime - flameEffectTime > FLAME.EFFECT_DURATION
    ) {
      setGameState(flameReady ? GAME_STATES.FLAME_READY : GAME_STATES.RUNNING);
    }

    // Player physics
    setPlayer((prev) => {
      let newY = prev.y;
      let newVelocityY = prev.velocityY;
      let newState = prev.state;
      let newHeight = prev.height;

      // Apply gravity
      newVelocityY += PLAYER.GRAVITY * deltaInSeconds * 60;
      if (newVelocityY > PLAYER.MAX_FALL_SPEED) {
        newVelocityY = PLAYER.MAX_FALL_SPEED;
      }

      newY += newVelocityY * deltaInSeconds * 60;

      // Ground collision
      if (newY <= 0) {
        newY = 0;
        newVelocityY = 0;

        if (prev.state === "jumping") {
          newState = "running";
        }
        if (prev.state === "ducking") {
          newHeight = PLAYER.HEIGHT;
          newState = "running";
        }
      }

      return {
        ...prev,
        y: newY,
        velocityY: newVelocityY,
        state: newState,
        height: newHeight,
      };
    });

    // Update obstacles
    setObstacles((prev) =>
      prev
        .map((obs) => ({
          ...obs,
          x: obs.x - OBSTACLE.SPEED * speedMultiplier * deltaInSeconds * 60,
        }))
        .filter((obs) => obs.x + obs.width > 0)
    );

    // Spawn obstacles
    const timeSinceLastSpawn = gameTime - lastObstacleSpawn;
    const shouldSpawn =
      Math.random() < spawnRate && timeSinceLastSpawn > minGap;
    if (shouldSpawn) {
      spawnObstacle();
    }

    // Collision detection
    for (const obstacle of obstacles) {
      if (checkCollision(player, obstacle)) {
        gameOver();
        break;
      }
    }
  });

  const handleRestart = () => {
    // Reset all state to initial values
    setGameState(GAME_STATES.IDLE);
    setScore(0);
    setScoreAccumulator(0);
    setObstacles([]);
    setFlameReady(false);
    setFlameProgress(0);
    setLastFlameUse(0);
    setFlameEffectTime(0);
    setGameTime(0);
    setLastObstacleSpawn(0);
    setShowLeaderboard(false); // Close leaderboard on restart
    setPlayer({
      x: 50,
      y: 0,
      velocityY: 0,
      width: PLAYER.WIDTH,
      height: PLAYER.HEIGHT,
      state: "running",
    });
  };

  return (
    <div className="game-container relative w-full h-screen bg-gradient-to-b from-sky-400 to-sky-200 overflow-hidden">
      {/* Game State Indicator */}
      <GameStateIndicator gameState={gameState} />

      <Scoreboard score={score} best={bestScore} />
      {isRunning && (
        <DifficultyIndicator
          score={score}
          modifiers={getDifficultyModifiers(score)}
        />
      )}
      <FlameIndicator
        progress={flameProgress}
        ready={flameReady}
        isUsing={gameState === GAME_STATES.FLAME_USED}
      />
      
      {/* Sound Toggle Button */}
      <button
        onClick={toggleSound}
        className="absolute top-4 right-16 bg-white bg-opacity-80 p-2 rounded-lg shadow-lg hover:bg-opacity-100 transition-all"
        title={soundEnabled ? "Mute (M)" : "Unmute (M)"}
      >
        {soundEnabled ? "🔊" : "🔇"}
      </button>
      
      <Player data={player} flameReady={flameReady} gameState={gameState} />
      {obstacles.map((obs) => (
        <Obstacle key={obs.id} data={obs} />
      ))}
      <Ground />
      
      {/* Touch Controls for Mobile */}
      <TouchControls
        gameState={gameState}
        onJump={jump}
        onDuck={duck}
        onFlame={useFlame}
        flameReady={flameReady}
      />
      
      <Controls
        gameState={gameState}
        onStart={startGame}
        onPause={pauseGame}
        onResume={resumeGame}
        onRestart={handleRestart}
        onShowLeaderboard={() => setShowLeaderboard(true)}
        soundEnabled={soundEnabled}
      />

      {/* Overlays */}
      {gameState === GAME_STATES.IDLE && <StartScreen />}
      {gameState === GAME_STATES.PAUSED && <PauseScreen />}
      {gameState === GAME_STATES.DEAD && (
        <GameOverScreen score={score} bestScore={bestScore} />
      )}
      
      {/* Leaderboard */}
      <Leaderboard
        currentScore={score}
        isVisible={showLeaderboard}
        onClose={() => setShowLeaderboard(false)}
      />
      
      {/* Help Screen */}
      <HelpScreen
        isVisible={showHelp}
        onClose={() => setShowHelp(false)}
      />
    </div>
  );
}