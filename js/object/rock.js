class Rock extends Phaser.Physics.Arcade.Sprite {
   constructor(scene, x, y, texture) {
      super(scene, x, y, texture);
      Object.assign(this, { scene, x, y });
      this.scene.rocks.add(this);
      this.scene.physics.world.enable(this);
      this.setOrigin(0, 0.5);
      // only use first frame of spritesheet-shaped image
      let frameWidth = 32;
      let frameHeight = 32;
      this.setCrop(0, 0, frameWidth, frameHeight);
      this.body.setSize(frameWidth, frameHeight);
      this.body.setOffset(0, 0);
      this.setImmovable(true);
      this.setScale(1.2);
      this.setDepth(3);
      this.setVelocity(0, scene.driftSpeed);
      this.hit = false;
      this.damage = 5;
      this.scene.add.existing(this);
   }
}
