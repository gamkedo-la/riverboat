class Player extends Phaser.Physics.Arcade.Image {
   constructor(scene, x, y, key) {
      super(scene, x, y, key);
      this.start_x = x;
      this.start_y = y;
      this.key = key; // name of texture
      this.fuel = 1000;
      this.sideway_speed = 30;
      this.sideway_drag = 35;
      this.forward_speed = 40;
      this.backward_speed = -40;
      this.rateOfReturnToStation = 0.5;
      scene.physics.world.enable(this);
      this.setImmovable(false);
      this.setDrag(this.sideway_drag);
      this.setVelocity(0, 0);
      scene.add.existing(this);
      this.scene = scene;
   }

   update(cursors) {
      // arrow keys control
      if (this.fuel > 0) {
         this.engineNavigation(cursors);
      } else {
         console.log('Fuel empty');
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
         this.body.setVelocityX(-1 * this.sideway_speed);
         this.useFuel(1);
      }
      else if (cursors.right.isDown) {
         this.body.setVelocityX(this.sideway_speed);
         this.useFuel(1);
      }

      if (cursors.up.isDown && this.body.y > this.body.height) {
         this.body.setVelocityY(-this.forward_speed);
         this.setTint(0xffb38a);
         this.useFuel(3);
         // console.log('up key');
      }
      else if (cursors.down.isDown) {
         this.scene.booms.setVelocityY(riverSpeed / 4);
         if (this.pierPlaced) {
            this.scene.pier.setVelocityY(riverSpeed / 4);
         }
         this.setTint(0xbae946);
         this.useFuel(2);
      }
      // neither up nor down is pressed
      else {
         this.setTint(0xffffff);
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

   moveBackToStation() {
      // player's on-screen location slowly return to bottom
      this.body.setVelocityY(this.forward_speed * this.rateOfReturnToStation);
      // river furniture Y change faster to maintain relative motion
      this.scene.booms.setVelocityY(riverSpeed + this.forward_speed * this.rateOfReturnToStation);
      if (this.scene.pierPlaced) {
         this.scene.pier.setVelocityY(riverSpeed + this.forward_speed * this.rateOfReturnToStation);
      }
   }

   whenOnStation() {
      // player now on station at bottom of playarea, so...
      this.body.setVelocityY(0);
      // river furniture's relative motion needs no adjustment
      this.scene.booms.setVelocityY(riverSpeed);
      if (this.scene.pierPlaced) {
         this.scene.pier.setVelocityY(riverSpeed);
      }
   }
}
