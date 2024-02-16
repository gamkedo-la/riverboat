class Game extends Phaser.Scene {
   constructor() {
      super('Game');
   }

   init() {
      this.booms_display = 3;
      this.ySpacingRange = [250, 350];
      this.boomGapRange = [80, 140];
      this.boom_length_min = 50; // 50 normal, 100 for easy path
      this.displayWidth = this.sys.config.width;
      this.displayHeight = this.sys.config.height;
      this.fontSize = 16;
      this.lineHeight = 70;
      this.fontOptions = { fontSize: `${this.fontSize}px`, fill: '#999' };
      this.boomsPassed = 0;
      this.boomsToGoal = 7; // 0 or 1 if testing pier
      this.boomsPassedMax = localStorage.getItem('boomsPassedMax');
      this.pierPlaced = false;
      this.levelOver = false;
   };

   create() {
      this.cameras.main.setBackgroundColor(0x0000ff);

      this.boomCollideSound = this.sound.add('snd_boomCollide', { volume: 0.5 });

      let start_x = displayWidth / 2;
      let start_y = displayHeight - 90;
      this.player = new Player(this, start_x, start_y, 'boat');

      this.playerWake = this.physics.add.image(0, 0, 'wake');
      // this.player.addChild(this.playerWake);
      this.playerWake.visible = false;

      this.makeBooms();

      if (this.checkIfReachedPier()) {
         this.makePier();
         this.pierPlaced = true;
      }

      this.makeProgressDisplay();
      this.makeFuelDisplay();

      this.cursors = this.input.keyboard.createCursorKeys();

      this.physics.add.collider(this.player, this.booms, this.endLevel, null, this);

      this.input.keyboard.on('keyup', this.anyKey, this);
   };

   update() {
      if (this.levelOver) return;

      this.player.update(this.cursors);

      this.updateFuelDisplay();

      this.recycleBoom();
   };

   makeProgressDisplay() {
      let x = 40;
      let y = 40;
      let yLineSpacing = 32;
      this.score = 0;
      this.progressDisplay = this.add.text(x, y, `Passed: ${this.boomsPassed}`, { fontSize: '24px', fill: '#fff' });
      y += yLineSpacing;
   };

   makeFuelDisplay() {
      let x = 40;
      let y = 80;
      this.fuelDisplay = this.add.text(x, y, `Fuel: ${this.player.fuel}`, { fontSize: '24px', fill: '#fff' });
   };

   updateFuelDisplay() {
      if (this.player.fuel) {
         this.fuelDisplay.setText(`Fuel: ${this.player.fuel}`);
      }
   };

   makeBooms() {
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

   placeBoom(leftBoom, rightBoom) {
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

   recycleBoom() {
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

   getPreviousBoom() {
      let yPrevious = 800;
      this.booms.getChildren().forEach(boom => {
         yPrevious = Math.min(boom.y, yPrevious);
      });
      return yPrevious;
   };

   trackProgress() {
      this.boomsPassed += 1;
      this.progressDisplay.setText(`Passed: ${this.boomsPassed}`);
   };

   saveBestScore() {
      let bestScoreStr = localStorage.getItem('bestScore');
      let bestScore = bestScoreStr && parseInt(bestScoreStr, 10);
      if (!bestScore || this.score > bestScore) {
         localStorage.setItem('bestScore', this.score);
      }
   };

   // if player health, but multiple hits on impact is a problem
   boomImpact(boat, boom) {
      //console.log(this);
      this.setBoomSpeed(0); // doesnt help, boat pushed down by boom
      if (!boom.hit) {
         console.log('Boom Hit');
         boom.hit = true;
         this.updateHealth(boom.damage);
         if (this.player.health <= 0) {
            this.endLevel();
         }
      }
   };

   setBoomSpeed(speed) {
      this.booms.children.iterate((boom) => {
         boom.setVelocityY(speed);
      });
   };

   endLevel() {
      this.levelOver = true;
      this.player.setTint(0xff0000);
      this.boomCollideSound.play();
      this.physics.pause();
      //this.saveBestScore();

      this.time.addEvent({
         delay: 1000,
         callback: () => {
            let x = this.player.x - 2;
            let y = this.player.y - 10;
            this.explosion = this.add.sprite(x, y, 'anim_placeholderExplosion', 0);
            this.explosion.play('explode');
            let text = this.add.text(180, 300, 'Level over', { font: '40px Arial', fill: '#ffffff' }).setOrigin(0.5);
         },
         loop: false
      });

      this.time.addEvent({
         delay: 2500,
         callback: () => {
            this.player.health = this.player.initialHealth;
            this.player.fuel = this.player.initialFuel;
            this.levelOver = false;
            this.scene.restart();
         },
         loop: false
      });
   };

   checkIfReachedPier() {
      if (!this.pierPlaced && this.boomsPassed >= this.boomsToGoal) {
         return true;
      }
   };

   makePier() {
      this.pier = this.physics.add.sprite(displayWidth / 2, -40, 'pier')
         .setScale(0.8);
      this.pier.setVelocityY(riverSpeed);
      this.physics.add.collider(this.player, this.pier, this.endLevel, null, this);
      this.pierPlaced = true;
   };

   resetGame() {
   };

   anyKey(event) {
      let code = event.keyCode;
      if (code === Phaser.Input.Keyboard.KeyCodes.ESC) {
         this.scene.start('Home');
      }
      else if (code === Phaser.Input.Keyboard.KeyCodes.P) {
         this.scene.pause('Game');
         // cannot resume scene but good enough to stop motion and sounds while coding without having to close and later re-open browser tab.
      }
   };
}
