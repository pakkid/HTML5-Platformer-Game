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
  
    update(platforms) {
      this.onGround = false;
      this.velocityY += this.gravity;
      this.y += this.velocityY;
  
      // Check for collisions with platforms
      if (platforms) {
        platforms.forEach(platform => {
          if (this.isColliding(platform)) {
            if (this.velocityY > 0) { // Falling down
              this.y = platform.y - this.height;
              this.onGround = true;
              this.velocityY = 0;
            } else if (this.velocityY < 0) { // Jumping up
              this.y = platform.y + platform.height;
              this.velocityY = 0;
            }
          }
        });
      }
  
      if (this.onGround) {
        this.velocityY = 0;
      }
    }
  
    isColliding(platform) {
      return this.x < platform.x + platform.width &&
             this.x + this.width > platform.x &&
             this.y < platform.y + platform.height &&
             this.y + this.height > platform.y;
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