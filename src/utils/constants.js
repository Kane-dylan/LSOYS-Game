// Player constants
export const PLAYER = {
  WIDTH: 40,
  HEIGHT: 60,
  JUMP_VELOCITY: -15,
  DUCK_HEIGHT: 30,
  GRAVITY: 0.8,
  GROUND_Y: 64,
  MAX_FALL_SPEED: 20,
};

// Game constants
export const GAME = {
  SPEED: 5,
  OBSTACLE_SPAWN_RATE: 0.02,
  OBSTACLE_MIN_GAP: 200,
  SCORE_INCREMENT_RATE: 0.1,
  POINTS_PER_INCREMENT: 1,
};

// Obstacle constants
export const OBSTACLE = {
  WIDTH: 20,
  HEIGHT: 40,
  DUCK_HEIGHT: 20,
  SPEED: 5,
  SPAWN_X: 800,
};

// Flame power constants
export const FLAME = {
  CHARGE_THRESHOLD: 100,
  BURN_RANGE: 200,
  COOLDOWN_TIME: 500,
  EFFECT_DURATION: 300, // Visual effect duration
};

// Difficulty scaling constants
export const DIFFICULTY = {
  SPEED_INCREASE_RATE: 0.02,
  SPEED_INCREASE_INTERVAL: 10,
  MAX_SPEED_MULTIPLIER: 3,
  SPAWN_RATE_INCREASE: 0.001,
  SPAWN_RATE_INTERVAL: 25,
  MAX_SPAWN_RATE: 0.08,
  MIN_GAP_DECREASE: 10,
  MIN_GAP_INTERVAL: 15,
  MIN_GAP_FLOOR: 100,
};

// Game state constants
export const GAME_STATES = {
  IDLE: "idle",
  RUNNING: "running",
  FLAME_READY: "flameReady",
  FLAME_USED: "flameUsed",
  DEAD: "dead",
  PAUSED: "paused",
};
