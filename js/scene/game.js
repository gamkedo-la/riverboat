// import Phaser from '../lib/phaser.js';
// console.dir(Phaser);

class Game extends Phaser.Scene {
   constructor() {
      super('Game');
   }

   init() {
      this.banks = this.physics.add.group({ runChildUpdate: true });

      this.obstacles = this.physics.add.group({ runChildUpdate: true });
      this.obstacle_types = ['boom', 'secret', 'bridge', 'rapids'];
      this.obstacle_chances = [0, 1, 0, 0.0]; // demo
      // Rapids cannot be used until overlap instead of collider
      // this.obstacle_chances = [0.6, 0.2, 0.1, 0.1]; // game-plausible

      this.spawnY = -100;  //-70;
      this.ySpacingRange = [240, 320];
      this.ySpacing = Phaser.Math.Between(...this.ySpacingRange);

      this.obstaclesPassed = 0;
      this.obstaclesToGoal = 7; // 0 or 1 if testing pier
      this.obstaclesPassedMax = localStorage.getItem('obstaclesPassedMax');

      this.boomGapRange = [80, 140];
      this.boom_length_min = 50; // 50 normal, 100 for easy path

      this.displayWidth = this.sys.config.width;
      this.displayHeight = this.sys.config.height;
      this.fontSize = 16;
      this.lineHeight = 70;
      this.fontOptions = { fontSize: `${this.fontSize}px`, fill: '#999' };

      this.pierPlaced = false;
      this.levelOver = false;

      this.obstacleMaker = {
         boom: () => {
            return this.makeBooms();
         },
         secret: () => {
            return this.makeSecret();
         },
         bridge: () => {
            return this.makeBridge();
         },
         rapids: () => {
            return this.makeRapids();
         },
      };

      this.placeObstaclesX = {
         boom: (obstacleSprites) => {
            this.placeBooms(...obstacleSprites);
         },
         secret: (obstacleSprites) => {
            this.placeSecret(...obstacleSprites);
         },
         bridge: (obstacleSprites) => {
            this.placeBridge(...obstacleSprites);
         },
         rapids: (obstacleSprites) => {
            this.placeRapids(...obstacleSprites);
         },
      };
   };

   create() {
      this.physics.world.bounds.width = gameWidth; // works without these?
      this.physics.world.bounds.height = displayHeight;

      this.makeBanks();
      this.makePlayer();
      this.setupXscroll();
      this.makeHud();

      this.boomCollideSound = this.sound.add('snd_boomCollide', { volume: 0.5 });

      // create first 2 obstacles, using same method as update()
      this.makeObstacle();
      this.ySpacing = Phaser.Math.Between(...this.ySpacingRange);
      this.obstacles.incY(this.ySpacing + 1);
      this.makeObstacle();

      if (this.checkIfReachedPier()) {
         this.makePier();
         this.pierPlaced = true;
      }

      this.cursors = this.input.keyboard.createCursorKeys();
      // add W,A,S,D to cursors so they work in addition to the arrow keys
      this.cursors.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
      this.cursors.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
      this.cursors.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
      this.cursors.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);

