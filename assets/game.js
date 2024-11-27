const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const importLevelInput = document.getElementById('importLevel');

canvas.width = 800;
canvas.height = 600;

let levelData = [];
let currentLevel = 0;
let player = { x: 50, y: 50, width: 50, height: 50, speed: 5 };

function loadLevel(level) {
    fetch('levels/level1.json')
        .then(response => response.json())
        .then(data => {
            levelData = data.levels[level];
            player.x = levelData.start.x;
            player.y = levelData.start.y;
            draw();
        });
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'blue';
    ctx.fillRect(player.x, player.y, player.width, player.height);

    levelData.platforms.forEach(platform => {
        ctx.fillStyle = 'green';
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    });
}

function update() {
    if (keys.ArrowLeft) player.x -= player.speed;
    if (keys.ArrowRight) player.x += player.speed;
    if (keys.ArrowUp) player.y -= player.speed;
    if (keys.ArrowDown) player.y += player.speed;

    draw();
    requestAnimationFrame(update);
}

let keys = {};
window.addEventListener('keydown', (e) => keys[e.key] = true);
window.addEventListener('keyup', (e) => keys[e.key] = false);

importLevelInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
        const importedLevel = JSON.parse(event.target.result);
        levelData = importedLevel;
        player.x = levelData.start.x;
        player.y = levelData.start.y;
        draw();
    };
    reader.readAsText(file);
});

loadLevel(currentLevel);
update();