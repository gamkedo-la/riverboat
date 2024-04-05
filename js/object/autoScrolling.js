class AutoScrollingText extends Phaser.GameObjects.Text {
   constructor(scene, x, y, text, style, scrollSpeed) {
      super(scene, x, y, text, style);
      this.scrollSpeed = scrollSpeed;
      this.setOrigin(0, 0);
      this.setFixedSize(scene.game.config.width, scene.game.config.height);
      this.scrollY = 0;
      scene.add.existing(this);
   }

   update(time, delta) {
      this.scrollY += this.scrollSpeed * delta;
      if (this.scrollY > this.height) {
         this.scrollY = -this.height;
      }
      this.setPosition(0, this.scrollY);
   }
}
