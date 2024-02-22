// class Player extends Phaser.Physics.Arcade.Image {
class Player extends Phaser.Physics.Arcade.Sprite {

   constructor(scene, x, y, key, frame) {
      super(scene, x, y, key, frame);
      this.start_x = x;
      this.start_y = y;
      this.key = key; // name of texture
      this.fuel = 2000;
      this.sideway_speed = 30;
      this.sideway_drag = 35;
      this.forward_speed = 40;
      this.backward_speed = -40;
      this.engine = "off";
      this.rateOfReturnToStation = 0.5;
      scene.physics.world.enable(this);
      this.setImmovable(false);
      this.setDrag(this.sideway_drag);
      this.setVelocity(0, 0);
      scene.add.existing(this);
      this.scene = scene;
   }

   update(cursors) {
      // should be test > 0, but a bug fuel sticks at 1
      if (this.fuel > 0) {
         // arrow keys control
         this.engineNavigation(cursors);
      } else {
         console.log('Fuel empty');
         // this.scene.updateFuelDisplay(); // already called in Game update
         this.setTint(0xffffff);
         this.stopWake(); // unsure why this needs calling here but it does

         // not returning to station looks out of control (which is appropriate)
         // if (this.y < this.start_y) {
         //    // boat is above its default position
         //    this.moveBackToStation();
         // }
      }

      // bounce off side of river
      if (this.x > 360 - this.body.width / 2 && this.body.velocity.x > 0) {
         this.body.velocity.x *= -1;
      }
      else if (this.x < this.body.width / 2 && this.body.velocity.x < 0) {
         this.body.velocity.x *= -1;
      }
   }

   useFuel(usage) {
      this.fuel -= usage;
      if (this.fuel < 0) this.fuel = 0;
   }

   engineNavigation(cursors) {
      if (cursors.left.isDown) {

         this.play('turnLeft');
         this.body.setVelocityX(-1 * this.sideway_speed);
         this.useFuel(1);
      }
      else if (cursors.right.isDown) {
         this.play('turnRight');
         this.body.setVelocityX(this.sideway_speed);
         this.useFuel(1);
      }

      // forward power, wake behind boat 
      // disallow if boat near top of display
      if (cursors.up.isDown && this.body.y > this.body.height && this.fuel >= 4) {
         this.body.setVelocityY(-this.forward_speed);
         this.setTint(0xffb38a);
         this.addWake();
         this.useFuel(4);
         this.scene.obstacles.setVelocityY(riverSpeed * 2);
         this.engine = "forward";
      }

      // slows, reverse engine, wake inverted?
      // less engine if anchor assisted but risk snagging
      else if (cursors.down.isDown && this.fuel >= 2) {
         this.scene.obstacles.setVelocityY(riverSpeed / 4);
         if (this.pierPlaced) {
            this.scene.pier.setVelocityY(riverSpeed / 4);
         }
         this.setTint(0xbae946);
         this.useFuel(2);
      }

      // neither up nor down is pressed
      else {
         this.setTint(0xffffff);

         if (this.scene.playerWake.visible) {
            this.stopWake();
            // this.scene.wake.body.setVelocityY(0);
            // this.scene.wake.destroy();
            // earlier effort revealed a 2nd ghost wake but with transparency
            // which was affected by setVelocity() and destroy() while the
            // bulkier wake was not: maybe something how Arcade Physics handles
            // transparency that I don't yet understand.
         }

         if (this.y < this.start_y) {
            // boat is above its default position
            this.moveBackToStation();
         }
         else {
            // boat is at bottom of playarea
            this.whenOnStation();
         }
      }
   }

   addWake() {
      this.scene.playerWake.x = this.x - 4;
      this.scene.playerWake.y = this.y + this.body.height;
      this.scene.playerWake.visible = true;
      this.scene.playerWake.setVelocityY(-this.forward_speed);
      // this.wake = this.addChild(this.add.image(0, this.body.height, 'wake'));
      // this.scene.wake = this.scene.physics.add.image(this.x, this.y + this.body.height, 'wake').setVelocityY(-this.forward_speed);
   }

   stopWake() {
      this.scene.playerWake.visible = false;
      this.scene.playerWake.setVelocityY(0);
   }

   moveBackToStation() {
      // player's on-screen location slowly returns to bottom
      this.body.setVelocityY(this.forward_speed * this.rateOfReturnToStation);
      // river furniture Y change faster to maintain relative motion
      this.scene.obstacles.setVelocityY(riverSpeed + this.forward_speed * this.rateOfReturnToStation);

      if (this.scene.pierPlaced) {
         this.scene.pier.setVelocityY(riverSpeed + this.forward_speed * this.rateOfReturnToStation);
      }
   }

   whenOnStation() {
      // player now on station at bottom of playarea, so...
      this.body.setVelocityY(0);
      // river furniture's relative motion needs no adjustment
      this.scene.obstacles.setVelocityY(riverSpeed);
      if (this.scene.pierPlaced) {
         this.scene.pier.setVelocityY(riverSpeed);
      }
   }
}
