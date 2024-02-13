let game = new Phaser.Scene('Game');

game.init = function () {
   this.booms_display = 3;
   this.ySpacingRange = [250, 350];
   this.boomGapRange = [80, 140];
   this.boom_length_min = 50;
   this.displayWidth = this.sys.config.width;
   this.displayHeight = this.sys.config.height;
   this.fontSize = 16;
   this.lineHeight = 70;
   this.fontOptions = { fontSize: `${this.fontSize}px`, fill: '#999' };
   this.boomsPassed = 0;
   this.boomsToGoal = 1;
   this.boomsPassedMax = localStorage.getItem('boomsPassedMax');
   this.pierPlaced = false;
   this.levelOver = false;
};

game.create = function () {
   this.cameras.main.setBackgroundColor(0x0000ff);

   player.create(this);

   this.makeBooms();

   if (this.checkIfReachedPier()) {
      this.makePier();
      this.pierPlaced = true;
   }

   this.makeProgressDisplay();
   this.makeFuelDisplay();

   this.cursors = this.input.keyboard.createCursorKeys();

   this.physics.add.collider(player.boat, this.booms, this.endLevel, null, this);

   this.input.keyboard.on('keyup', this.anyKey, this);
};

game.update = function () {
   if (this.levelOver) return;
   // arrow keys control
   if (this.cursors.left.isDown) {
      player.boat.setVelocityX(-1 * player.sideway_speed);
      player.useFuel(1);
   }
   else if (this.cursors.right.isDown) {
      player.boat.setVelocityX(player.sideway_speed);
      player.useFuel(1);
   }

   if (this.cursors.up.isDown && player.boat.y > player.boat.height) {
      player.boat.setVelocityY(player.forward_speed);
      player.boat.setTint(0xffb38a);
      player.useFuel(3);
      console.log('up key');
   }
   else if (this.cursors.down.isDown) {
      this.booms.setVelocityY(riverSpeed - player.backward_speed);
      player.boat.setTint(0xbae946);
      player.useFuel(2);
      console.log('down key');
   }
   // neither up nor down is pressed
   else {
      this.booms.setVelocityY(riverSpeed);
      player.boat.setTint(0xffffff);
      if (player.boat.y < player.start_y) {
         player.boat.setVelocityY(-1 * player.forward_speed);
      } else {
         player.boat.setVelocityY(0);
      }
   }
   this.updateFuelDisplay();

   this.recycleBoom();

   // bounce off side of river
   if (player.boat.x > 360 - player.boat.width / 2 && player.boat.body.velocity.x > 0) {
      player.boat.body.velocity.x *= -1;
   }
   else if (player.boat.x < player.boat.width / 2 && player.boat.body.velocity.x < 0) {
      player.boat.body.velocity.x *= -1;
   }
};

game.makeProgressDisplay = function () {
   let x = 40;
   let y = 40;
   let yLineSpacing = 32;
   this.score = 0;
   this.progressDisplay = this.add.text(x, y, `Passed: ${this.boomsPassed}`, { fontSize: '24px', fill: '#fff' });
   y += yLineSpacing;
};

game.makeFuelDisplay = function () {
   let x = 40;
   let y = 80;
   this.fuelDisplay = this.add.text(x, y, `Fuel: ${player.fuel}`, { fontSize: '24px', fill: '#fff' });
};

game.updateFuelDisplay = function () {
   if (player.fuel) {
      this.fuelDisplay.setText(`Fuel: ${player.fuel}`);
   }
};

game.makeBooms = function () {
   this.booms = this.physics.add.group();
   for (let i = 0; i < this.booms_display; i += 1) {
      let leftBoom = this.booms.create(0, 0, 'boom')
         .setImmovable(true)
         .setOrigin(1, 0)
         .setScale(0.7);
      leftBoom.damage = 2;
      let rightBoom = this.booms.create(0, 0, 'boom')
         .setImmovable(true)
         .setOrigin(0, 0)
         .setScale(0.7);
      rightBoom.damage = 2;
      this.placeBoom(leftBoom, rightBoom);
   }
   this.setBoomSpeed(-1 * riverSpeed);

   this.booms.children.iterate(function (boom) {
      // boom.y += 200; // move early obstacles into view
      boom.y += 600; // too low, for quick testing
   });
};

