class Spotlight extends Phaser.Physics.Arcade.Image {
   constructor(scene, x, y, key) {
      super(scene, x, y, key);
      this.scene = scene;
      this.scene.physics.world.enable(this);

      this.scene.add.existing(this);
   }
}
