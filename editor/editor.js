const canvas = document.getElementById('editorCanvas');
const ctx = canvas.getContext('2d');
const addPlatformButton = document.getElementById('addPlatform');
const addPowerupButton = document.getElementById('addPowerup');
const deleteElementButton = document.getElementById('deleteElement');
const saveLevelButton = document.getElementById('saveLevel');
const importLevelInput = document.getElementById('importLevel');

canvas.width = 1000;
canvas.height = 400;

let level = {
    player: { x: 500, y: 200, width: 25, height: 25, speed: 3, color: '#E6AC27' },
    boxes: [],
    powerups: []
};

let currentTool = 'platform';
let selectedElement = null;

canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (currentTool === 'platform') {
        level.boxes.push({ x: x, y: y, width: 100, height: 20, color: 'green' });
    } else if (currentTool === 'powerup') {
        level.powerups.push({ x: x, y: y, width: 20, height: 20, color: 'yellow', effect: 'shrink' });
    } else if (currentTool === 'delete') {
        deleteElement(x, y);
    }

    draw();
});

addPlatformButton.addEventListener('click', () => {
    currentTool = 'platform';
});

addPowerupButton.addEventListener('click', () => {
    currentTool = 'powerup';
});

deleteElementButton.addEventListener('click', () => {
    currentTool = 'delete';
});

function deleteElement(x, y) {
    level.boxes = level.boxes.filter(box => !(x >= box.x && x <= box.x + box.width && y >= box.y && y <= box.y + box.height));
    level.powerups = level.powerups.filter(powerup => !(x >= powerup.x && x <= powerup.x + powerup.width && y >= powerup.y && y <= powerup.y + powerup.height));
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'blue';
    ctx.fillRect(level.player.x, level.player.y, level.player.width, level.player.height);

    level.boxes.forEach(box => {
        ctx.fillStyle = box.color;
        ctx.fillRect(box.x, box.y, box.width, box.height);
    });

    level.powerups.forEach(powerup => {
        ctx.fillStyle = powerup.color;
        ctx.fillRect(powerup.x, powerup.y, powerup.width, powerup.height);
    });
}

saveLevelButton.addEventListener('click', () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(level));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "level.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
});

importLevelInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
        level = JSON.parse(event.target.result);
        draw();
    };
    reader.readAsText(file);
});

draw();