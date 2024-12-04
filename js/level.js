class Level {
  constructor(data) {
    this.platforms = data.platforms || [];
    this.killbars = data.killbars || [];
    this.collectibles = data.collectibles || [];
    this.start = data.start || { x: 0, y: 0, width: 50, height: 50 };
    this.finish = data.finish || { x: 0, y: 0, width: 50, height: 50 };
  }

  draw(ctx) {
    this.platforms.forEach(platform => {
      if (platform.visible !== false) {
        ctx.fillStyle = platform.color || 'gray';
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
      }
    });
    this.killbars.forEach(killbar => {
      if (killbar.visible !== false) {
        ctx.fillStyle = killbar.color || 'red';
        ctx.fillRect(killbar.x, killbar.y, killbar.width, killbar.height);
      }
    });
    this.collectibles.forEach(collectible => {
      if (collectible.visible !== false) {
        ctx.fillStyle = collectible.color || 'yellow';
        ctx.fillRect(collectible.x, collectible.y, collectible.width, collectible.height);
      }
    });
    // Draw finish block
    ctx.fillStyle = 'blue';
    ctx.fillRect(this.finish.x, this.finish.y, this.finish.width, this.finish.height);
  }
}

function loadLevel(url) {
  return fetch(url)
    .then(response => response.json())
    .then(data => new Level(data));
}