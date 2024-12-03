class Sky {
    constructor(imageSrc) {
      this.image = new Image();
      this.image.src = imageSrc;
      this.x = 0;
      this.speed = 1;
    }
  
    update() {
      this.x -= this.speed;
      if (this.x <= -canvas.width) {
        this.x = 0;
      }
    }
  
    draw(ctx) {
      ctx.drawImage(this.image, this.x, 0, canvas.width, canvas.height);
      ctx.drawImage(this.image, this.x + canvas.width, 0, canvas.width, canvas.height);
    }
  }