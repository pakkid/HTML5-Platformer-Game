class Level {
    constructor(data) {
      this.platforms = data.platforms || [];
      this.sky = data.sky || {};
    }
  
    draw(ctx) {
      this.platforms.forEach(platform => {
        ctx.fillStyle = platform.color || 'gray';
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
      });
    }
  }
  
  function loadLevel(url) {
    return fetch(url)
      .then(response => response.json())
      .then(data => new Level(data));
  }