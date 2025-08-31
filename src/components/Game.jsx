import { useState, useEffect, useRef } from "react";
import Player from "./Player";
import Obstacle from "./Obstacle";
import Ground from "./Ground";
import { checkCollision } from "../utils/collision";
import {
  GAME,
  OBSTACLE,
  PLAYER,
  DIFFICULTY,
  GAME_STATES,
} from "../utils/constants";

// Simplified Game Component - FIX: jump/duck with proper input and physics
export default function Game() {
  // Main game state
  const [gameState, setGameState] = useState(GAME_STATES.IDLE);
  const [obstacles, setObstacles] = useState([]);
  const [gameTime, setGameTime] = useState(0);
  const [lastObstacleSpawn, setLastObstacleSpawn] = useState(0);

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
        setControls(prev => ({ ...prev, jumpDown: true }));
      }
      
      if (e.code === "ArrowDown" || e.code === "KeyS") {
        e.preventDefault();
        setControls(prev => ({ ...prev, duckDown: true }));
      }

      if (e.code === "KeyR" && gameState === GAME_STATES.DEAD) {
        handleRestart();
      }
    };

    const handleKeyUp = (e) => {
      if (e.code === "Space" || e.code === "ArrowUp" || e.code === "KeyW") {
        e.preventDefault();
        setControls(prev => ({ ...prev, jumpDown: false }));
      }
      
      if (e.code === "ArrowDown" || e.code === "KeyS") {
        e.preventDefault();
        setControls(prev => ({ ...prev, duckDown: false }));
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
  };

  const gameOver = () => {
    setGameState(GAME_STATES.DEAD);
    setPlayer(prev => ({ ...prev, state: "dead" }));
  };

  const getDifficultyModifiers = (currentTime) => {
    const speedIntervals = Math.floor(currentTime / DIFFICULTY.SPEED_INCREASE_INTERVAL);
    const speedMultiplier = Math.min(
      1 + speedIntervals * DIFFICULTY.SPEED_INCREASE_RATE,
      DIFFICULTY.MAX_SPEED_MULTIPLIER
    );

    const spawnIntervals = Math.floor(currentTime / DIFFICULTY.SPAWN_RATE_INTERVAL);
    const spawnRate = Math.min(
      GAME.OBSTACLE_SPAWN_RATE + spawnIntervals * DIFFICULTY.SPAWN_RATE_INCREASE,
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

    setObstacles(prev => [...prev, newObstacle]);
    setLastObstacleSpawn(gameTime);
  };

  // FIX: jump/duck - Delta-time game loop with proper physics
  useEffect(() => {
    if (!isRunning) return;

    const gameLoop = () => {
      const currentTime = performance.now();
      const dt = currentTime - lastTimeRef.current; // Delta time in ms
      lastTimeRef.current = currentTime;

      setGameTime(prevTime => prevTime + dt);

      // Get difficulty modifiers
      const { speedMultiplier, spawnRate } = getDifficultyModifiers(gameTime);

      // FIX: jump/duck - Player physics with proper delta-time integration
      setPlayer(prev => {
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
        if ((PLAYER.GROUND_Y - newY) > PLAYER.MAX_JUMP_HEIGHT && newVy < 0) {
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
      setObstacles(prev =>
        prev
          .map(obs => ({
            ...obs,
            x: obs.x - OBSTACLE.SPEED * speedMultiplier * dt / 16.67, // Normalize for 60fps equivalent
          }))
          .filter(obs => obs.x + obs.width > 0)
      );

      // Spawn obstacles
      const timeSinceLastSpawn = gameTime - lastObstacleSpawn;
      const lastObstacle = obstacles[obstacles.length - 1];
      const hasMinimumGap = !lastObstacle || lastObstacle.x <= OBSTACLE.SPAWN_X - GAME.OBSTACLE_MIN_GAP;

      if (Math.random() < spawnRate && timeSinceLastSpawn > GAME.OBSTACLE_MIN_GAP && hasMinimumGap) {
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
    setGameState(GAME_STATES.IDLE);
    setObstacles([]);
    setGameTime(0);
    setLastObstacleSpawn(0);
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

  return (
    <div className="game-container relative w-full h-screen bg-gradient-to-b from-sky-400 to-sky-200 overflow-hidden">
      {/* Simple game state display */}
      <div className="absolute top-4 left-4 bg-white bg-opacity-80 p-3 rounded-lg">
        <div className="text-lg font-bold text-gray-800">
          {gameState === GAME_STATES.IDLE && "Press SPACE to Start"}
          {gameState === GAME_STATES.RUNNING && "Running..."}
          {gameState === GAME_STATES.DEAD && "Game Over! Press R to Restart"}
        </div>
      </div>

      {/* Difficulty indicator - simplified */}
      {isRunning && (
        <div className="absolute top-4 right-4 bg-white bg-opacity-80 p-2 rounded-lg text-xs">
          <div>Speed: {getDifficultyModifiers(gameTime).speedMultiplier.toFixed(1)}x</div>
          <div>Spawn Rate: {(getDifficultyModifiers(gameTime).spawnRate * 100).toFixed(1)}%</div>
        </div>
      )}

      <Player data={player} />
      {obstacles.map((obs) => (
        <Obstacle key={obs.id} data={obs} />
      ))}
      <Ground />

      {/* Simple controls display */}
      <div className="absolute bottom-4 left-4 bg-white bg-opacity-80 p-2 rounded-lg text-sm">
        <div>↑/SPACE: Jump</div>
        <div>↓: Duck</div>
        <div>R: Restart (when dead)</div>
      </div>
    </div>
  );
}
