export function checkCollision(player, obstacle) {
  const playerLeft = player.x;
  const playerRight = player.x + player.width;
  const playerBottom = player.y;
  const playerTop = player.y - player.height;

  const obstacleLeft = obstacle.x;
  const obstacleRight = obstacle.x + obstacle.width;
  const obstacleBottom = obstacle.y;
  const obstacleTop = obstacle.y - obstacle.height; 

  // Standard AABB collision detection
  const hasCollision = !(
    playerRight < obstacleLeft ||
    playerLeft > obstacleRight ||
    playerTop > obstacleBottom ||
    playerBottom < obstacleTop
  );

  if (obstacle.type === "duck") {
    if (player.isDucking && hasCollision) { underneath
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
