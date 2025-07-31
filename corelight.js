const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 640;
canvas.height = 480;

const TILE_SIZE = 32;
let keys = {};
document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

// Load hero sprite
const hero = {
  x: 3 * TILE_SIZE,
  y: 3 * TILE_SIZE,
  width: TILE_SIZE,
  height: TILE_SIZE,
  speed: 2,
  sprite: new Image()
};
hero.sprite.src = "sprites/hero.png";

// Load tree tile
const treeTile = new Image();
treeTile.src = "sprites/tree.png";

// Load map data
let tilemap = [];
fetch("maps/first_map.json")
  .then(res => res.json())
  .then(data => {
    tilemap = data;
    requestAnimationFrame(gameLoop);
  });

let lastMoveTime = Date.now();
let showWhisper = false;

// Check for collision
function isBlocked(x, y) {
  const col = Math.floor(x / TILE_SIZE);
  const row = Math.floor(y / TILE_SIZE);
  return tilemap[row] && tilemap[row][col] === 1;
}

// Game loop
function gameLoop() {
  // Movement
  let moved = false;
  let nextX = hero.x;
  let nextY = hero.y;

  if (keys["ArrowLeft"]) {
    nextX -= hero.speed;
    moved = true;
  }
  if (keys["ArrowRight"]) {
    nextX += hero.speed;
    moved = true;
  }
  if (keys["ArrowUp"]) {
    nextY -= hero.speed;
    moved = true;
  }
  if (keys["ArrowDown"]) {
    nextY += hero.speed;
    moved = true;
  }

  if (!isBlocked(nextX, hero.y)) hero.x = nextX;
  if (!isBlocked(hero.x, nextY)) hero.y = nextY;

  // Timing
  const now = Date.now();
  if (moved) {
    lastMoveTime = now;
    showWhisper = false;
  } else if (now - lastMoveTime > 4000) {
    showWhisper = true;
  }

  // Draw background
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw tilemap
  for (let row = 0; row < tilemap.length; row++) {
    for (let col = 0; col < tilemap[row].length; col++) {
      const tile = tilemap[row][col];
      if (tile === 1) {
        ctx.drawImage(treeTile, col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      }
    }
  }

  // Draw hero
  ctx.drawImage(hero.sprite, hero.x, hero.y, TILE_SIZE, TILE_SIZE);

  // Draw whisper if idle
  if (showWhisper) {
    ctx.fillStyle = "lime";
    ctx.font = "16px monospace";
    ctx.fillText("[whisper] Still here... Tree?", 20, 460);
  }

  requestAnimationFrame(gameLoop);
}
