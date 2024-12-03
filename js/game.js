document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let player = new Player(100, 100);
  let level;
  let gameOver = false;
  const keys = {};

  document.getElementById('start-button').addEventListener('click', () => {
    document.getElementById('start-screen').classList.add('fade-out');
    setTimeout(() => {
      document.getElementById('start-screen').style.display = 'none';
    }, 500);
  });

  document.getElementById('level-select-button').addEventListener('click', () => {
    document.getElementById('level-select-screen').style.display = 'flex';
  });

  document.getElementById('close-level-select').addEventListener('click', () => {
    document.getElementById('level-select-screen').style.display = 'none';
  });

  document.querySelectorAll('.level-button').forEach(button => {
    button.addEventListener('click', (e) => {
      const levelUrl = e.target.getAttribute('data-level');
      startGame(levelUrl);
    });
  });

  document.getElementById('drop-zone').addEventListener('click', () => {
    document.getElementById('custom-level-input').click();
  });

  document.getElementById('drop-zone').addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
    document.getElementById('drop-zone').classList.add('hover');
  });

  document.getElementById('drop-zone').addEventListener('dragleave', (e) => {
    e.preventDefault();
    e.stopPropagation();
    document.getElementById('drop-zone').classList.remove('hover');
  });

  document.getElementById('drop-zone').addEventListener('drop', (e) => {
    e.preventDefault();
    e.stopPropagation();
    document.getElementById('drop-zone').classList.remove('hover');
    const file = e.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const customLevel = JSON.parse(e.target.result);
        startGame(customLevel);
      };
      reader.readAsText(file);
    }
  });

  document.getElementById('custom-level-input').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const customLevel = JSON.parse(e.target.result);
        startGame(customLevel);
      };
      reader.readAsText(file);
    }
  });

  document.getElementById('restart-button').addEventListener('click', () => {
    document.getElementById('gameover-screen').classList.remove('show');
    document.getElementById('restart-button').classList.remove('show');
    startGame(level.url);
  });

  document.getElementById('restart-top-button').addEventListener('click', () => {
    startGame(level.url);
  });

  function startGame(levelUrl) {
    document.getElementById('level-select-screen').style.display = 'none';
    document.getElementById('restart-top-button').style.display = 'block';
    loadLevel(levelUrl).then(lvl => {
      level = lvl;
      gameOver = false;
      canvas.classList.remove('blur');
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
    document.getElementById('restart-top-button').style.display = 'none';
    canvas.classList.add('blur');
    document.getElementById('gameover-screen').classList.add('show');
    setTimeout(() => {
      document.getElementById('restart-button').classList.add('show');
    }, 2000);
  }

  window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
  });

  window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
  });
});