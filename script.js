const startBtn = document.getElementById("startBtn");
const startScreen = document.getElementById("startScreen");
const game = document.getElementById("game");

startBtn.addEventListener("click", () => {
  startScreen.classList.add("hidden");
  game.classList.remove("hidden");
});
