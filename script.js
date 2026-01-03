const startScreen = document.getElementById("startScreen");
const gameScreen = document.getElementById("gameScreen");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreEl = document.getElementById("score");
const highScoreEl = document.getElementById("highScore");

let player, bullets, enemies;
let score = 0;
let gameInterval;
let enemyInterval;

let highScore = localStorage.getItem("highScore") || 0;
highScoreEl.textContent = `High Score: ${highScore}`;

// ---------- START GAME ----------
startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", startGame);

function startGame() {
  startScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");

  resetGame();
  gameLoop();
  spawnEnemies();
}

// ---------- RESET ----------
function resetGame() {
  clearInterval(gameInterval);
  clearInterval(enemyInterval);

  player = { x: 140, y: 350, size: 20 };
  bullets = [];
  enemies = [];
  score = 0;

  scoreEl.textContent = "Score: 0";
}

// ---------- GAME LOOP ----------
function gameLoop() {
  gameInterval = setInterval(update, 20);
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawPlayer();
  drawBullets();
  drawEnemies();
  moveBullets();
  moveEnemies();
  checkCollisions();
}

// ---------- PLAYER ----------
function drawPlayer() {
  ctx.fillStyle = "#38bdf8";
  ctx.fillRect(player.x, player.y, player.size, player.size);
}

document.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft" && player.x > 0) player.x -= 10;
  if (e.key === "ArrowRight" && player.x < canvas.width - player.size)
    player.x += 10;
  if (e.key === " ") shoot();
});

// ---------- BULLETS ----------
function shoot() {
  bullets.push({ x: player.x + 8, y: player.y });
}

function drawBullets() {
  ctx.fillStyle = "yellow";
  bullets.forEach(b => ctx.fillRect(b.x, b.y, 4, 10));
}

function moveBullets() {
  bullets.forEach(b => (b.y -= 5));
  bullets = bullets.filter(b => b.y > 0);
}

// ---------- ENEMIES ----------
function spawnEnemies() {
  enemyInterval = setInterval(() => {
    enemies.push({ x: Math.random() * 270, y: 0, size: 20 });
  }, 1000);
}

function drawEnemies() {
  ctx.fillStyle = "red";
  enemies.forEach(e => ctx.fillRect(e.x, e.y, e.size, e.size));
}

function moveEnemies() {
  enemies.forEach(e => (e.y += 2));
}

// ---------- COLLISIONS ----------
function checkCollisions() {
  enemies.forEach((enemy, ei) => {
    bullets.forEach((bullet, bi) => {
      if (
        bullet.x < enemy.x + enemy.size &&
        bullet.x + 4 > enemy.x &&
        bullet.y < enemy.y + enemy.size &&
        bullet.y + 10 > enemy.y
      ) {
        enemies.splice(ei, 1);
        bullets.splice(bi, 1);
        score++;
        scoreEl.textContent = `Score: ${score}`;

        if (score > highScore) {
          highScore = score;
          localStorage.setItem("highScore", highScore);
          highScoreEl.textContent = `High Score: ${highScore}`;
        }
      }
    });

    if (enemy.y > canvas.height) {
      gameOver();
    }
  });
}

// ---------- GAME OVER ----------
function gameOver() {
  clearInterval(gameInterval);
  clearInterval(enemyInterval);
  startScreen.classList.remove("hidden");
  gameScreen.classList.add("hidden");
}
