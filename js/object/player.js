// class Player extends Phaser.Physics.Arcade.Image {
class Player extends Phaser.Physics.Arcade.Sprite {

   constructor(scene, x, y, key, frame) {
      super(scene, x, y, key, frame);
      this.start_x = x;
      this.start_y = y;
      this.key = key; // name of texture
      this.health = 10;
      this.fuel = 2000;
      this.forwardFuel = 4;
      this.backwardFuel = 2;
      this.sidewaysFuel = 1;
      this.sideway_speed = 30;
      this.sideway_drag = 120;  //35;
      this.forward_speed = 40;
      this.backward_speed = -40;
      this.engine = "off";
      this.rateOfReturnToStation = 0.5;
      scene.physics.world.enable(this);
      this.setImmovable(false);
      this.setOrigin(0.5, 1);
      this.setDrag(this.sideway_drag);
      this.setVelocity(0, 0);
      this.depth = 7;
      scene.add.existing(this);
      this.scene = scene;
   }

   update(cursors) {
      // a bug fuel sticks at 1
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
      // if (this.x > 360 - this.body.width / 2 && this.body.velocity.x > 0) {
      //    this.body.velocity.x *= -1;
      // }
      // else if (this.x < this.body.width / 2 && this.body.velocity.x < 0) {
      //    this.body.velocity.x *= -1;
      // }
   }

   useFuel(usage) {
      this.fuel -= usage;
      if (this.fuel < 0) {
         this.fuel = 0;
         // poke display in case that doesnt get called when zero fuel
         this.scene.updateFuelDisplay();
      }
   }

   engineNavigation(cursors) {
      if (cursors.left.isDown || cursors.keyA.isDown) {

         this.play('turnLeft');
         this.body.setVelocityX(-1 * this.sideway_speed);
         this.useFuel(this.sidewaysFuel);
      }
      else if (cursors.right.isDown || cursors.keyD.isDown) {
         this.play('turnRight');
         this.body.setVelocityX(this.sideway_speed);
         this.useFuel(this.sidewaysFuel);
      }

      // forward power, wake behind boat 
      // disallow if boat near top of display
      if ((cursors.up.isDown || cursors.keyW.isDown)
         && this.body.y > this.body.height && this.fuel >= this.forwardFuel) {
         this.body.setVelocityY(-this.forward_speed);
         this.setTint(0xffb38a);
         this.addWake();
         this.useFuel(this.forwardFuel);

         // in case current obstacle speed needed in scene, made available
         this.scene.driftSpeed = riverSpeed * 2;
         //this.scene.obstacles.setVelocityY(this.scene.obstacleSpeed);
         this.engine = "forward";
      }

      // slows, reverse engine, wake inverted?
      // less engine if anchor assisted but risk snagging
      else if ((cursors.down.isDown || cursors.keyS.isDown)
         && this.fuel >= this.backwardFuel) {
         this.scene.driftSpeed = riverSpeed / 4;
         //this.scene.obstacles.setVelocityY(this.scene.obstacleSpeed);

         if (this.pierPlaced) {
            this.scene.pier.setVelocityY(this.scene.obstacleSpeed);
         }
         this.setTint(0xbae946);
         this.useFuel(this.backwardFuel);
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
      this.scene.playerWake.y = this.y - 10;
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

      this.scene.driftSpeed = riverSpeed + this.forward_speed * this.rateOfReturnToStation;
      //this.scene.obstacles.setVelocityY(this.scene.obstacleSpeed);

      // pier code will move to Pier object
      if (this.scene.pierPlaced) {
         this.scene.pier.setVelocityY(this.scene.obstacleSpeed);
      }
   }

   whenOnStation() {
      // player now on station at bottom of playarea, so...
      this.body.setVelocityY(0);
      // river furniture's relative motion needs no adjustment
      //this.scene.driftSpeed = scene.driftSpeed;
      //this.scene.obstacles.setVelocityY(this.scene.obstacleSpeed);

      // pier code will move to Pier object
      if (this.scene.pierPlaced) {
         this.scene.pier.setVelocityY(this.scene.obstacleSpeed);
      }
   }

   updateHealth(damage) {
      this.health -= damage;
   }
}
