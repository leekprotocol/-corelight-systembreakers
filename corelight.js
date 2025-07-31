const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 640;
canvas.height = 480;

let keys = {};
document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

// Hero
const hero = {
  x: 100,
  y: 100,
  speed: 2,
  sprite: new Image()
};
hero.sprite.src = "sprites/hero.png";

let lastMoveTime = Date.now();

// Game loop
function gameLoop() {
  // Logic
  if (keys["ArrowLeft"]) hero.x -= hero.speed;
  if (keys["ArrowRight"]) hero.x += hero.speed;
  if (keys["ArrowUp"]) hero.y -= hero.speed;
  if (keys["ArrowDown"]) hero.y += hero.speed;

  // Canvas Clear
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Hero Draw
  ctx.drawImage(hero.sprite, hero.x, hero.y, 32, 32);

  // Idle Whisper
  const now = Date.now();
  if (!Object.values(keys).some(Boolean)) {
    if (now - lastMoveTime > 4000) {
      ctx.fillStyle = "lime";
      ctx.font = "16px monospace";
      ctx.fillText("[whisper] Still here... Tree?", 20, 460);
    }
  } else {
    lastMoveTime = now;
  }

  requestAnimationFrame(gameLoop);
}

gameLoop();
