class Intel extends Phaser.Physics.Arcade.Image {
   constructor(scene, x, y, texture) {
      super(scene, x, y, texture);
      Object.assign(this, { scene, x, y });
      this.scene.obstacles.add(this);
      this.scene.physics.world.enable(this);
      this.setImmovable(true);
      this.setOrigin(0.5, 0.5);
      this.setScale(1);
      this.scene.add.existing(this);
   }
}