game.placeBoom = function (leftBoom, rightBoom) {
   // gap between left and right booms
   let gapSize = Phaser.Math.Between(...this.boomGapRange);
   // left side of gap's X coordinate i.e. right edge of left boom
   let gapLeftMin = this.boom_length_min;
   let gapLeftMax = 360 - gapSize - this.boom_length_min;
   let gapLeftRange = [gapLeftMin, gapLeftMax];
   let xGapLeft = Phaser.Math.Between(...gapLeftRange);
   leftBoom.x = xGapLeft;
   rightBoom.x = xGapLeft + gapSize;

   let yPrevious = this.getPreviousBoom();
   let ySpacing = Phaser.Math.Between(...this.ySpacingRange);
   let yBoom = yPrevious - ySpacing;
   leftBoom.y = yBoom;
   rightBoom.y = yBoom;
};

game.recycleBoom = function () {
   //if (this.pierPlaced) return; // does the run carry on after pier?
   let tempBooms = [];
   this.booms.getChildren().forEach(boom => {
      if (boom.getBounds().top > displayHeight) {
         tempBooms.push(boom);
         if (tempBooms.length === 2) {
            this.placeBoom(...tempBooms);
            this.trackProgress();
            this.saveBestScore();
            if (!this.pierPlaced) {
               if (this.checkIfReachedPier()) {
                  this.makePier();
                  this.pierPlaced = true;
               }
            }
         }
      }
   });
};

game.getPreviousBoom = function () {
   let yPrevious = 800;
   this.booms.getChildren().forEach(boom => {
      yPrevious = Math.min(boom.y, yPrevious);
   });
   return yPrevious;
};

game.trackProgress = function () {
   this.boomsPassed += 1;
   this.progressDisplay.setText(`Passed: ${this.boomsPassed}`);
};

game.saveBestScore = function () {
   let bestScoreStr = localStorage.getItem('bestScore');
   let bestScore = bestScoreStr && parseInt(bestScoreStr, 10);
   if (!bestScore || this.score > bestScore) {
      localStorage.setItem('bestScore', this.score);
   }
};

game.boomImpact = function (boat, boom) {
   //console.log(this);
   this.setBoomSpeed(0); // doesnt help, boat pushed down by boom
   if (!boom.hit) {
      console.log('Boom Hit');
      boom.hit = true;
      this.updateHealth(boom.damage);
      if (player.health <= 0) {
         this.endLevel();
      }
   }
};

game.setBoomSpeed = function (speed) {
   this.booms.children.iterate((boom) => {
      boom.setVelocityY(speed);
   });
};

game.endLevel = function () {
   this.levelOver = true;
   player.boat.setTint(0xff0000);
   this.physics.pause();
   //this.saveBestScore();

   let text = this.add.text(180, 300, 'Level over', { font: '40px Arial', fill: '#ffffff' })
      .setOrigin(0.5);

   this.time.addEvent({
      delay: 1000,
      callback: () => {
         let x = player.boat.x - 2;
         let y = player.boat.y - 10;
         this.explosion = this.add.sprite(x, y, 'orange', 0);
         this.explosion.play('explode');
      },
      loop: false
   });

   this.time.addEvent({
      delay: 2500,
      callback: () => {
         player.health = this.initialHealth;
         player.fuel = this.initialFuel;
         this.levelOver = false;
         this.scene.restart();
      },
      loop: false
   });
};

game.checkIfReachedPier = function () {
   if (!this.pierPlaced && this.boomsPassed >= this.boomsToGoal) {
      return true;
   }
};

game.makePier = function () {
   this.pier = this.physics.add.sprite(displayWidth / 2, -40, 'pier')
      .setScale(0.8);
   this.pier.setVelocityY(-1 * riverSpeed);
   this.physics.add.collider(player.boat, this.pier, this.endLevel, null, this);
   this.pierPlaced = true;
};

game.resetGame = function () {
};

game.anyKey = function (event) {
   let code = event.keyCode;
   if (code === Phaser.Input.Keyboard.KeyCodes.ESC) {
      this.scene.start('Home');;
   }
};