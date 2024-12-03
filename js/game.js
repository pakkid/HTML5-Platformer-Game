const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let player = new Player(100, 100);
let level;

document.getElementById('start-button').addEventListener('click', () => {
  document.getElementById('start-screen').style.opacity = 0;
  setTimeout(() => {
    document.getElementById('start-screen').style.display = 'none';
    startGame();
  }, 500);
});

function startGame() {
  loadLevel('levels/level1.json').then(lvl => {
    level = lvl;
    gameLoop();
  });
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (level) {
    level.draw(ctx);
    player.update(level.platforms);
  }
  player.draw(ctx);
  requestAnimationFrame(gameLoop);
}

window.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') player.moveLeft();
  if (e.key === 'ArrowRight') player.moveRight();
  if (e.key === ' ') player.jump();
});