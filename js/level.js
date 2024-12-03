class Level {
  constructor(data) {
    this.platforms = data.platforms || [];
    this.killbars = data.killbars || [];
    this.collectibles = data.collectibles || [];
    this.sky = data.sky || {};
  }

  draw(ctx) {
    if (this.sky.imageSrc) {
      const skyImage = new Image();
      skyImage.src = this.sky.imageSrc;
      skyImage.onload = () => {
        ctx.drawImage(skyImage, 0, 0, ctx.canvas.width, ctx.canvas.height);
      };
    }
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
  }
}

function loadLevel(url) {
  return fetch(url)
    .then(response => response.json())
    .then(data => new Level(data));
}