class Rock extends Phaser.Physics.Arcade.Image {
   constructor(scene, x, y, texture) {
      super(scene, x, y, texture);
      Object.assign(this, { scene, x, y });
      this.scene.obstacles.add(this);
      this.scene.rocks.add(this);
      this.scene.physics.world.enable(this);
      this.setOrigin(0, 0.5);
      // only use first frame of spritesheet-shaped image
      let frameWidth = 32
      let frameHeight = 32
      this.setCrop(0, 0, frameWidth, frameHeight);
      this.body.setSize(frameWidth, frameHeight);
      this.setImmovable(true);
      this.setScale(1.2);
      this.setDepth(3);
      this.setVelocity(0, scene.driftSpeed);
      this.hit = false;
      this.damage = 5;
      this.scene.add.existing(this);
   }
}