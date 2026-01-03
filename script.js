const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");

const startScreen = document.getElementById("startScreen");
const game = document.getElementById("game");
const gameOverScreen = document.getElementById("gameOverScreen");

const gameArea = document.getElementById("gameArea");
const player = document.getElementById("player");

const scoreEl = document.getElementById("score");
const livesEl = document.getElementById("lives");
const finalScoreEl = document.getElementById("finalScore");

let score = 0;
let lives = 3;
let playerX = 130;
let gameInterval;
let enemyInterval;

// 🔥 HIGH SCORE
let highScore = localStorage.getItem("spaceShooterHighScore") || 0;

const highScoreDisplay = document.createElement("div");
highScoreDisplay.style.marginTop = "6px";
highScoreDisplay.textContent = `High Score: ${highScore}`;
document.querySelector(".hud").appendChild(highScoreDisplay);

startBtn.onclick = startGame;
restartBtn.onclick = restartGame;

// START GAME
function startGame() {
  resetGame();
  startScreen.classList.add("hidden");
  game.classList.remove("hidden");

  document.addEventListener("keydown", movePlayer);
  document.addEventListener("keydown", shoot);

  gameInterval = setInterval(moveEnemies, 20);
  enemyInterval = setInterval(createEnemy, 1000);
}

// RESET GAME
function resetGame() {
  score = 0;
  lives = 3;
  playerX = 130;

  scoreEl.textContent = "Score: 0";
  livesEl.textContent = "❤️ 3";
  highScoreDisplay.textContent = `High Score: ${highScore}`;

  player.style.left = playerX + "px";
  gameArea.querySelectorAll(".enemy, .bullet").forEach(e => e.remove());
}

// PLAYER MOVEMENT
function movePlayer(e) {
  if (e.key === "ArrowLeft" && playerX > 0) playerX -= 20;
  if (e.key === "ArrowRight" && playerX < 260) playerX += 20;
  player.style.left = playerX + "px";
}

// SHOOT
function shoot(e) {
  if (e.code === "Space") {
    const bullet = document.createElement("div");
    bullet.className = "bullet";
    bullet.style.left = playerX + 17 + "px";
    bullet.style.bottom = "50px";
    gameArea.appendChild(bullet);

    const bulletInterval = setInterval(() => {
      let bottom = parseInt(bullet.style.bottom);
      bullet.style.bottom = bottom + 10 + "px";

      if (bottom > 400) {
        bullet.remove();
        clearInterval(bulletInterval);
      }

      document.querySelectorAll(".enemy").forEach(enemy => {
        if (isColliding(bullet, enemy)) {
          bullet.remove();
          enemy.remove();
          clearInterval(bulletInterval);

          score++;
          scoreEl.textContent = "Score: " + score;

          if (score > highScore) {
            highScore = score;
            localStorage.setItem("spaceShooterHighScore", highScore);
            highScoreDisplay.textContent = `High Score: ${highScore}`;
          }
        }
      });
    }, 20);
  }
}

// CREATE ENEMY
function createEnemy() {
  const enemy = document.createElement("div");
  enemy.className = "enemy";
  enemy.style.top = "0px";
  enemy.style.left = Math.random() * 260 + "px";
  gameArea.appendChild(enemy);
}

// MOVE ENEMIES
function moveEnemies() {
  document.querySelectorAll(".enemy").forEach(enemy => {
    let top = parseInt(enemy.style.top);
    enemy.style.top = top + 2 + "px";

    if (top > 360) {
      enemy.remove();
      loseLife();
    }
  });
}

// LIFE LOST
function loseLife() {
  lives--;
  livesEl.textContent = "❤️ " + lives;
  if (lives <= 0) endGame();
}

// GAME OVER
function endGame() {
  clearInterval(gameInterval);
  clearInterval(enemyInterval);

  document.removeEventListener("keydown", movePlayer);
  document.removeEventListener("keydown", shoot);

  finalScoreEl.textContent = `Score: ${score} | High Score: ${highScore}`;

  game.classList.add("hidden");
  gameOverScreen.classList.remove("hidden");
}

// RESTART
function restartGame() {
  gameOverScreen.classList.add("hidden");
  startScreen.classList.remove("hidden");
}

// COLLISION
function isColliding(a, b) {
  const ar = a.getBoundingClientRect();
  const br = b.getBoundingClientRect();
  return !(
    ar.top > br.bottom ||
    ar.bottom < br.top ||
    ar.left > br.right ||
    ar.right < br.left
  );
}
