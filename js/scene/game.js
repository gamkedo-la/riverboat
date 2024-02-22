// import Phaser from '../lib/phaser.js';
// console.dir(Phaser);

class Game extends Phaser.Scene {
   constructor() {
      super('Game');
   }

   init() {
      this.obstacles = this.physics.add.group({ runChildUpdate: true });
      this.obstacle_types = ['boom', 'secret', 'bridge', 'rapids'];
      this.obstacle_chances = [0.5, 0.3, 0.2, 0.0]; // demo
      // Rapids cannot be used until overlap instead of collider
      // this.obstacle_chances = [0.6, 0.2, 0.1, 0.1]; // game-plausible
      this.obstacles_display = 3;
      this.booms_display = 3;
      this.ySpacingRange = [240, 320];
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
            console.log('placing a boom pair');
            this.placeBooms(...obstacleSprites);
         },
         secret: (obstacleSprites) => {
            console.log('placing a secret zone');
            this.placeSecret(...obstacleSprites);
         },
         bridge: (obstacleSprites) => {
            console.log('placing a bridge');
            this.placeBridge(...obstacleSprites);
         },
         rapids: (obstacleSprites) => {
            console.log('placing rapids');
            this.placeRapids(...obstacleSprites);
         },
      };
   };

   create() {
      this.cameras.main.setBackgroundColor(0x0000ff);
      this.obstacles = this.physics.add.group({ runChildUpdate: true });
      this.boomCollideSound = this.sound.add('snd_boomCollide', { volume: 0.5 });

      let start_x = displayWidth / 2;
      let start_y = displayHeight - 90;
      //this.player = new Player(this, start_x, start_y, 'boat');
      this.player = new Player(this, start_x, start_y, 'anim_boat', 2);

      this.playerWake = this.physics.add.image(0, 0, 'wake');
      this.playerWake.x = start_x;
      this.playerWake.y = start_y + this.player.height;
      this.playerWake.visible = false;
      // this.player.addChild(this.playerWake);

      let yPreviousObstacle, ySpacing, yNewObstacle;
      for (let i = 0; i < this.obstacles_display; i += 1) {
         if (i === 0) {
            yPreviousObstacle = 500;
         } else {
            yPreviousObstacle = this.getPreviousObstacleY();
         }
         ySpacing = Phaser.Math.Between(...this.ySpacingRange);
         yNewObstacle = yPreviousObstacle - ySpacing;

         let chosenObstacleType = this.weightedRandomChoice(this.obstacle_types, this.obstacle_chances);
         const obstacleSprites = this.obstacleMaker[chosenObstacleType]();
         //console.log(chosenObstacleType, obstacleSprites);
         this.yNewObstacle = yNewObstacle;
         this.placeObstaclesY(...obstacleSprites);

         this.placeObstaclesX[chosenObstacleType](obstacleSprites);
         //console.log(yPreviousObstacle, ySpacing, yNewObstacle);
      }

      if (this.checkIfReachedPier()) {
         this.makePier();
         this.pierPlaced = true;
      }
      this.makeProgressDisplay();
      this.makeFuelDisplay();

      this.cursors = this.input.keyboard.createCursorKeys();

      this.physics.add.collider(this.player, this.obstacles, this.endLevel, null, this);

      this.input.keyboard.on('keyup', this.anyKey, this);
   };

   update() {
      if (this.levelOver) return;

      this.player.update(this.cursors);

      this.updateFuelDisplay();

      this.destroyPassedObstacle();
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

   makeObstacle() {
      let yPreviousObstacle, ySpacing, yNewObstacle;
      yPreviousObstacle = this.getPreviousObstacleY();
      ySpacing = Phaser.Math.Between(...this.ySpacingRange);
      yNewObstacle = yPreviousObstacle - ySpacing;

      let chosenObstacleType = this.weightedRandomChoice(this.obstacle_types, this.obstacle_chances);
      const obstacleSprites = this.obstacleMaker[chosenObstacleType]();
      //console.log(chosenObstacleType, obstacleSprites);
      this.yNewObstacle = yNewObstacle;
      this.placeObstaclesY(...obstacleSprites);

      this.placeObstaclesX[chosenObstacleType](obstacleSprites);
      //console.log(yPreviousObstacle, ySpacing, yNewObstacle);
   }

   placeObstaclesY(...components) {
      components.forEach((item) => {
         item.y = this.yNewObstacle;
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

      let land_secret = new Land(this, 0, 0, 'land');
      let secret = new Secret(this, 0, 0, 'secret');

      let land_tower = new Land(this, 0, 0, 'land');
      // later use single tower texture and flip with Phaser
      let tower;
      if (this.towerBank === 'left') {
         tower = new Tower(this, 0, 0, 'tower_left');
      } else {
         tower = new Tower(this, 0, 0, 'tower_right');
      }
      return [secret, land_secret, tower, land_tower];
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
      leftBoom.x = xGapLeft;
      rightBoom.x = xGapLeft + gapSize;
   }

   placeSecret(secret, land_secret, tower, land_tower) {
      let x;
      if (this.bank === "left") {
         land_secret.setOrigin(0, 0.5);
         secret.setOrigin(0, 0.5);
         x = 0;
         land_secret.x = x;
         secret.x = x + 20;

         land_tower.setOrigin(1, 0.5);
         tower.setOrigin(1, 0.5);
         x = displayWidth;
         land_tower.x = x;
         tower.x = x - 20;
      }
      else if (this.bank === "right") {
         land_secret.setOrigin(1, 0.5);
         secret.setOrigin(1, 0.5);
         land_secret.x = displayWidth;
         secret.x = displayWidth - 20;

         land_tower.setOrigin(0, 0.5);
         tower.setOrigin(0, 0.5);
         land_tower.x = 0;
         tower.x = 20;
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
      let tempObstacles = [];
      this.obstacles.getChildren().forEach(obstacle => {
         if (obstacle.getBounds().top > displayHeight) {
            //console.log(obstacle);
            tempObstacles.push(obstacle);
            obstacle.destroy();
            this.makeObstacle(); // will wrongly make one for each component
            this.trackProgress(); // incorrect, will count each component
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
