class BoomClosable extends Boom {
   constructor(scene, x, y, texture, delay, speed) {
      super(scene, x, y, texture);
      Object.assign(this, { delay, speed });

      //this.scene.obstacles.add(this);
      //this.scene.physics.world.enable(this);
      // this.setImmovable(true);
      // this.setOrigin(0, 0);
      // this.setScale(0.7);
      // this.setDepth(3);
      // this.setVelocity(0, scene.driftSpeed);
      // this.hit = false;
      // this.damage = 1;
      // this.scene.add.existing(this);
   }
}