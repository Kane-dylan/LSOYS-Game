export function checkCollision(player, obstacle) {

  const tolerance = 2;

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
    playerHeight = player.height;
    playerY = player.y;
  }

  return !(
    player.x + player.width < obstacle.x ||
    player.x > obstacle.x + obstacle.width ||
    playerY + playerHeight < obstacle.y ||
    playerY > obstacle.y + obstacle.height
  );
}
