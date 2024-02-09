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
   this.makeHealthDisplay();
   this.makeFuelDisplay();

   this.cursors = this.input.keyboard.createCursorKeys();

   this.physics.add.collider(player.boat, this.booms, this.boomImpact, null, this);
   // this.add.text(50, 620, `Past record: ${bestScore || 0}`, this.fontOptions)
   //    .setOrigin(0);
};

game.update = function () {
   // arrow keys control
   if (this.cursors.left.isDown) {
      player.boat.setVelocityX(-1 * player.sideway_speed);
   }
   else if (this.cursors.right.isDown) {
      player.boat.setVelocityX(player.sideway_speed);
   }
   else if (this.cursors.up.isDown && player.boat.y > player.boat.height) {
      player.boat.setVelocityY(player.forward_speed);
      player.boat.setTint(0xffa500);
   }
   else if (this.cursors.down.isDown) {
      //this.booms.setVelocityY(riverSpeed / 4);
      this.booms.setVelocityY(riverSpeed - player.backward_speed);
      player.boat.setTint(0x00ff00);
   }
   else {
      this.booms.setVelocityY(riverSpeed);
      player.boat.setTint(0xffffff);
      if (player.boat.y < player.start_y) {
         player.boat.setVelocityY(-1.1 * player.forward_speed);
      } else {
         player.boat.setVelocityY(0);
      }
   }

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
   this.progressDisplay = this.add.text(x, y, `Navigated: ${this.boomsPassed}`, { fontSize: '24px', fill: '#fff' });
   y += yLineSpacing;
   // get and display best past score
   // let boomsPassedMax = localStorage.getItem('boomsPassedMax');
   // this.maxProgressDisplay = this.add.text(x, y, `Previous best: ${boomsPassedMax || 0}`, { fontSize: '16px', fill: '#aaa' });
};

game.makeHealthDisplay = function () {
   let x = 40;
   let y = 80;
   this.healthDisplay = this.add.text(x, y, `Health: ${player.health}`, { fontSize: '24px', fill: '#fff' });
};

game.makeFuelDisplay = function () {
   let x = 40;
   let y = 120;
   this.fuelDisplay = this.add.text(x, y, `Fuel: ${player.fuel}`, { fontSize: '24px', fill: '#fff' });
};

game.updateHealth = function (damage) {
   player.health -= damage;
   this.healthDisplay.setText(`Health: ${player.health}`);
};

game.makeBooms = function () {
   this.booms = this.physics.add.group();
   for (let i = 0; i < this.booms_display; i += 1) {
      let leftBoom = this.booms.create(0, 0, 'boom')
         .setImmovable(true)
         .setOrigin(1, 0)
         .setScale(0.7);
      let rightBoom = this.booms.create(0, 0, 'boom')
         .setImmovable(true)
         .setOrigin(0, 0)
         .setScale(0.7);
      this.placeBoom(leftBoom, rightBoom);
   }
   this.booms.setVelocityY(-1 * riverSpeed);
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

   let ySpacing = Phaser.Math.Between(...this.ySpacingRange);
   let yPrevious = this.getPreviousBoom();
   let yBoom = yPrevious - ySpacing;
   leftBoom.y = yBoom;
   rightBoom.y = yBoom;
   console.log(yPrevious, ySpacing, yBoom);
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
   this.progressDisplay.setText(`Navigated: ${this.boomsPassed}`);
};

game.saveBestScore = function () {
   let bestScoreStr = localStorage.getItem('bestScore');
   let bestScore = bestScoreStr && parseInt(bestScoreStr, 10);
   if (!bestScore || this.score > bestScore) {
      localStorage.setItem('bestScore', this.score);
   }
};

game.boomImpact = function () {
   this.updateHealth(2);
   console.log(`Health: ${player.health}`);
   if (player.health <= 0) {
      this.levelOver();
   }
};

game.levelOver = function () {
   this.physics.pause();
   player.boat.setTint(0xff0000);
   this.saveBestScore();
   let y = player.boat.y - player.boat.height;
   this.pet = this.add.sprite(player.boat.x - 2, y, 'pet', 0);
   this.pet.play('faces');
   let text = this.add.text(180, 300, 'Level over', { font: '40px Arial', fill: '#ffffff' })
      .setOrigin(0.5);
   player.health = this.initialHealth;
   player.fuel = this.initialFuel;
   this.time.addEvent({
      delay: 2000,
      callback: () => {
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
   this.physics.add.collider(player.boat, this.pier, this.levelOver, null, this);
   this.pierPlaced = true;
};

game.resetGame = function () {

};