class Driftwood extends Phaser.Physics.Arcade.Sprite {
   constructor(scene, x, y, texture) {
      super(scene, x, y, texture);
      Object.assign(this, { scene, x, y });
      this.scene.obstacles.add(this);
      this.scene.physics.world.enable(this);
      this.setImmovable(true);
      this.setOrigin(0.5);
      this.setScale(1);
      this.setDepth(3);
      this.setVelocity(0, scene.driftSpeed);
      this.hit = false;
      this.damage = 3;
      this.scene.add.existing(this);
   }
}