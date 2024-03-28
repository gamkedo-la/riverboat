class Searchlight extends Phaser.Physics.Arcade.Sprite {
   constructor(scene, x, y, key, bank) {
      super(scene, x, y, key);
      Object.assign(this, { scene, x, y, key, bank });
      scene.obstacles.add(this);
      scene.lights.add(this);
      scene.physics.world.enable(this);
      this.setImmovable(false);
      this.setDepth(90);
      this.x = gameWidth / 2;
      this.setAlpha(0.3);
      this.body.setDrag(0);
      this.setVelocity(scene.zone.searchlight.patrolSpeed, scene.driftSpeed);
      this.landSearchX = 20;
      this.lightAngleContraint = 150;
      scene.add.existing(this);
      // console.log('speed', scene.zone.searchlight.patrolSpeed, scene.driftSpeed);
      // console.log(`light velocity when created: ${this.body.velocity.x}, ${this.body.velocity.y}`);
   }

   update() {
      //console.log('searchlight', this.x, this.y, this.body.velocity.x, this.body.velocity.y);
      let bankLeftX = bankWidth;
      let bankRightX = bankWidth + displayWidth;
      if (this.bank === 'right') {
         if (this.x > bankRightX + this.landSearchX && this.body.velocity.x > 0) {
            this.body.velocity.x *= -1;
         }
         else if (this.x < bankLeftX + this.lightAngleContraint && this.body.velocity.x < 0) {
            this.body.velocity.x *= -1;
         }
      }
      else if (this.bank === 'left') {
         if (this.x > bankRightX - this.lightAngleContraint && this.body.velocity.x > 0) {
            this.body.velocity.x *= -1;
         }
         else if (this.x < bankLeftX - this.landSearchX && this.body.velocity.x < 0) {
            this.body.velocity.x *= -1;
         }
      }
   }
};
