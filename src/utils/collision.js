export function checkCollision(player, obstacle) {
  // FIX: Collision detection with proper coordinate system (Y = bottom, height extends upward)
  const playerLeft = player.x;
  const playerRight = player.x + player.width;
  const playerBottom = player.y;
  const playerTop = player.y - player.height; // Top is Y minus height

  const obstacleLeft = obstacle.x;
  const obstacleRight = obstacle.x + obstacle.width;
  const obstacleBottom = obstacle.y;
  const obstacleTop = obstacle.y - obstacle.height; // Top is Y minus height

  // Standard AABB collision detection
  const hasCollision = !(
    playerRight < obstacleLeft ||
    playerLeft > obstacleRight ||
    playerTop > obstacleBottom ||
    playerBottom < obstacleTop
  );

  if (obstacle.type === "duck") {
    // FIX: Flying obstacle collision - player can duck under it safely
    if (player.isDucking && hasCollision) {
      // Check if there's sufficient vertical clearance
      // Flying obstacle should be high enough that ducked player passes underneath
      const duckedPlayerTop = playerBottom - player.height; // Top when ducking
      const flyingObstacleBottom = obstacleBottom;
      
      // Safe passage if ducked player's top is below flying obstacle's bottom
      if (duckedPlayerTop >= flyingObstacleBottom) {
        return false; // No collision - safe ducking passage
      }
    }
    return hasCollision;
  }

  if (obstacle.type === "jump") {
    return hasCollision;
  }

  return false;
}
