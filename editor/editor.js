const canvas = document.getElementById('editorCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;

let level = {
    start: { x: 50, y: 50 },
    platforms: []
};

canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    level.platforms.push({ x: x, y: y, width: 100, height: 20 });
    draw();
});

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'blue';
    ctx.fillRect(level.start.x, level.start.y, 50, 50);

    level.platforms.forEach(platform => {
        ctx.fillStyle = 'green';
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    });
}

document.getElementById('saveLevel').addEventListener('click', () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(level));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "level.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
});

document.getElementById('importLevel').addEventListener('change', (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
        level = JSON.parse(event.target.result);
        draw();
    };
    reader.readAsText(file);
});

draw();