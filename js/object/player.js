class Player extends Phaser.Physics.Arcade.Sprite {

   constructor(scene, x, y, key, frame) {
      super(scene, x, y, key, frame);
      this.start_x = x;
      this.start_y = y;
      this.key = key; // name of texture
      this.life = 3;
      this.invincible = false;
      this.health = 10;
      this.intelScore = 0;
      this.startFuel = 99000;
      this.fuel = this.startFuel;
      this.forwardFuel = 4;
      this.backwardFuel = 2;
      this.sidewaysFuel = 0;
      this.sideway_speed = 40;
      this.sideway_drag = 120;  //35;
      this.forward_speed = 60;
      this.backward_speed = -40;
      this.forward_ratio = 2;
      this.backward_ratio = 3;
      this.engine = "off";
      this.rateOfReturnToStation = 0.5;
      scene.physics.world.enable(this);
      this.setImmovable(false);
      this.setOrigin(0.5, 1);
      this.setDrag(this.sideway_drag);
      this.setVelocity(0, 0);
      this.depth = 7;
      this.coneYoffset = 35;
      scene.add.existing(this);
      this.scene = scene;
   }

   update(cursors) {
      if (keyboard === "likely") {
         this.engineNavigation(cursors);
      } else {
         // No, this breaks motorForward()
         //   has to be integrated in pointerup somehow
         // this.checkOnStation();
      }

      if (this.fuel < 1) {
         console.log('Fuel empty');
         this.setTint(0xffffff);
         this.stopWake(); // unsure why this needs calling here but it does
      }

      // bounce off side of river
      //console.log(this.x, this.body.velocity);
      let bankLeftX = bankWidth + this.body.width / 2;
      let bankRightX = bankWidth + displayWidth - this.body.width / 2;
      if (this.x > bankRightX && this.body.velocity.x > 0) {
         //this.body.velocity.x *= -1;
         this.setVelocity(0, 0);
      }
      else if (this.x < bankLeftX && this.body.velocity.x < 0) {
         //this.body.velocity.x *= -1;
         this.setVelocity(0, 0);
      }

      // not returning to station looks out of control (which is appropriate)
      // if (this.y < this.start_y) {
      //    // boat is above its default position
      //    this.moveBackToStation();
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
         this.turnLeft();
      }
      else if (cursors.right.isDown || cursors.keyD.isDown) {
         //this.play('turnRight');
         this.turnRight();
      }

      // forward power, wake behind boat 
      // disallow if boat near top of display
      if ((cursors.up.isDown || cursors.keyW.isDown)
         && this.body.y > this.body.height && this.fuel >= this.forwardFuel) {
         this.motorForward();
      }

      // slows, reverse engine, wake inverted?
      // less engine if anchor assisted but risk snagging
      else if ((cursors.down.isDown || cursors.keyS.isDown)
         && this.fuel >= this.backwardFuel) {
         this.scene.driftSpeed = this.scene.zone.riverSpeed / this.backward_ratio;
         this.engine = "backward";
         //this.scene.obstacles.setVelocityY(this.scene.obstacleSpeed);

         if (this.pierPlaced) {
            this.scene.pier.setVelocityY(this.scene.obstacleSpeed);
         }
         this.setTint(0xbae946);
         this.useFuel(this.backwardFuel);
      }

      // neither up nor down is pressed
      // when Fuel=0 unable to release; will need explicit keyReleased handling
      else {
         this.neitherFastOrSlow();
      }
   }

   turnLeft() {
      this.body.setVelocityX(-1 * this.sideway_speed);
      this.useFuel(this.sidewaysFuel);
   }

   turnRight() {
      this.body.setVelocityX(this.sideway_speed);
      this.useFuel(this.sidewaysFuel);
   }

   motorForward() {
      //console.log(this);
      this.setTint(0xffb38a);
      this.body.setVelocityY(this.forward_speed * -1);
      this.addWake();
      this.useFuel(this.forwardFuel);
      this.scene.driftSpeed = this.scene.zone.riverSpeed * this.forward_ratio;
      this.engine = "forward";
   }

   addWake() {
      this.scene.playerWake.frequency = 50;
   }

   stopWake() {
      this.scene.playerWake.frequency = 200;
   }

   neitherFastOrSlow() {
      this.setTint(0xffffff);
      this.scene.driftSpeed = this.scene.zone.riverSpeed;
      this.engine = "off";

      if (this.scene.playerWake.visible) {
         this.stopWake();
      }
      this.checkOnStation(); // if Touch device is also called by update
   }

   checkOnStation() {
      if (this.y < this.start_y) {
         // boat is above its default position
         this.moveBackToStation();
      }
      else {
         // boat is at bottom of playarea
         this.whenOnStation();
      }
   }

   moveBackToStation() {
      // player's on-screen location slowly returns to bottom
      this.body.setVelocityY(this.forward_speed * this.rateOfReturnToStation);
      // river furniture Y change faster to maintain relative motion

      this.scene.driftSpeed = this.scene.zone.riverSpeed + this.forward_speed * this.rateOfReturnToStation;
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
      this.scene.updateHealthDisplay();
   }
}
