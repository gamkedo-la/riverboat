class Player extends Phaser.Physics.Arcade.Image {
   constructor(scene, x, y, key, frame) {
      super(scene, x, y, key, frame);
      this.scene = scene;
      this.scene.physics.world.enable(this);
      this.setImmovable(false);
      this.start_x = displayWidth / 2;
      this.start_y = displayHeight - 90;
      this.start_health = 10;
      this.start_fuel = 1000;
      this.sideway_speed = 30;
      this.sideway_drag = 35;
      this.forward_speed = -40;
      this.backward_speed = 40;
   }

   create(scene) {
      this.health = this.start_health;
      this.fuel = this.start_fuel;
      this.setDrag(this.sideway_drag);
      this.setVelocity(0, 0);
   }

   update(cursors) {
      // arrow keys control
      if (cursors.left.isDown) {
         this.body.setVelocityX(-1 * this.sideway_speed);
         this.useFuel(1);
      }
      else if (cursors.right.isDown) {
         this.body.setVelocityX(this.sideway_speed);
         this.useFuel(1);
      }

      if (cursors.up.isDown && this.body.y > this.body.height) {
         this.body.setVelocityY(this.forward_speed);
         this.setTint(0xffb38a);
         this.useFuel(3);
         console.log('up key');
      }
      else if (cursors.down.isDown) {
         this.scene.booms.setVelocityY(riverSpeed / 4);
         this.setTint(0xbae946);
         this.useFuel(2);
         console.log('down key');
      }
      // neither up nor down is pressed
      else {
         this.scene.booms.setVelocityY(riverSpeed);
         this.setTint(0xffffff);
         if (this.y < this.start_y) {
            this.body.setVelocityY(-1 * this.forward_speed);
         } else {
            // debugger;
            this.body.setVelocityY(0);
         }
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
   }
}
