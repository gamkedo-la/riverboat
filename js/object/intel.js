class Intel extends Phaser.Physics.Arcade.Image {
   constructor(scene, x, y, texture, alpha) {
      super(scene, x, y, texture);
      Object.assign(this, { scene, x, y, alpha });
      scene.obstacles.add(this);
      scene.intels.add(this);
      scene.physics.world.enable(this);
      this.setImmovable(true);
      this.setOrigin(0.5, 0.5);
      this.setScale(0.7, 0.7);
      //console.log('in Class', alpha);
      this.setAlpha(alpha);
      scene.add.existing(this);
   }
}
