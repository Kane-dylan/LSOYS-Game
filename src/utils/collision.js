// FIX: Collision detection - flying obstacles hit from all sides unless ducking
export function checkCollision(player, obstacle) {
  // FIX: Basic AABB collision detection for all obstacles
  const hasCollision = !(
    player.x + player.width < obstacle.x ||
    player.x > obstacle.x + obstacle.width ||
    player.y + player.height < obstacle.y ||
    player.y > obstacle.y + obstacle.height
  );

  // FIX: Flying obstacles (type "duck") - collision from any side unless ducking
  if (obstacle.type === "duck") {
    // Only safe when ducking underneath
    if (player.isDucking && hasCollision) {
      return false; // Player successfully ducks under flying obstacles
    }
    // All other cases (standing, jumping) with collision = game over
    return hasCollision;
  }

  // FIX: Ground obstacles (type "jump") - standard collision
  if (obstacle.type === "jump") {
    return hasCollision;
  }

  return false; // Default: no collision
}
