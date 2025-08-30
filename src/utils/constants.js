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
};


// Obstacle constants
export const OBSTACLE = {
  WIDTH: 20,
  HEIGHT: 40,
  DUCK_HEIGHT: 20,
  SPEED: 5,
  SPAWN_X: 800,
}