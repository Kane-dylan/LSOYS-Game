import { useState, useEffect } from "react";
import useGameLoop from "../hooks/useGameLoop";
import Player from "./Player";
import Obstacle from "./Obstacle";
import Ground from "./Ground";
import Scoreboard from "./Scoreboard";
import FlameIndicator from "./FlameIndicator";
import Controls from "./Controls";
import { checkCollision } from "../utils/collision";
import { loadBestScore, saveBestScore } from "../utils/storage";
import { GAME, OBSTACLE, PLAYER } from "../utils/constants";

export default function Game() {
  const [isRunning, setIsRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(loadBestScore());
  const [player, setPlayer] = useState({ 
    x: 50, 
    y: 0,
    velocityY: 0,
    width: PLAYER.WIDTH,
    height: PLAYER.HEIGHT, 
    state: "running" 
  });
  const [obstacles, setObstacles] = useState([]);
  const [flameReady, setFlameReady] = useState(false);
  const [gameTime, setGameTime] = useState(0);
  const [lastObstacleSpawn, setLastObstacleSpawn] = useState(0);
  const [scoreAccumulator, setScoreAccumulator] = useState(0);
  const [flameProgress, setFlameProgress] = useState(0);
  const [lastFlameUse, setLastFlameUse] = useState(0);


  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isRunning) return;

      switch (e.code) {
        case "Space":
        case "ArrowUp":
          e.preventDefault();
          jump();
          break;
        case "ArrowDown":
          e.preventDefault();
          duck();
          break;
        case "ShiftLeft":
        case "ShiftRight":
          e.preventDefault();
          useFlame();
          break;
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  },[isRunning]);


  const jump = () => {
    setPlayer(prev => {
      // jump while y<= 0
      if(prev.y <= 0) {

        setFlameProgress((prevProgress) => {
          const newProgress = prevProgress + 10; // 10 points per jump
          return Math.min(newProgress, FLAME.CHARGE_THRESHOLD);
        });

        return {
          ...prev,
          velocityY: PLAYER.JUMP_VELOCITY,
          state: "jumping"
        };
      }
      return prev;
    });
  };

  const duck = () => {
    setPlayer((prev) => {
      if (prev.y <= 0) {
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
  }

  const useFlame = () =>{
    const timeSinceLastUse = gameTime - lastFlameUse;
    if (!flameReady || timeSinceLastUse < FLAME.COOLDOWN_TIME) {
      return;
    }
    const targetObstacle = obstacles.find(
      (obs) => obs.x > player.x && obs.x < player.x + FLAME.BURN_RANGE
    );
    if (targetObstacle) {
      // Remove the target obstacle
      setObstacles((prev) =>
        prev.filter((obs) => obs.id !== targetObstacle.id)
      );

      setScore((prevScore) => prevScore + 10);

      console.log("Flame burned obstacle!");
    }

    // Reset flame power
    setFlameReady(false);
    setFlameProgress(0);
    setLastFlameUse(gameTime);
  }

  const spawnObstacle = () => {
    const obstacleType = Math.random() > 0.7 ? 'duck' : 'jump';

    const newObstacle = {
      id: Date.now() + Math.random(),
      x: OBSTACLE.SPAWN_X,
      y: 0,
      width: OBSTACLE.WIDTH,
      height: obstacleType === 'duck' ? OBSTACLE.DUCK_HEIGHT : OBSTACLE.HEIGHT,
      type: obstacleType
    };

    setObstacles(prev => [...prev, newObstacle]);
    setLastObstacleSpawn(gameTime);
  };


  // main loop
  useGameLoop(isRunning, (delta) => {
    const deltaInSeconds = delta / 1000;

    setGameTime((prevTime) => prevTime + delta);

    // update score
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

    // Check if flame should be ready
    if (flameProgress >= FLAME.CHARGE_THRESHOLD && !flameReady) {
      setFlameReady(true);
    }

    // player physics
    setPlayer((prev) => {
      let newY = prev.y;
      let newVelocityY = prev.velocityY;
      let newState = prev.state;
      let newHeight = prev.height;

      // gravity
      newVelocityY += PLAYER.GRAVITY * deltaInSeconds * 60;

      if (newVelocityY > PLAYER.MAX_FALL_SPEED) {
        newVelocityY = PLAYER.MAX_FALL_SPEED;
      }

      newY += newVelocityY * deltaInSeconds * 60;

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

    // obstacle positions
    setObstacles((prev) =>
      prev
        .map((obs) => ({
          ...obs,
          x: obs.x - OBSTACLE.SPEED * deltaInSeconds * 60,
        }))
        .filter((obs) => obs.x + obs.width > 0)
    );

    // spawn new obstacles
    const timeSinceLastSpawn = gameTime - lastObstacleSpawn;
    const shouldSpawn =
      Math.random() < GAME.OBSTACLE_SPAWN_RATE &&
      timeSinceLastSpawn > GAME.OBSTACLE_MIN_GAP;

    if (shouldSpawn) {
      spawnObstacle();
    }

    // check collisions
    setObstacles((prevObstacles) => {
      for (const obstacle of prevObstacles) {
        if (checkCollision(player, obstacle)) {
          // game over logic
          setIsRunning(false);
          if (score > bestScore) {
            setBestScore(score);
            saveBestScore(score);
            console.log(`New best score: ${score}!`);
          }
          setPlayer((prev) => ({ ...prev, state: "dead" }));
          break;
        }
      }
      return prevObstacles;
    });
  });

  const handleRestart = () => {
    setIsRunning(true);
    setScore(0);
    setScoreAccumulator(0);
    setObstacles([]);
    setFlameReady(false);
    setFlameProgress(0); 
    setLastFlameUse(0); 
    setGameTime(0);
    setLastObstacleSpawn(0);
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
    <div className="relative w-full h-screen bg-gray-100 overflow-hidden">
      <Scoreboard score={score} best={bestScore} />
      <Player data={player} flameReady={flameReady} />
      {obstacles.map((obs) => (
        <Obstacle key={obs.id} data={obs} />
      ))}
      <Ground />
      <Controls
        isRunning={isRunning}
        onPause={() => setIsRunning(false)}
        onResume={() => setIsRunning(true)}
        onRestart={handleRestart}
      />
    </div>
  );
}
