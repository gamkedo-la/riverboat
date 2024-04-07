class Player extends Phaser.Physics.Arcade.Sprite {
   constructor(scene, x, y, key, frame) {
      super(scene, x, y, key, frame);
      this.start_x = x;
      this.start_y = y;
      this.key = key; // name of texture
      if (testing) {
         this.startFuel = fuel_for_testing;
      } else {
         this.startFuel = 3000;
      }
      this.fuel = this.startFuel;
      this.life = 3;
      this.invincible = false;
      this.health = 10;
      this.intelScore = 0;
      this.forwardFuel = 4;
      this.backwardFuel = 0;
      this.sidewaysFuel = 0;
      this.sideway_speed = 40;
      this.sideway_drag = 120;  //35;
      this.forward_speed = 60;
      this.backward_speed = -40;
      this.forward_ratio = 2;
      this.backward_ratio = 3;
      this.engine = "off";
      this.spyingNow = false;
      this.invincible = false;
      this.cone_show_distance = 180;
      this.cone_hide_distance = 30;
      this.rateOfReturnToStation = 0.5;
      scene.physics.world.enable(this);
      this.setImmovable(false);
      this.setOrigin(0.5, 1);
      this.setDrag(this.sideway_drag);
      this.setVelocity(0, 0);
      this.depth = 7;
      this.coneYoffset = 35;
      this.body.setSize(9, 59, false);
      this.body.setOffset(11, 3);
      this.mainHull = null;
      this.outriggers = null;
      this.setupMotorSound();
      scene.add.existing(this);
      this.scene = scene;
   }

   create() {
      let x = this.start_x;
      let y = this.start_y;
      this.playerContainer = this.scene.add.container(x, y);

      this.mainHull = this.scene.physics.add.sprite(x, y - 29, 'main_hull_hitbox');
      this.outriggers = this.scene.physics.add.sprite(x, y - 26, 'outriggers_hitbox');
      //console.log(this.mainHull);
      //console.log(this.outriggers);

      this.playerContainer.add(this.mainHull);
      this.playerContainer.add(this.outriggers);

      //this.scene.physics.world.enable([this.mainHull, this.outriggers]);
      this.scene.physics.world.enable(this.outriggers);
      this.scene.physics.world.enable(this.mainHull);

      this.scene.add.existing(this.outriggers);
      this.scene.add.existing(this.mainHull);

      this.mainHull.body.setImmovable(true);
      this.outriggers.body.setImmovable(true);

      this.mainHull.setVisible(false);
      this.outriggers.setVisible(false);

      this.scene.boatHitbox.add(this.outriggers);
      this.scene.boatHitbox.add(this.mainHull);
      //this.scene.boatHitbox.add(this);
      // boat physics body is cropped to main hull but including Player object in hitbox group update causes weird errors
   }

   setupMotorSound() {
      // fade in and out
      // note: currently unused - it sounded better without it
      this.motorVolumeMin = 0.07;  // 0.1 or 0.25; devMotorVolume
      this.motorVolumeMax = 0.5;
      this.motorVolumeChangeSpeed = 0.01;

      // vroom vroom the pitch
      this.motorSamplerateMin = 0.75;
      this.motorSamplerateMax = 1.5;
      this.motorSamplerateChangeSpeed = 0.015;

      // init
      this.motorSound = this.scene.sound.add('snd_motorLoop', { volume: this.motorVolumeMin, loop: true });
      this.motorSound.play();
   }

   update(cursors) {
      if (keyboard === "likely") {
         this.engineNavigation(cursors);
      }

      if (this.fuel < 1) {
         // console.log('Fuel empty');
         this.setTint(0xffffff);
         this.stopWake(); // unsure why this needs calling here but it does
      }

      // bounce off banks of river
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

      this.playerContainer.x = this.x;
      this.playerContainer.y = this.y;
      // this.playerContainer.angle = this.angle;
      this.mainHull.x = this.playerContainer.x;
      this.mainHull.y = this.playerContainer.y - 29;
      this.outriggers.x = this.playerContainer.x;
      this.outriggers.y = this.playerContainer.y - 26;

      this.playerContainer.setAngle(this.body.angle);
      this.mainHull.setAngle(this.body.angle);
      this.outriggers.setAngle(this.body.angle);

      // not returning to station looks out of control (which is appropriate)
      // if (this.y < this.start_y) {
      //    // boat is above its default position
      //    this.moveBackToStation();
      // }
   }

   setBoatVelocity(x, y) {
      // console.log(this.mainHull);
      if (x === null) {
         this.body.setVelocityY(y);
         this.mainHull.body.setVelocityY(y);
         this.outriggers.setVelocityY(y);
      }
      else if (y === null) {
         this.body.setVelocityX(x);
         this.mainHull.setVelocityX(x);
         this.outriggers.setVelocityX(x);
      }
      else {
         this.body.setVelocity(x, y);
         this.mainHull.setVelocity(x, y);
         this.outriggers.setVelocity(x, y);
      }
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
      else {
         this.straightenUp();
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
         this.slowAgainstFlow();
      }

      // neither up nor down is pressed
      // when Fuel=0 unable to release; will need explicit keyReleased handling
      else {
         this.neitherFastOrSlow();
      }
   }

   turnLeft() {
      // this.body.setVelocityX(-1 * this.sideway_speed);
      this.setBoatVelocity(-1 * this.sideway_speed, null);
      this.setAngle(-10);
      this.useFuel(this.sidewaysFuel);
   }

   turnRight() {
      this.body.setVelocityX(this.sideway_speed);
      this.setAngle(10);
      this.useFuel(this.sidewaysFuel);
   }

   straightenUp() {
      this.setAngle(0);
   }

   motorForward() {
      // tint same colour as Fuel display
      this.setTint(0xff0000); // was 0xffb38a
      this.body.setVelocityY(this.forward_speed * -1);
      this.addWake();
      this.scene.driftSpeed = this.scene.riverSpeed * this.forward_ratio;
      this.engine = "forward";
      this.useFuel(this.forwardFuel);
   }

   slowAgainstFlow() {
      // tint same colour as Fuel display
      this.setTint(0x7FFFD4); // was ff00ff, bae946
      this.scene.driftSpeed = this.scene.riverSpeed / this.backward_ratio;
      this.engine = "backward";
      this.useFuel(this.backwardFuel);

      this.motorSound.rate += this.motorSamplerateChangeSpeed;
      if (this.motorSound.rate > this.motorSamplerateMax) this.motorSound.rate = this.motorSamplerateMax;
   }

   addWake() {
      // fade in volume
      // this.motorSound.volume += this.motorVolumeChangeSpeed;
      // if (this.motorSound.volume > this.motorVolumeMax) this.motorSound.volume = this.motorVolumeMax;
      // rev up sound loop      
      this.motorSound.rate += this.motorSamplerateChangeSpeed;
      if (this.motorSound.rate > this.motorSamplerateMax) this.motorSound.rate = this.motorSamplerateMax;

      this.scene.playerWake.frequency = 50;
   }

   stopWake() {
      // fade out volume
      // this.motorSound.volume -= this.motorVolumeChangeSpeed;
      // if (this.motorSound.volume < this.motorVolumeMin) this.motorSound.volume = this.motorVolumeMin;
      // rev down sound loop      
      this.motorSound.rate -= this.motorSamplerateChangeSpeed;
      if (this.motorSound.rate < this.motorSamplerateMin) this.motorSound.rate = this.motorSamplerateMin;

      this.scene.playerWake.frequency = 200;
   }

   neitherFastOrSlow() {
      this.setTint(0xffffff);
      this.scene.driftSpeed = this.scene.riverSpeed;

      if (this.engine === "backward") {
         this.motorSound.rate -= this.motorSamplerateChangeSpeed;
         if (this.motorSound.rate < 0) this.motorSound.rate = 0;
      }

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
      this.setBoatVelocity(null, this.forward_speed * this.rateOfReturnToStation);

      // river furniture Y change faster to maintain relative motion
      this.scene.driftSpeed = this.scene.riverSpeed + this.forward_speed * this.rateOfReturnToStation;
      //this.scene.obstacles.setVelocityY(this.scene.obstacleSpeed);
   }

   whenOnStation() {
      // player now on station at bottom of playarea, so...
      this.body.setVelocityY(0);
      this.setBoatVelocity(null, 0);
      // river furniture's relative motion needs no adjustment
      //this.scene.driftSpeed = scene.driftSpeed;
      //this.scene.obstacles.setVelocityY(this.scene.obstacleSpeed);
   }

   updateHealth(damage) {
      this.health -= damage;
      this.scene.updateHealthDisplay();
   }
}
