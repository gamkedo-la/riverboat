class SensorCone extends Phaser.Physics.Arcade.Sprite {
   constructor(scene, x, y, key) {
      super(scene, x, y, key);
      Object.assign(this, { scene, x, y, key });
      scene.sensors.add(this);
      scene.physics.world.enable(this);
      this.setVisible(false);
      this.setOrigin(0, 0.5);
      this.setDepth(9);
      this.setAlpha(0.5);
      this.setScale(0.7, 0.7);
      this.setImmovable(true);
      scene.add.existing(this);
   }

   show(x, y) {
      this.x = x;
      this.y = y;
      this.setVisible(true);
   }

   hide() {
      // this.x = -100; // off-screen
      // this.y = -100; // off-screen
      this.setVisible(false);
   }
}