      this.physics.add.collider(this.player, this.obstacles, this.endLevel, null, this);
      this.physics.add.collider(this.player, this.banks, this.endLevel, null, this);
      this.input.keyboard.on('keyup', this.anyKey, this);
   };

   update() {
      if (this.levelOver) return;

      this.player.update(this.cursors);

      this.updateFuelDisplay();

      this.destroyPassedObstacle();

      this.testIfReadyForNextObstacle();
   };

   makeHud() {
      this.hud = this.add.container(0, 0);
      this.hud.setScrollFactor(0);
      this.makeProgressDisplay();
      this.makeFuelDisplay();
   }

   setupXscroll() {
      this.cameras.main.setBounds(0, 0, gameWidth, displayHeight);
      this.cameras.main.setBackgroundColor(0x0000ff);
      this.cameras.main.startFollow(this.player, true, 1, 0);
      // roundPixels=true reduces jitter 
      // LERP=1,0 prevents Y-axis following
   }

   makeBanks() {
      let bank_left = this.add.image(0, 0, 'bank_left')
         .setOrigin(0, 0)
         .setDepth(2);
      this.banks.add(bank_left);
      let bank_right = this.add.image(gameWidth, 0, 'bank_right')
         .setOrigin(1, 0)
         .setDepth(2);
      this.banks.add(bank_right);

      // below was in create() but image not showing
      // this.bank_left = new Bank(this, 0, 0, 'bank_left_120');
      // this.bank_left.setOrigin(0, 0);
      // this.bank_right = new Bank(this, gameWidth, 0, 'bank_right_120');
      // this.bank_right.setOrigin(1, 0);
   }

   makePlayer() {
      let start_x = gameWidth / 2; // game width screen + 2 * offset
      let start_y = displayHeight - 10;
      //this.player = new Player(this, start_x, start_y, 'boat');
      this.player = new Player(this, start_x, start_y, 'anim_boat', 2);

      this.playerWake = this.physics.add.image(0, 0, 'wake');
      this.playerWake.y = start_y; // unused because player.addWake() sets position
      this.playerWake.visible = false;
      this.playerWake.setOrigin(0.5, 0);
      // this.player.addChild(this.playerWake);
   }

   makeProgressDisplay() {
      let x = 40;
      let y = 40;
      let yLineSpacing = 32;
      this.score = 0;
      this.progressDisplay = this.add.text(x, y, `Passed: ${this.obstaclesPassed}`, { fontSize: '24px', fill: '#fff' });
      y += yLineSpacing;
      this.hud.add(this.progressDisplay);

   };

   makeFuelDisplay() {
      let x = 40;
      let y = 80;
      this.fuelDisplay = this.add.text(x, y, `Fuel: ${this.player.fuel}`, { fontSize: '24px', fill: '#fff' });
      this.hud.add(this.fuelDisplay);
   };

   updateFuelDisplay() {
      if (this.player.fuel) {
         this.fuelDisplay.setText(`Fuel: ${this.player.fuel}`);
      }
   };

   testIfReadyForNextObstacle() {
      let previousY = this.getPreviousObstacleY();
      if (previousY - this.spawnY > this.ySpacing) {
         // console.log(previousY, this.ySpacing, this.spawnY);
         this.makeObstacle();
         // ready for next Obstacle
         this.ySpacing = Phaser.Math.Between(...this.ySpacingRange);
      }
   }

   makeObstacle() {
      // let yPreviousObstacle, ySpacing, yNewObstacle;
      // ySpacing = Phaser.Math.Between(...this.ySpacingRange);

      let chosenObstacleType = this.weightedRandomChoice(this.obstacle_types, this.obstacle_chances);
      const obstacleSprites = this.obstacleMaker[chosenObstacleType]();
      //console.log(chosenObstacleType, obstacleSprites);
      // this.yNewObstacle = yNewObstacle;
      this.placeObstaclesY(...obstacleSprites);

      this.placeObstaclesX[chosenObstacleType](obstacleSprites);
      //console.log(yPreviousObstacle, ySpacing, yNewObstacle);
   }

   placeObstaclesY(...components) {
      components.forEach((item) => {
         item.y = this.spawnY;
      });
   }

   makeBooms() {
      let leftBoom = new Boom(this, 0, 0, 'boom');
      let rightBoom = new Boom(this, 0, 0, 'boom');
      // because X gap measured from leftBoom's right-hand edge
      leftBoom.setOrigin(1, 0); // class default is 0,0
      return [leftBoom, rightBoom];
   }

   makeSecret() {
      this.bank = Math.random() < 0.5 ? 'left' : 'right';
      this.towerBank = (this.bank === 'left') ? 'right' : 'left';

      //let land_secret = new Land(this, 0, 0, 'land');
      let intel = new Intel(this, 0, 0, 'intel');
      let secret = new Secret(this, 0, 0, 'secret');

      let land_tower = new Land(this, 0, 0, 'land');
      // later use single tower texture and flip with Phaser
      let tower;
      if (this.towerBank === 'left') {
         tower = new Tower(this, 0, 0, 'tower_left');
      } else {
         tower = new Tower(this, 0, 0, 'tower_right');
      }
      return [secret, intel, tower, land_tower];
   }

   makeBridge() {
      let leftBridge = new BridgeSide(this, 0, 0, "bridge");
      let rightBridge = new BridgeSide(this, 0, 0, "bridge");
      leftBridge.setOrigin(1, 0.5); // class default X origin 0

      this.bank = Math.random() < 0.5 ? 'left' : 'right';
      let van = new Van(this, 0, 0, "van");
      if (this.bank === 'left') {
         van.setOrigin(0, 0.5);
      } else {
         van.flipX = true;
         van.setOrigin(1, 0.5);
      }
      return [leftBridge, rightBridge, van];
   }

   // will have tiles of fast & slow patches, and rocks
   makeRapids() {
      let rapids = new Rapids(this, 0, 0, "rapids");
      return [rapids];
   }

   placeBooms(leftBoom, rightBoom) {
      // gap between left and right booms
      let gapSize = Phaser.Math.Between(...this.boomGapRange);
      // left side of gap's X coordinate i.e. right edge of left boom
      let gapLeftMin = this.boom_length_min;
      let gapLeftMax = 360 - gapSize - this.boom_length_min;
      let gapLeftRange = [gapLeftMin, gapLeftMax];
      let xGapLeft = Phaser.Math.Between(...gapLeftRange);
      leftBoom.x = xGapLeft + bankWidth;
      rightBoom.x = xGapLeft + gapSize + bankWidth;
   }

   placeSecret(secret, intel, tower, land_tower) {
      let x;
      if (this.bank === "left") {
         intel.setOrigin(0, 0.5);
         secret.setOrigin(0, 0.5);
         x = bankWidth;
         intel.x = x;
         secret.x = x - 70;

         land_tower.setOrigin(1, 0.5);
         tower.setOrigin(1, 0.5);
         x = gameWidth - bankWidth;
         land_tower.x = x + 20;
         tower.x = x;
      }
      else if (this.bank === "right") {
         intel.setOrigin(1, 0.5);
         secret.setOrigin(1, 0.5);
         x = gameWidth - bankWidth;
         intel.x = x;
         secret.x = x + 70;

         land_tower.setOrigin(0, 0.5);
         tower.setOrigin(0, 0.5);
         x = bankWidth;
         land_tower.x = x - 20;
         tower.x = x;
      }
   }

   placeBridge(leftBridge, rightBridge, van) {
      let gapSize = 100;
      // left side of gap's X coordinate i.e. right edge of left boom
      let xGapLeft = 130;
      leftBridge.x = xGapLeft;
      rightBridge.x = xGapLeft + gapSize;
      // let y = this.y_locations[1]; // gallery
      // leftBridge.y = y;
      // rightBridge.y = y;
      van.x = this.bank === 'left' ? 10 : displayWidth - 10;
   }

   // do fast & slow patches within Rapids, and random variation
   // smaller sprites (tiles) will enable this
   placeRapids(rapids) {
   }

   destroyPassedObstacle() {
      //if (this.pierPlaced) return; // does the run carry on after pier?
      // let tempObstacles = [];
      this.obstacles.getChildren().forEach(obstacle => {
         if (obstacle.getBounds().top > displayHeight) {
            //console.log(obstacle);
            // tempObstacles.push(obstacle);
            obstacle.destroy();
         }
      });

      // this.saveBestScore();
      // if (!this.pierPlaced) {
      //    if (this.checkIfReachedPier()) {
      //       this.makePier();
      //       this.pierPlaced = true;
      //    }
      // }
   };

   trackProgress() {
      this.obstaclesPassed += 1;
      this.progressDisplay.setText(`Passed: ${this.ObstaclesPassed}`);
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
            let y = this.player.y - 36;
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
      if (!this.pierPlaced && this.obstaclesPassed >= this.obstaclesToGoal) {
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

   getPreviousObstacleY() {
      let yPrevious = 700;
      this.obstacles.getChildren().forEach(obstacle => {
         yPrevious = Math.min(obstacle.y, yPrevious);
      });
      return yPrevious;
   }

   setObstacleSpeed(speed) {
      this.obstacles.children.iterate((obstacle) => {
         obstacle.setVelocityY(speed);
      });
   }

   weightedRandomChoice(items, weights) {
      let totalWeight = 0;
      for (let weight of weights) {
         totalWeight += weight;
      }
      const tolerance = 0.001;
      if (Math.abs(totalWeight - 1) > tolerance) {
         console.warn('Random choice weights do not sum to 1');
      }
      let randomValue = Math.random() * totalWeight;
      let currentWeight = 0;

      for (let i = 0; i < items.length; i++) {
         currentWeight += weights[i];
         if (randomValue <= currentWeight) {
            return items[i];
         }
      }
      // return last item in case of error
      return items[items.length - 1];
   }
}
