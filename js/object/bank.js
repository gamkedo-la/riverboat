class Bank extends Phaser.Physics.Arcade.Image {
   constructor(scene, x, y, texture) {
      super(scene, x, y, texture);
      Object.assign(this, { scene, x, y });
      this.scene.banks.add(this);
      this.scene.physics.world.enable(this);
      this.setImmovable(true);
      this.setScale(1);
      this.setDepth(2);
      this.setVelocity(0, 0);
      this.hit = false;
      this.damage = 3;
      this.scene.add.existing(this);
   }
}