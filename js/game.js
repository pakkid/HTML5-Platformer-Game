document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded and parsed');
  
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let player = new Player(100, 100);
  let level;
  let gameOver = false;
  const keys = {};

  document.getElementById('start-button').addEventListener('click', () => {
    console.log('Start button clicked');
    document.getElementById('start-screen').classList.add('fade-out');
    setTimeout(() => {
      document.getElementById('start-screen').style.display = 'none';
    }, 500);
  });

  document.getElementById('level-select-button').addEventListener('click', () => {
    console.log('Level select button clicked');
    document.getElementById('level-select-screen').style.display = 'flex';
  });

  document.getElementById('close-level-select').addEventListener('click', () => {
    console.log('Close level select button clicked');
    document.getElementById('level-select-screen').style.display = 'none';
  });

  document.querySelectorAll('.level-button').forEach(button => {
    button.addEventListener('click', (e) => {
      const levelUrl = e.target.getAttribute('data-level');
      console.log(`Level button clicked: ${levelUrl}`);
      startGame(levelUrl);
    });
  });

  document.getElementById('drop-zone').addEventListener('click', () => {
    console.log('Drop zone clicked');
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
      console.log('File dropped:', file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        const customLevel = JSON.parse(e.target.result);
        console.log('Custom level loaded:', customLevel);
        startGame(customLevel);
      };
      reader.readAsText(file);
    }
  });

  document.getElementById('custom-level-input').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log('File selected:', file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        const customLevel = JSON.parse(e.target.result);
        console.log('Custom level loaded:', customLevel);
        startGame(customLevel);
      };
      reader.readAsText(file);
    }
  });

  document.getElementById('restart-button').addEventListener('click', () => {
    console.log('Restart button clicked');
    document.getElementById('gameover-screen').classList.remove('show');
    document.getElementById('restart-button').classList.remove('show');
    startGame(level.url);
  });

  document.getElementById('restart-top-button').addEventListener('click', () => {
    console.log('Top restart button clicked');
    startGame(level.url);
  });

  function startGame(levelUrl) {
    console.log('Starting game with level:', levelUrl);
    document.getElementById('level-select-screen').style.display = 'none';
    document.getElementById('restart-top-button').style.display = 'block';
    canvas.classList.remove('blur');
    loadLevel(levelUrl).then(lvl => {
      level = lvl;
      gameOver = false;
      player = new Player(100, 100); // Reset player position
      console.log('Level loaded:', level);
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
      console.log('Player fell off the screen');
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
    console.log('Displaying game over screen');
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