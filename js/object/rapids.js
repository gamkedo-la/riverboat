class Rapids extends Phaser.Physics.Arcade.Image {
   constructor(scene, x, y, texture) {
      super(scene, x, y, texture);
      Object.assign(this, { scene, x, y });
      this.scene.obstacles.add(this);
      this.scene.physics.world.enable(this);
      this.setImmovable(true);
      this.setOrigin(0);
      this.setScale(1.0);
      this.scene.add.existing(this);
   }
}