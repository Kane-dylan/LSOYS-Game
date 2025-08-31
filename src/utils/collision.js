// Simplified collision detection - FIX: jump/duck with proper hitbox handling
export function checkCollision(player, obstacle) {
  // FIX: jump/duck - Flying obstacles pass over ducking player
  if (player.isDucking && obstacle.type === "duck") {
    return false; // Player can duck under flying obstacles
  }

  // FIX: jump/duck - Use current hitbox dimensions for collision
  // Basic AABB (Axis-Aligned Bounding Box) collision detection
  return !(
    player.x + player.width < obstacle.x ||
    player.x > obstacle.x + obstacle.width ||
    player.y + player.height < obstacle.y ||
    player.y > obstacle.y + obstacle.height
  );
}
