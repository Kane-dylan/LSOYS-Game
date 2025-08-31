export function checkCollision(player, obstacle) {

  const tolerance = 2;

  if (player.state === "ducking" && obstacle.type === "duck") {
    // Player can duck under duck obstacles - no collision
    return false;
  }

  return !(
    player.x + player.width < obstacle.x ||
    player.x > obstacle.x + obstacle.width ||
    player.y + player.height < obstacle.y ||
    player.y > obstacle.y + obstacle.height
  );
}

export function checkCollisionPrecise(player, obstacle) {
  let playerHeight = player.height;
  let playerY = player.y;

   if (player.state === "ducking") {
     // If player is ducking under a duck obstacle, no collision
     if (obstacle.type === "duck") {
       return false;
     }
     // Player is ducking but obstacle is too tall - still check collision with ducked height
     playerHeight = player.height; // Already adjusted in game state
   }

   const tolerance = 2;

  return !(
    player.x + player.width < obstacle.x ||
    player.x > obstacle.x + obstacle.width ||
    playerY + playerHeight < obstacle.y ||
    playerY > obstacle.y + obstacle.height
  );
}
