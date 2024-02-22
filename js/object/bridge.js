class Bridge extends Phaser.Physics.Arcade.Image {
   constructor(scene, x, y, texture) {
      super(scene, x, y, texture);
      Object.assign(this, { x, y, scene });
      this.scene.obstacles.add(this);
      this.scene.physics.world.enable(this);
      this.setImmovable(true);
      this.setOrigin(0, 0.5);
      this.setScale(0.9);
      this.scene.add.existing(this);
   }
}
