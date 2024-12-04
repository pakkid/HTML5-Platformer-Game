document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded and parsed');
  
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let player;
  let level;
  let gameOver = false;
  const keys = {};
  const levels = [
    'levels/level1.json',
    'levels/level2.json',
    'levels/level3.json',
    'levels/level4.json',
    'levels/level5.json'
  ];
  let currentLevelIndex = 0;

  function blurCanvas() {
    canvas.classList.add('blur');
  }

  function unblurCanvas() {
    canvas.classList.remove('blur');
  }

  document.getElementById('start-button').addEventListener('click', () => {
    console.log('Start button clicked');
    document.getElementById('start-screen').classList.add('fade-out');
    setTimeout(() => {
      document.getElementById('start-screen').style.display = 'none';
      unblurCanvas();
      startGame(levels[currentLevelIndex]); // Preload with level 1
    }, 500);
  });

  document.getElementById('level-select-button').addEventListener('click', () => {
    console.log('Level select button clicked');
    document.getElementById('level-select-screen').style.display = 'flex';
    blurCanvas();
  });

  document.getElementById('close-level-select').addEventListener('click', () => {
    console.log('Close level select button clicked');
    document.getElementById('level-select-screen').style.display = 'none';
    unblurCanvas();
  });

  document.querySelectorAll('.level-button').forEach(button => {
    button.addEventListener('click', (e) => {
      const levelUrl = e.target.getAttribute('data-level');
      console.log(`Level button clicked: ${levelUrl}`);
      currentLevelIndex = levels.indexOf(levelUrl);
      startGame(levelUrl);
    });
  });

  document.getElementById('restart-button').addEventListener('click', () => {
    console.log('Restart button clicked');
    document.getElementById('gameover-screen').classList.remove('show');
    document.getElementById('restart-button').classList.remove('show');
    startGame(level.url);
  });

  document.getElementById('restart-button-win').addEventListener('click', () => {
    console.log('Restart button (win) clicked');
    document.getElementById('win-screen').classList.remove('show');
    document.getElementById('restart-button-win').classList.remove('show');
    document.getElementById('next-level-button').classList.remove('show');
    startGame(level.url);
  });

  document.getElementById('next-level-button').addEventListener('click', () => {
    console.log('Next level button clicked');
    document.getElementById('win-screen').classList.remove('show');
    document.getElementById('restart-button-win').classList.remove('show');
    document.getElementById('next-level-button').classList.remove('show');
    nextLevel();
  });

  document.getElementById('restart-top-button').addEventListener('click', () => {
    console.log('Top restart button clicked');
    startGame(level.url);
  });

  function startGame(levelUrl) {
    if (!levelUrl) {
      console.error('Level URL is undefined');
      return;
    }
    console.log('Starting game with level:', levelUrl);
    document.getElementById('level-select-screen').style.display = 'none';
    document.getElementById('restart-top-button').style.display = 'block';
    unblurCanvas();
    loadLevel(levelUrl).then(lvl => {
      level = lvl;
      level.url = levelUrl; // Set the level URL
      gameOver = false;
      player = new Player(level.start.x, level.start.y - 50); // Set player position on top of start block
      console.log('Level loaded:', level);
      gameLoop();
    }).catch(error => {
      console.error('Error loading level:', error);
    });
  }

  function nextLevel() {
    currentLevelIndex = (currentLevelIndex + 1) % levels.length;
    startGame(levels[currentLevelIndex]);
  }

  function gameLoop() {
    if (gameOver) {
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (level) {
      level.draw(ctx);
      player.update(level.platforms || []);
      checkCollisions();
    }
    player.draw(ctx);

    // Check if player has fallen off the screen
    if (player.y > canvas.height) {
      console.log('Player fell off the screen');
      gameOver = true;
      displayGameOverScreen();
    }

    handleInput();

    requestAnimationFrame(gameLoop);
  }

  function handleInput() {
    if (keys['ArrowLeft']) player.moveLeft();
    if (keys['ArrowRight']) player.moveRight();
    if (keys['ArrowUp'] || keys[' ']) player.jump();
  }

  function checkCollisions() {
    level.killbars.forEach(killbar => {
      if (player.isColliding(killbar)) {
        console.log('Player hit a killbar');
        gameOver = true;
        displayGameOverScreen();
      }
    });

    if (player.isColliding(level.finish)) {
      console.log('Player reached the finish block');
      displayWinScreen();
    }
  }

  function displayGameOverScreen() {
    console.log('Displaying game over screen');
    document.getElementById('restart-top-button').style.display = 'none';
    blurCanvas();
    document.getElementById('gameover-screen').classList.add('show');
    setTimeout(() => {
      document.getElementById('restart-button').classList.add('show');
    }, 2000);
  }

  function displayWinScreen() {
    console.log('Displaying win screen');
    document.getElementById('restart-top-button').style.display = 'none';
    blurCanvas();
    document.getElementById('win-screen').classList.add('show');
    setTimeout(() => {
      document.getElementById('restart-button-win').classList.add('show');
      document.getElementById('next-level-button').classList.add('show');
    }, 2000);
  }

  window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
  });

  window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
  });
});