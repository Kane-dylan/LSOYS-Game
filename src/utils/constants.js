// Simplified constants - removed all features except core mechanics
// Removed: FLAME constants, GROUND_Y, scoring constants, pause state, flame states

// Player constants - FIX: jump/duck physics tuned for delta-time game loop
export const PLAYER = {
  WIDTH: 40,
  HEIGHT: 60,
  DUCK_HEIGHT_RATIO: 0.55, // FIX: jump/duck - ducking reduces height to 55%
  // Physics constants in px/ms units for delta-time integration
  GROUND_Y: 300, // FIX: jump/duck - explicit ground level
  GRAVITY: 0.002, // FIX: jump/duck - gravity in px/ms²
  JUMP_VELOCITY: 0.9, // FIX: jump/duck - initial jump velocity in px/ms
  MAX_JUMP_HEIGHT: 110, // FIX: jump/duck - maximum jump height in px
  TERMINAL_VELOCITY: 1.8, // FIX: jump/duck - maximum fall speed in px/ms
};

// Game constants
export const GAME = {
  OBSTACLE_SPAWN_RATE: 0.015, // FIX: Reduced spawn rate for better spacing
  OBSTACLE_MIN_GAP: 350, // FIX: Increased minimum gap for better reaction time
  OBSTACLE_GAP_VARIANCE: 200, // FIX: Add random variance for spawn distance
};

// Obstacle constants - FIX: Better visibility and spacing
export const OBSTACLE = {
  WIDTH: 30, // FIX: Increased width for better visibility
  HEIGHT: 50, // FIX: Increased height for better visibility
  DUCK_HEIGHT: 25, // FIX: Proportional duck height
  DUCK_Y_OFFSET: 30, // Height above ground for duck obstacles
  FLY_Y: 300 - 40, // FIX: Lower flying obstacles so player must duck to pass under
  SPEED: 4, // FIX: Slightly reduced speed for better reaction time
  SPAWN_X: 900, // FIX: Increased spawn distance for better visibility
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
