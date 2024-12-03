class Player {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.width = 50;
      this.height = 50;
      this.speed = 5;
      this.jumpHeight = 15;
      this.velocityY = 0;
      this.gravity = 0.5;
      this.onGround = false;
    }
  
    update() {
      if (this.onGround) {
        this.velocityY = 0;
      } else {
        this.velocityY += this.gravity;
      }
      this.y += this.velocityY;
    }
  
    moveLeft() {
      this.x -= this.speed;
    }
  
    moveRight() {
      this.x += this.speed;
    }
  
    jump() {
      if (this.onGround) {
        this.velocityY = -this.jumpHeight;
        this.onGround = false;
      }
    }
  
    draw(ctx) {
      ctx.fillStyle = 'red';
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  }