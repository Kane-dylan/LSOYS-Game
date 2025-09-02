// Simplified constants - removed all features except core mechanics
// Removed: FLAME constants, GROUND_Y, scoring constants, pause state, flame states

export const PLAYER = {
  WIDTH: 45, //  Increased for better collision detection
  HEIGHT: 65, //  Increased for better collision detection
  DUCK_HEIGHT_RATIO: 0.55,
  GROUND_Y: 300,
  GRAVITY: 0.002,
  JUMP_VELOCITY: 0.9,
  MAX_JUMP_HEIGHT: 110,
  TERMINAL_VELOCITY: 1.8,
};

export const GAME = {
  OBSTACLE_SPAWN_RATE: 0.015,
  OBSTACLE_MIN_GAP: 350,
  OBSTACLE_GAP_VARIANCE: 200,
};

export const OBSTACLE = {
  WIDTH: 35, //  Increased for better collision detection
  HEIGHT: 55, //  Increased for better collision detection
  DUCK_HEIGHT: 30, //  Increased proportionally
  DUCK_Y_OFFSET: 30,
  FLY_Y: 250, //  Flying obstacle positioned so ducking player (top at ~264) can pass under (bottom at 250)
  SPEED: 4,
  SPAWN_X: 900,
};

// Difficulty scaling constants - simplified to only increase speed and spawn rate
export const DIFFICULTY = {
  SPEED_INCREASE_RATE: 0.02,
  SPEED_INCREASE_INTERVAL: 1000, // Increase every 1000ms (1 second)
  MAX_SPEED_MULTIPLIER: 3,
  SPAWN_RATE_INCREASE: 0.001,
  SPAWN_RATE_INTERVAL: 2000, // Increase every 2000ms (2 seconds)
  MAX_SPAWN_RATE: 0.08,
};

// Game state constants - FEATURE: Added pause state
export const GAME_STATES = {
  IDLE: "idle",
  RUNNING: "running",
  PAUSED: "paused", // FEATURE: Pause/resume functionality
  DEAD: "dead",
};

// FEATURE: Score constants for time/distance based scoring
export const SCORE = {
  TIME_MULTIPLIER: 0.01, // Points per millisecond
  DISTANCE_MULTIPLIER: 0.1, // Additional points per distance unit
};
