const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let player = new Player(100, 100);
let level;
let gameOver = false;
const keys = {};

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
  if (gameOver) {
    displayGameOverScreen();
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (level) {
    level.draw(ctx);
    player.update(level.platforms || []);
  }
  player.draw(ctx);

  // Check if player has fallen off the screen
  if (player.y > canvas.height) {
    gameOver = true;
  }

  handleInput();

  requestAnimationFrame(gameLoop);
}

function handleInput() {
  if (keys['ArrowLeft']) player.moveLeft();
  if (keys['ArrowRight']) player.moveRight();
  if (keys['ArrowUp'] || keys[' ']) player.jump();
}

function displayGameOverScreen() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'white';
  ctx.font = '48px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2);
}

window.addEventListener('keydown', (e) => {
  keys[e.key] = true;
});

window.addEventListener('keyup', (e) => {
  keys[e.key] = false;
});