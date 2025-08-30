// Player constants
export const PLAYER = {
  WIDTH: 40,
  HEIGHT: 60,
  JUMP_VELOCITY: -15,
  DUCK_HEIGHT: 30,
  GRAVITY: 0.8,
  GROUND_Y: 64, // Height of ground (16 * 4 for h-16)
  MAX_FALL_SPEED: 20, // Terminal velocity
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
}

// Flame power constants
export const FLAME = {
  CHARGE_THRESHOLD: 100, // Points needed to charge flame
  BURN_RANGE: 200, // Distance to look for obstacles to burn
  COOLDOWN_TIME: 500, // Milliseconds before can use flame again
};