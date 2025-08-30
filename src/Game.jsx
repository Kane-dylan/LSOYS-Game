import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';

// Basic constants
const ASPECT_RATIO = 16 / 9;
const GAME_WIDTH = 960; // base logical width
const GAME_HEIGHT = GAME_WIDTH / ASPECT_RATIO; // 540 for 16:9
const GROUND_HEIGHT = 24; // px
const PLAYER_SIZE = 48; // square
const GRAVITY = 1800; // px/s^2 for manual physics fallback
const JUMP_VELOCITY = -900; // px/s
const OBSTACLE_MIN_INTERVAL = 1200; // ms
const OBSTACLE_MAX_INTERVAL = 2400; // ms
const OBSTACLE_SPEED = 360; // px/s

function randomInterval() {
  return (
    OBSTACLE_MIN_INTERVAL +
    Math.random() * (OBSTACLE_MAX_INTERVAL - OBSTACLE_MIN_INTERVAL)
  );
}

export default function Game() {
  const containerRef = useRef(null);
  const lastTimeRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [obstacles, setObstacles] = useState([]); // {id,x,width,height}
  const nextSpawnRef = useRef(performance.now() + randomInterval());

  // Player state
  const [playerY, setPlayerY] = useState(0); // 0 means on ground (bottom offset)
  const [velocityY, setVelocityY] = useState(0);
  const controls = useAnimation();
  const isJumpingRef = useRef(false);
  const duckRef = useRef(false);

  const restart = useCallback(() => {
    setIsGameOver(false);
    setScore(0);
    setObstacles([]);
    setPlayerY(0);
    setVelocityY(0);
    nextSpawnRef.current = performance.now() + randomInterval();
    lastTimeRef.current = null;
    setIsPaused(false);
  }, []);

  const triggerJump = useCallback(() => {
    if (isGameOver || isPaused) return;
    if (isJumpingRef.current) return; // already jumping
    isJumpingRef.current = true;

    // Framer Motion animation for jump arc
    const jumpHeight = 180; // px upward
    controls.start({
      y: -jumpHeight,
      transition: {
        type: 'tween',
        duration: 0.45,
        ease: [0.39, 0.575, 0.565, 1.0],
        repeat: 1,
        repeatType: 'reverse',
        repeatDelay: 0,
        onComplete: () => {
          isJumpingRef.current = false;
          setPlayerY(0); // back to ground
        },
      },
    });
  }, [controls, isGameOver, isPaused]);

  const triggerDuck = useCallback(() => {
    if (isGameOver || isPaused) return;
    if (isJumpingRef.current) return; // can't duck mid-air (simple rule)
    duckRef.current = true;
    setTimeout(() => (duckRef.current = false), 400); // temporary duck
  }, [isGameOver, isPaused]);

  // Input handlers
  useEffect(() => {
    const handleKey = (e) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        triggerJump();
      } else if (e.code === 'ArrowDown') {
        triggerDuck();
      } else if (e.code === 'KeyP') {
        setIsPaused(p => !p);
      }
    };
    window.addEventListener('keydown', handleKey);

    // Basic mobile tap/swipe stubs
    let touchStartY = null;
    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
    };
    const handleTouchEnd = (e) => {
      if (touchStartY != null) {
        const dy = e.changedTouches[0].clientY - touchStartY;
        if (dy > 60) {
          triggerDuck();
        } else {
          triggerJump();
        }
      }
      touchStartY = null;
    };
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('keydown', handleKey);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [triggerJump, triggerDuck]);

  // Game loop for obstacles + score + collision (player vertical handled by motion)
  useEffect(() => {
    if (isPaused || isGameOver) return;
    let frame;

    const tick = (time) => {
      if (lastTimeRef.current == null) lastTimeRef.current = time;
      const dt = (time - lastTimeRef.current) / 1000; // seconds
      lastTimeRef.current = time;

      // Update obstacles
      setObstacles((prev) => {
        const updated = prev
          .map(o => ({ ...o, x: o.x - OBSTACLE_SPEED * dt }))
          .filter(o => o.x + o.width > 0); // keep on screen
        return updated;
      });

      // Spawn new obstacle
      if (time >= nextSpawnRef.current) {
        const height = 40 + Math.random() * 40; // 40-80
        const width = 30 + Math.random() * 30; // 30-60
        setObstacles(prev => [
          ...prev,
          {
            id: Math.random().toString(36).slice(2),
            x: GAME_WIDTH + 20,
            width,
            height,
          },
        ]);
        nextSpawnRef.current = time + randomInterval();
      }

      // Increase score
      setScore(s => s + dt * 10);

      // Collision detection (AABB)
      // Player logical box:
      const playerBottom = GAME_HEIGHT - GROUND_HEIGHT;
      const playerTop = playerBottom - (duckRef.current ? PLAYER_SIZE * 0.5 : PLAYER_SIZE);
      const playerLeft = 60;
      const playerRight = playerLeft + PLAYER_SIZE;

      const playerAnimOffsetY = playerY; // currently always 0 (since motion handles actual visual offset)

      let collided = false;
      obstacles.forEach(o => {
        const obstacleBottom = GAME_HEIGHT - GROUND_HEIGHT;
        const obstacleTop = obstacleBottom - o.height;
        const obstacleLeft = o.x;
        const obstacleRight = o.x + o.width;

        if (
          playerLeft < obstacleRight &&
          playerRight > obstacleLeft &&
          playerTop + playerAnimOffsetY < obstacleBottom &&
          playerBottom > obstacleTop
        ) {
          collided = true;
        }
      });
      if (collided) {
        setIsGameOver(true);
        console.log('game over');
      } else {
        frame = requestAnimationFrame(tick);
      }
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [isPaused, isGameOver, playerY, obstacles]);

  return (
    <div className="w-full h-dvh flex items-center justify-center bg-neutral-900 text-white select-none">
      <div
        ref={containerRef}
        className="relative bg-neutral-800 overflow-hidden rounded-lg shadow-lg"
        style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
      >
        {/* Score */}
        <div className="absolute top-2 left-3 text-sm font-mono opacity-90">
          Score: {Math.floor(score)}
        </div>

        {/* Pause Button */}
        <button
          onClick={() => setIsPaused(p => !p)}
            className="absolute top-2 right-2 px-3 py-1 text-xs rounded bg-neutral-700 hover:bg-neutral-600 transition"
        >
          {isPaused ? 'Resume' : 'Pause'}
        </button>

        {/* Player */}
        <motion.div
          animate={controls}
          className="absolute left-[60px] bottom-[24px] origin-bottom"
          style={{
            width: PLAYER_SIZE,
            height: duckRef.current ? PLAYER_SIZE * 0.5 : PLAYER_SIZE,
            background: 'linear-gradient(135deg,#3b82f6,#1d4ed8)',
            borderRadius: 6,
          }}
        />

        {/* Obstacles */}
        {obstacles.map(o => (
          <div
            key={o.id}
            className="absolute bottom-[24px] bg-pink-500/80 border border-pink-300/40"
            style={{
              left: o.x,
              width: o.width,
              height: o.height,
              borderRadius: 4,
            }}
          />
        ))}

        {/* Ground */}
        <div
          className="absolute left-0 right-0 bg-neutral-600"
          style={{ height: GROUND_HEIGHT, bottom: 0 }}
        />

        {/* Restart Button */}
        <button
          onClick={restart}
          className="absolute left-1/2 -translate-x-1/2 bottom-2 px-4 py-1 text-sm rounded bg-neutral-700 hover:bg-neutral-600 transition"
        >
          Restart
        </button>

        {isGameOver && (
          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-4">
            <div className="text-2xl font-semibold">Game Over</div>
            <button
              onClick={restart}
              className="px-5 py-2 rounded bg-blue-600 hover:bg-blue-500"
            >
              Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
