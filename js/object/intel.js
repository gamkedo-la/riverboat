class Intel extends Phaser.Physics.Arcade.Image {
   constructor(scene, x, y, texture) {
      super(scene, x, y, texture);
      Object.assign(this, { scene, x, y });
      scene.obstacles.add(this);
      scene.intels.add(this);
      scene.physics.world.enable(this);
      this.setImmovable(true);
      this.setOrigin(0.5, 0.5);
      this.setAlpha(0.7);
      this.setScale(0.7, 0.7);
      scene.add.existing(this);
   }
}
