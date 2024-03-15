class SensorCone extends Phaser.Physics.Arcade.Sprite {
   constructor(scene, x, y, key) {
      super(scene, x, y, key);
      Object.assign(this, { scene, x, y, key });
      scene.obstacles.add(this);
      scene.sensors.add(this);
      scene.physics.world.enable(this);
      this.setVisible(false);
      this.setDepth(9);
      this.setAlpha(0.5);
      this.setScale(0.7, 0.7);
      this.setVelocity(0, scene.driftSpeed);
      scene.add.existing(this);
   }
}
