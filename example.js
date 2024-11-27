(function () {
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    window.requestAnimationFrame = requestAnimationFrame;
})();

var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d"),
    width = 1000,
    height = 400,
    player = {},
    keys = [],
    friction = 0.8,
    gravity = 0.4,
    boxes = [],
    powerups = [];

canvas.width = width;
canvas.height = height;

function loadLevel(level) {
    fetch(level)
        .then(response => response.json())
        .then(data => {
            player = data.player;
            boxes = data.boxes;
            powerups = data.powerups;
            update();
        })
        .catch(error => console.error('Error loading level:', error));
}

function update() {
    // check keys
    if (keys[38] || keys[32] || keys[87]) {
        // up arrow or space
        if (!player.jumping && player.grounded) {
            player.jumping = true;
            player.grounded = false;
            player.velY = -player.speed * 2.5; // how high to jump
        }
    }
    if (keys[39] || keys[68]) {
        // right arrow
        if (player.velX < player.speed) {
            player.velX++;
        }
    }
    if (keys[37] || keys[65]) {
        // left arrow
        if (player.velX > -player.speed) {
            player.velX--;
        }
    }

    player.velX *= friction;
    player.velY += gravity;

    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();

    player.grounded = false;
    for (var i = 0; i < boxes.length; i++) {
        ctx.fillStyle = boxes[i].color;
        ctx.rect(boxes[i].x, boxes[i].y, boxes[i].width, boxes[i].height);

        var dir = colCheck(player, boxes[i]);

        if (dir === "l" || dir === "r") {
            player.velX = 0;
            player.jumping = false;
        } else if (dir === "b") {
            player.grounded = true;
            player.jumping = false;
        } else if (dir === "t") {
            player.velY *= -1;
        }
    }

    if (player.grounded) {
        player.velY = 0;
    }

    player.x += player.velX;
    player.y += player.velY;

    ctx.fill();
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // draw powerup stuff
    for (var j = 0; j < powerups.length; j++) {
        ctx.save();
        var cx = powerups[j].x + 0.5 * powerups[j].width,
            cy = powerups[j].y + 0.5 * powerups[j].height;
        ctx.translate(cx, cy);
        ctx.rotate((Math.PI / 180) * 45);
        if (powerups[j].effect === 'tele') {
            ctx.rotate((Math.PI / 180) * powerups[j].rotate);
            powerups[j].rotate = (Math.PI / 180) * powerups[j].rotate;
        }
        ctx.translate(-cx, -cy);
        ctx.fillStyle = powerups[j].color;
        ctx.fillRect(powerups[j].x, powerups[j].y, powerups[j].width, powerups[j].height);
        ctx.restore();

        // powerup collision
        if (colCheck(player, powerups[j]) !== null) {
            if (powerups[j].effect === 'gravity') {
                gravity = 0.4;
                player.speed = 4;
                player.color = 'white';
            } else if (powerups[j].effect === 'shrink') {
                player.width = 10;
                player.height = 10;
                player.speed = 5;
            } else if (powerups[j].effect === 'tele') {
                player.x = powerups[j].px;
                player.y = powerups[j].py;
            } else if (powerups[j].effect === 'win') {
                var r = confirm("You win! Play again?");
                if (r == false) {
                    player.x = 200;
                    player.y = 200;
                } else {
                    window.location.href = window.location.href;
                }
            }
            if (powerups[j].stay !== true)
                powerups[j].width = 0;
        }
    }

    requestAnimationFrame(update);
}

function colCheck(shapeA, shapeB) {
    var vX = (shapeA.x + (shapeA.width / 2)) - (shapeB.x + (shapeB.width / 2)),
        vY = (shapeA.y + (shapeA.height / 2)) - (shapeB.y + (shapeB.height / 2)),
        hWidths = (shapeA.width / 2) + (shapeB.width / 2),
        hHeights = (shapeA.height / 2) + (shapeB.height / 2),
        colDir = null;

    if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {
        var oX = hWidths - Math.abs(vX),
            oY = hHeights - Math.abs(vY);
        if (oX >= oY) {
            if (vY > 0) {
                colDir = "t";
                shapeA.y += oY;
            } else {
                colDir = "b";
                shapeA.y -= oY;
            }
        } else {
            if (vX > 0) {
                colDir = "l";
                shapeA.x += oX;
            } else {
                colDir = "r";
                shapeA.x -= oX;
            }
        }
    }
    return colDir;
}

document.body.addEventListener("keydown", function (e) {
    keys[e.keyCode] = true;
});

document.body.addEventListener("keyup", function (e) {
    keys[e.keyCode] = false;
});

window.addEventListener("load", function () {
    loadLevel('levels/level1.json');
});