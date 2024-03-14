class Game extends Phaser.Scene {
   constructor() {
      super('Game');
   }

   init() {
      // this.scene.launch('Controls');
      // this.scene.add('Controls', Controls);
      // this.scene.bringToTop('Controls');

      this.data = this.cache.json.get('zoneData');
      zones_quantity = this.data.length - 1;
      //console.log(zones_quantity);
      this.setZoneParameters(currentZone);

      this.progressInGame = 0;
      this.progressInZone = 0;
      this.obstacle_types = ['secret', 'boom', 'rapids'];

      // if zone was selected in menu
      if (currentZone > 1) {
         for (let i = 1; i < currentZone; i++) {
            this.progressInGame += this.data[i].intervals;
         }
      }

      this.waterBG = this.add.tileSprite(0, 0, gameWidth, displayHeight, 'water');
      this.waterBG.setOrigin(0, 0);
      //make background tileSprite scroll with camera
      this.waterBG.tilePositionX = this.cameras.main.scrollX;
      this.waterBG.tilePositionY = this.cameras.main.scrollY;

      this.land = this.physics.add.group({ runChildUpdate: true });
      this.booms = this.physics.add.group({ runChildUpdate: true });
      this.bridges = this.physics.add.group({ runChildUpdate: true });
      this.rapids = this.physics.add.group({ runChildUpdate: true });
      this.woods = this.physics.add.group({ runChildUpdate: true });
      this.rocks = this.physics.add.group({ runChildUpdate: true });
      this.sensors = this.physics.add.group({ runChildUpdate: true });
      this.secrets = this.physics.add.group({ runChildUpdate: true });
      this.intels = this.physics.add.group();

      // decoration of land and water
      this.features = this.physics.add.group({ runChildUpdate: true });
      this.obstacles = this.physics.add.group({ runChildUpdate: true });

      this.driftSpeed = this.zone.riverSpeed;
      //console.log(this.driftSpeed);

      this.spawnY = -100;
      //this.ySpacingRange = [240, 320];
      this.ySpacingRange = [this.zone.ySpacing.min, this.zone.ySpacing.max];
      this.ySpacing = Phaser.Math.Between(...this.ySpacingRange);

      this.obstaclesToGoal = 999; // 0 or 1 if testing pier
      this.progressInGameMax = localStorage.getItem('obstaclesPassedMax');

      this.boomGapRange = [this.zone.boom.gapMin, this.zone.boom.gapMax];
      this.boom_length_min = this.zone.boom.lengthMin;
      this.boom_closable_chance = this.zone.boom.closable.chance;
      this.boom_closable_delay = this.zone.boom.closable.delay;
      this.boom_closable_speed = this.zone.boom.closable.speed;
      // this.boomGapRange = [this.data.Level_1.boom.gapMin, this.data.Level_1.boom.gapMax];
      // this.boom_length_min = this.data.Level_1.boom.lengthMin;
      // this.boomGapRange = [80, 140];
      // this.boom_length_min = 50;

      this.displayWidth = this.sys.config.width;
      this.displayHeight = this.sys.config.height;
      this.fontSize = 16;
      this.lineHeight = 70;
      this.fontOptions = { fontSize: `${this.fontSize}px`, color: '#999' };

      this.intel_alert = 180;
      // this.milestone_interval = this.zone.intervals;
      this.pierPlaced = false;
      this.gameOver = false;

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
         milestone: () => {
            return this.makeMilestone();
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
         milestone: (obstacleSprites) => {
            this.placeMilestone(...obstacleSprites);
         },
      };
   };

   create() {
      this.physics.world.bounds.width = gameWidth; // works without these?
      this.physics.world.bounds.height = displayHeight;
      this.input.scene.active = true;

      this.makeBanks();
      this.makePlayer();
      this.setupXscroll();
      this.makeHud();

      if (keyboard != 'likely') {
         this.makeMenuButton();
         this.makeArrowButtons();
      }

      // this.makeDriftwood(200, 300)
      this.setupSounds();

      // create first 2 obstacles, using same method as update()
      this.makeObstacle();
      this.ySpacing = Phaser.Math.Between(...this.ySpacingRange);
      this.obstacles.incY(this.ySpacing + 1); // ? forgot why +1
      this.makeObstacle();
      this.obstacles.incY(100); // start closer 

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

      this.physics.add.overlap(this.player, this.obstacles, this.hitObstacle, null, this);
      this.physics.add.overlap(this.player, this.rapids, this.hitRapids, null, this);
      this.physics.add.collider(this.player, this.woods, this.hitDriftwood, null, this);
      this.physics.add.collider(this.player, this.rocks, this.hitRock, null, this);
      this.physics.add.overlap(this.player, this.intel, this.hitIntel, null, this);
      this.physics.add.overlap(this.sensors, this.secrets, this.senseIntel, null, this);
      this.physics.add.collider(this.player, this.land, this.hitLand, null, this);
      this.physics.add.collider(this.player, this.booms, this.hitBooms, null, this);
      this.physics.add.collider(this.player, this.bridges, this.hitBridges, null, this);

      this.setDrift(this.zone.riverSpeed);
      this.input.keyboard.on('keyup', this.anyKey, this);
      //this.loseLife()
   };

   update() {
      if (this.gameOver) return;

      this.setDrift(this.driftSpeed);
      this.player.update(this.cursors);

      this.isIntelWithinRange();

      this.updateFuelDisplay();

      this.destroyPassedObstacle();

      this.testIfReadyForNextObstacle();
   };

   makeMenuButton() {
      this.buttonMenu = new hudButton(this, 62, 30, 'placeholderButtonUp', 'placeholderButtonDown', 'Menu', () => {
         console.log('pointer down -> menu');
         this.scene.start("Home");
      });
   }

   isIntelWithinRange() {
      // if Intel on screen
      if (this.intels) {
         let nearest_Intel_dist = 800;
         let intelX; // to calc which side of boat is nearest Intel
         this.intels.getChildren().forEach(intel => {
            // console.log(this.player.x, this.player.y, intel.x, intel.y)
            let dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, intel.x, intel.y);
            if (dist < nearest_Intel_dist) {
               nearest_Intel_dist = dist;
               intelX = intel.x;
            }
         });

         if (nearest_Intel_dist < this.intel_alert) {
            //console.log(nearest_Intel_dist);
            if (this.player.x > intelX) {
               this.showLeftSensorCone();
            } else {
               this.showRightSensorCone();
            }
         } // boat isn't near any Intel
         else {
            this.hideSensorCone();
         }
      }
   }

   setupSounds() {
      this.landCollideSound = this.sound.add('snd_landCollide', { volume: 0.1 });
      this.boomCollideSound = this.sound.add('snd_boomCollide', { volume: 0.1 });
      this.bridgeCollideSound = this.sound.add('snd_bridgeCollide', { volume: 0.1 });
      this.rapidsOverlapSound = this.sound.add('snd_rapidsOverlap', { volume: 0.1 });
      this.intelOverlapSound = this.sound.add('snd_intelOverlap', { volume: 0.1 });
   }

   setupXscroll() {
      this.cameras.main.setBounds(0, 0, gameWidth, displayHeight);
      this.cameras.main.setBackgroundColor(0x0000ff);
      this.cameras.main.startFollow(this.player, true, 1, 0);
      // roundPixels=true reduces jitter 
      // LERP=1,0 prevents Y-axis following
   }

   makeBanks() {
      let bank_left = this.add.image(bankWidth, 0, 'bank_left')
         .setOrigin(1, 0)
         .setDepth(4);
      this.land.add(bank_left);
      let bank_right = this.add.image(gameWidth - bankWidth, 0, 'bank_right')
         .setOrigin(0, 0)
         .setDepth(4);
      this.land.add(bank_right);

      // below was in create() but image not showing
      // this.bank_left = new Bank(this, 0, 0, 'bank_left_120');
      // this.bank_left.setOrigin(0, 0);
      // this.bank_right = new Bank(this, gameWidth, 0, 'bank_right_120');
      // this.bank_right.setOrigin(1, 0);
   }

   makePlayer() {
      let start_x = gameWidth / 2; // game width screen + 2 * offset
      let start_y = displayHeight - 10;
      this.player = new Player(this, start_x, start_y, 'boat');
      //this.player = new Player(this, start_x, start_y, 'anim_boat', 2);

      // wake is now a particle emitter
      // see https://newdocs.phaser.io/docs/3.55.2/Phaser.Types.GameObjects.Particles.ParticleEmitterConfig
      // for all possible particle options
      this.playerWake = this.add.particles(0, -20, 'wake', {
         color: [0x96e0da, 0x937ef3],
         colorEase: 'quart.out',
         lifespan: 1000,
         angle: { min: 80, max: 110 },
         scale: { start: 0.25, end: 1, ease: 'sine.in' },
         alpha: { start: 0.5, end: 0, ease: 'sine.in' },
         speed: { min: 50, max: 150 },
         frequency: 60, // ms per particle
         advance: 2000,
         blendMode: 'ADD',
         follow: this.player
      });

      this.cone_left = this.physics.add.sprite(start_x, start_y - this.player.coneYoffset, 'sensor')
         .setOrigin(1, 0.5)
         .setVisible(false)
         .setDepth(9)
         .setAlpha(0.5)
         .setScale(1.1, 0.7)
         .setFlipX(true);
      this.cone_right = this.physics.add.sprite(start_x, start_y - this.player.coneYoffset, 'sensor')
         .setOrigin(0, 0.5)
         .setVisible(false)
         .setAlpha(0.5)
         .setScale(1.1, 0.7)
         .setDepth(9);
      this.sensors.add(this.cone_left);
      this.sensors.add(this.cone_right);
   }

   makeHud() {
      // HUD centre at game centre, and don't scroll when river scroll sideways
      this.hud = this.add.container(displayWidth / 2, 0);
      this.hud.setDepth(99);
      this.hud.setScrollFactor(0);
      let y_UI_spacing = 35;
      let y = 45;
      this.makeLifeDisplay(y);
      y += y_UI_spacing;
      this.makeIntelDisplay(y);
      y += y_UI_spacing;
      this.makeProgressDisplay(y);
      y += y_UI_spacing;
      this.makeFuelDisplay(y);
      y += y_UI_spacing;
      // this.makeNavigationButtons(y);
   }

   makeArrowButtons() {
      let top = 200;
      let cameraCentreX = this.cameras.main.centerX;
      this.cameras.main.on('camera.scroll', this.updateButtonHitAreas, this);

      let gameCentreX = this.cameras.main.scrollX + displayWidth / 2;
      let scrollFactorX = this.cameras.main.scrollX / (gameWidth - displayWidth);
      let hitAreaOffsetX = scrollFactorX * displayWidth;

      let buttonOffset = 40;
      let leftBtnX = cameraCentreX - buttonOffset; // was 100
      let rightBtnX = cameraCentreX + buttonOffset;

      Object.assign(this, { cameraCentreX, gameCentreX, leftBtnX, rightBtnX });
      console.log(`scroll: ${this.cameras.main.scrollX}, cameraCentreX ${cameraCentreX}, gameCentreX ${gameCentreX}, leftBtnX ${leftBtnX}, rightBtnX ${rightBtnX}`);

      this.btnFast = new arrowButton(this, cameraCentreX, top, 'placeholderButtonUp', 'placeholderButtonDown', 'up', () => {
         console.log("fast");
         console.log(this.player);
         this.player.body.setVelocityY(-this.player.forward_speed);
         this.player.setTint(0xffb38a);
         this.player.addWake();
         this.player.useFuel(this.player.forwardFuel);
         this.driftSpeed = this.zone.riverSpeed * this.player.forward_ratio;
         this.player.engine = "forward";
      });
      this.btnFast.scrollFactorX = 0;

      top += 24;
      this.btnLeft = new arrowButton(this, leftBtnX, top, 'placeholderButtonUp', 'placeholderButtonDown', '<', () => {
         console.log("Left");
         this.player.body.setVelocityX(-1 * this.player.sideway_speed);
      });
      this.btnLeft.scrollFactorX = 0;

      this.btnRight = new arrowButton(this, rightBtnX, top, 'placeholderButtonUp', 'placeholderButtonDown', '>', () => {
         console.log("Right");
         this.player.body.setVelocityX(1 * this.player.sideway_speed);
      });
      this.btnRight.scrollFactorX = 0;

      top += 28;
      this.btnSlow = new arrowButton(this, cameraCentreX, top, 'placeholderButtonUp', 'placeholderButtonDown', 'v', () => {
         console.log("Slow");
         this.driftSpeed = this.zone.riverSpeed / this.player.backward_ratio;
         this.player.engine = "backward";
         this.player.setTint(0xbae946);
         this.player.useFuel(this.player.backwardFuel);
      });
      this.btnSlow.scrollFactorX = 0;

      // this.btnLeft.setInteractive({ hitArea: new Phaser.Geom.Rectangle(this.btnLeft.width / 2 - hitAreaOffsetX, 0, this.btnLeft.width, this.btnLeft.height) });
   }

   updateButtonHitAreas() {
      let scrollFactorX = this.cameras.main.scrollX / (gameWidth - displayWidth);
      let hitAreaOffsetX = scrollFactorX * displayWidth;
      this.btnLeft.input.hitArea.x = this.btnLeft.x + hitAreaOffsetX;
      this.btnRight.input.hitArea.x = this.btnRight.x + hitAreaOffsetX;
   }

   makeNavigationButtons(y) {
      // this.buttonLeft = new uiButton(this, 50, y, 'placeholderButtonUp', 'placeholderButtonDown', 'Left', () => {
      //    console.log('pointer down -> left');
      //    this.player.setVelocityX(-1 * this.player.sideway_speed);

      // });
      y += 20;
      this.buttonFast = this.add.text(0, y, '^', { font: '24px Arial', color: '#ffffff' })
         .setOrigin(0.5);
      this.hud.add(this.buttonFast);

      y += 30;
      this.buttonLeft = this.add.text(-70, y, 'Left', { font: '24px Arial', color: '#ffffff' })
         .setOrigin(0.5)
         .setInteractive();
      this.buttonLeft.on('pointerdown', () => {
         this.player.body.setVelocityX(-1 * this.player.sideway_speed);
         console.log('Left in container', y);
      });
      this.hud.add(this.buttonLeft);

      this.buttonRight = this.add.text(70, y, 'Right', { font: '24px Arial', color: '#ffffff' })
         .setOrigin(0.5);
      this.hud.add(this.buttonRight);

      y += 30;
      this.buttonSlow = this.add.text(0, y, 'v', { font: '24px Arial', color: '#ffffff' })
         .setOrigin(0.5);
      this.hud.add(this.buttonSlow);
   }

   makeLifeDisplay(y) {
      this.lifeDisplay = this.add.text(0, y, `Life: ${this.player.life}`, hudStyle);
      this.lifeDisplay.setOrigin(0.5);
      this.hud.add(this.lifeDisplay);
   };

   makeProgressDisplay(y) {
      this.progressDisplay = this.add.text(0, y, `Passed: ${this.progressInGame}`, hudStyle);
      this.progressDisplay.setOrigin(0.5);
      this.hud.add(this.progressDisplay);
   };

   trackProgress() {
      this.progressInZone += 1;
      this.progressInGame += 1;
      this.progressDisplay.setText(`Passed: ${this.progressInGame}`);
   };

   makeFuelDisplay(y) {
      this.fuelDisplay = this.add.text(0, y, `Fuel: ${this.player.fuel}`, hudStyle);
      this.fuelDisplay.setOrigin(0.5);
      this.hud.add(this.fuelDisplay);
   };

   makeIntelDisplay(y) {
      this.intelDisplay = this.add.text(0, y, `Intel: ${this.player.intelScore}`, hudStyle);
      this.intelDisplay.setOrigin(0.5);
      this.hud.add(this.intelDisplay);
   };

   updateFuelDisplay() {
      if (this.player.engine === 'forward') {
         this.fuelDisplay.setTint(0xff0000);
      }
      else if (this.player.engine === 'backward') {
         this.fuelDisplay.setTint(0xff7f50);
      }
      else {
         this.fuelDisplay.setTint(0xffffff);
      }
      this.fuelDisplay.setText(`Fuel: ${this.player.fuel}`);
      //}
   };
   updateIntelDisplay() {
      //if (this.player.health) {
      this.intelDisplay.setText(`Intel: ${this.player.intelScore}`);
      //}
   };
   updateLifeDisplay() {
      //if (this.player.health) {
      this.lifeDisplay.setText(`Life: ${this.player.life}`);
      //}
   };

   testIfReadyForNextObstacle() {
      let previousY = this.getPreviousObstacleY();
      // console.log(previousY, this.ySpacing);
      if (previousY - this.spawnY > this.ySpacing) {
         // console.log(previousY, this.ySpacing, this.spawnY);
         this.makeObstacle();
         // randomize new Y gap to next Obstacle
         this.ySpacing = Phaser.Math.Between(...this.ySpacingRange);
         this.trackProgress();

         if (keyboard != 'likely') {
            console.log(`scroll: ${this.cameras.main.scrollX}`);
            // console.log(`scroll: ${this.cameras.main.scrollX}, cameraCentreX ${this.cameraCentreX}, gameCentreX ${this.gameCentreX}, leftBtnX ${this.leftBtnX}, rightBtnX ${this.rightBtnX}`);
         }
      }
   }

   makeObstacle() {
      let chosenObstacleType;
      // within current zone if progress reaches zone's quantity of obstacles then show milestone and increment currentZone (and show message)

      // if (this.progressInZone === 0 || this.progressInZone % this.milestone_interval > 0) {
      if (this.progressInZone < this.zone.intervals) {
         chosenObstacleType = this.weightedRandomChoice(this.obstacle_types, this.obstacle_chances);
         const obstacleSprites = this.obstacleMaker[chosenObstacleType]();
         this.placeObstaclesY(...obstacleSprites);
         this.placeObstaclesX[chosenObstacleType](obstacleSprites);
      }
      else {
         currentZone += 1;
         if (currentZone > zones_quantity) {
            this.scene.start("Home");
         }
         else {
            chosenObstacleType = "milestone";
            this.setZoneParameters(currentZone);
            const obstacleSprites = this.obstacleMaker[chosenObstacleType]();
            this.placeObstaclesY(...obstacleSprites);
            this.placeObstaclesX[chosenObstacleType](obstacleSprites);
         }
      }
      //console.log(currentZone, this.zone.intervals);
   }

   placeObstaclesY(...components) {
      components.forEach((item) => {
         item.y = this.spawnY;
      });
   }

   makeBooms() {
      let leftBoom = null;
      let rightBoom = null;
      if (this.zone.boom.closable.chance == 0) {
         leftBoom = new Boom(this, 0, 0, 'boom');
         rightBoom = new Boom(this, 0, 0, 'boom');
      } else {
         const delay = this.zone.boom.closable.delay;
         const speed = this.zone.boom.closable.speed;
         leftBoom = new BoomClosable(this, 0, 0, 'boom', delay, speed);
         rightBoom = new BoomClosable(this, 0, 0, 'boom', delay, speed);
      }
      // because X gap measured from leftBoom's right-hand edge
      leftBoom.setOrigin(1, 0.5); // class default X origin is 0
      this.booms.add(leftBoom);
      this.booms.add(rightBoom);

      // chain dragging boom wraps around capstans on both banks
      let leftCapstan = new Capstan(this, 0, 0, 'capstan');
      let rightCapstan = new Capstan(this, 0, 0, 'capstan');
      leftCapstan.setScale(0.6);
      //.setVisible(false)
      rightCapstan.setScale(0.6);
      //.setVisible(false)

      return [leftBoom, rightBoom, leftCapstan, rightCapstan];
   }

   makeSecret() {
      this.bank = Math.random() < 0.5 ? 'left' : 'right';
      this.towerBank = (this.bank === 'left') ? 'right' : 'left';

      //let land_secret = new Land(this, 0, 0, 'land');
      let intel = new Intel(this, 0, 0, 'intel');
      this.intels.add(intel);

      let secret = new Secret(this, 0, 0, 'secret');

      //let land_tower = new Land(this, 0, 0, 'land');
      // later use single tower texture and flip with Phaser
      let tower;
      if (this.towerBank === 'left') {
         tower = new Tower(this, 0, 0, 'tower_left');
      } else {
         tower = new Tower(this, 0, 0, 'tower_right');
      }
      return [secret, intel, tower];
      // return [secret, intel, tower, land_tower];
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

      this.bridges.add(leftBridge);
      this.bridges.add(rightBridge);
      return [leftBridge, rightBridge, van];
   }

   // will have tiles of fast & slow patches, and rocks
   makeRapids() {
      let rapidsLine = new Rapids(this, 0, 0, "rapids");
      this.rapids.add(rapidsLine);

      let dangerOption = Math.random() < 0.5 ? 'wood' : 'rock';
      let danger;
      if (dangerOption === 'wood') {
         danger = new Driftwood(this, 0, 0, "anim_driftwood", 0);
         danger.play('splash_driftwood');
      } else {
         danger = new Rock(this, 0, 0, "rock", 0);
      }
      this.rapids.add(danger);
      // let driftwood = this.add.sprite(0, 0, 'anim_driftwood', 0);
      // let driftwood = new Driftwood(this, 0, 0, "anim_driftwood", 0);
      // this.rapids.add(driftwood);
      // driftwood.play('splash_driftwood');
      // driftwood.setDepth(100)
      // driftwood.setScale(1.0);
      // this.obstacles.add(driftwood);
      return [rapidsLine, danger];
   }

   // makeDriftwood(x, y) {
   //    this.wood = this.add.sprite(x, y, 'anim_driftwood', 0);
   //    this.wood.setDepth(99)
   //    this.wood.play('splash_driftwood');
   //    console.log(this.wood)
   //    //this.wood.setVelocity(0, this.driftSpeed);
   // }

   makeMilestone() {
      let milestone = new Rapids(this, 0, 0, "rapids");
      this.milestone = milestone;
      //console.log(`Milestone before zone ${currentZone}`);
      return [milestone];
   }

   placeBooms(leftBoom, rightBoom, leftCapstan, rightCapstan) {
      // gap between left and right booms
      let gapSize = Phaser.Math.Between(...this.boomGapRange);
      // add a little gap size and delay if closable
      if (leftBoom.closable) {
         gapSize = gapSize + leftBoom.speed > 360 ? gapSize : gapSize + leftBoom.speed;
         leftBoom.delay *= 1 + Phaser.Math.Between(0, 2);
      }
      if (rightBoom.closable) {
         gapSize = gapSize + rightBoom.speed > 360 ? gapSize : gapSize + rightBoom.speed;
         rightBoom.delay *= 1 + Phaser.Math.Between(0, 2);
      }
      // left side of gap's X coordinate i.e. right edge of left boom
      let gapLeftMin = this.boom_length_min;
      let gapLeftMax = 360 - gapSize - this.boom_length_min;
      let gapLeftRange = [gapLeftMin, gapLeftMax];
      let xGapLeft = Phaser.Math.Between(...gapLeftRange);
      leftBoom.x = xGapLeft + bankWidth;
      rightBoom.x = xGapLeft + gapSize + bankWidth;

      // need space to walk (push) between capstan and edge of river
      leftCapstan.x = bankWidth - 30;
      rightCapstan.x = bankWidth + displayWidth + 30;

      if (leftBoom.closable) {
         this.time.addEvent({
            delay: leftBoom.delay,
            callback: () => {
               leftBoom.x += leftBoom.speed;
            },
            repeat: true,
            repeatCount: (rightBoom.x - leftBoom.x) / leftBoom.speed / 2,
         });
      }
      if (rightBoom.closable) {
         this.time.addEvent({
            delay: rightBoom.delay,
            callback: () => {
               rightBoom.x -= rightBoom.speed;
            },
            repeat: true,
            repeatCount: (rightBoom.x - leftBoom.x) / rightBoom.speed / 2,
         });
      }
   }

   placeSecret(secret, intel, tower, land_tower) {
      let x;
      let distSecretFromRiver = 45;
      let distTowerFromRiver = 40;

      if (this.bank === "left") {
         intel.setOrigin(0, 0.5).setAlpha(0.3);
         secret.setOrigin(0, 0.5);
         x = bankWidth;
         intel.x = x;
         secret.x = x - distSecretFromRiver;

         //land_tower.setOrigin(1, 0.5);
         tower.setOrigin(1, 0.5);
         x = gameWidth - bankWidth + distTowerFromRiver;
         //land_tower.x = x + 20;
         tower.x = x;
      }
      else if (this.bank === "right") {
         intel.setOrigin(1, 0.5).setAlpha(0.3);
         secret.setOrigin(1, 0.5);
         x = gameWidth - bankWidth;
         intel.x = x;
         secret.x = x + distSecretFromRiver;

         //land_tower.setOrigin(0, 0.5);
         tower.setOrigin(0, 0.5);
         x = bankWidth - distTowerFromRiver;
         //land_tower.x = x - 20;
         tower.x = x;
      }
   }

   placeBridge(leftBridge, rightBridge, van) {
      let gapSize = 100;
      // left side of gap's X coordinate i.e. right edge of left boom
      let xGapLeft = 130;
      leftBridge.x = xGapLeft + bankWidth;
      rightBridge.x = xGapLeft + gapSize + bankWidth;
      // let y = this.y_locations[1]; // gallery
      // leftBridge.y = y;
      // rightBridge.y = y;
      van.x = this.bank === 'left' ? 10 : displayWidth - 10;
      van.x += bankWidth;
   }

   // do fast & slow patches within Rapids, and random variation
   // smaller sprites (tiles) will enable this
   placeRapids(rapidsLine, danger) {
      rapidsLine.x = bankWidth;
      danger.x = bankWidth + Phaser.Math.Between(30, displayWidth - 30);
   }

   placeMilestone(milestone) {
      // console.log('Milestone obstacle created!')
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

   saveBestScore() {
      let bestScoreStr = localStorage.getItem('bestScore');
      let bestScore = bestScoreStr && parseInt(bestScoreStr, 10);
      if (!bestScore || this.score > bestScore) {
         localStorage.setItem('bestScore', this.score);
      }
   };

   // if player health, but multiple hits on impact is a problem
   hitBooms(boat, boom) {
      // console.log('Boom Hit', boom.damage);
      //boom.body.enable = false;
      this.boomCollideSound.play();
      this.player.setVelocity(0, 0);
      this.loseLife(); // while bug drift continues after hit
      if (!boom.hit) {
         //console.log(this, boom);
         this.driftSpeed = 0;
         boom.hit = true;
         // this.player.updateHealth(boom.damage);
         // this.player.health -= boom.damage;
         //this.updateHealthDisplay();
         // if (this.player.health <= 0) {
         //    this.endLevel();
         // }
      }
   };

   hitBridges(boat, bridge) {
      //console.log('Bridge Hit');
      //bridge.body.enable = false;
      this.bridgeCollideSound.play();
      this.player.setVelocity(0, 0);
      this.loseLife(); // while bug drift continues after hit
      if (!bridge.hit) {
         //console.log(this, bridge);
         this.driftSpeed = 0;
         bridge.hit = true;
         //this.player.updateHealth(bridge.damage);
         // if (this.player.health <= 0) {
         //    this.endLevel();
         // }
      }
   };

   hitRapids(boat, rapid) {
      if (!rapid.hit) {
         //console.log('Rapids Hit');
         this.rapidsOverlapSound.play();
         //console.log(this, rapid);
         rapid.hit = true;
         //this.player.updateHealth(rapid.damage);
         // if (this.player.health <= 0) {
         //    this.endLevel();
         // }
      }
   };

   hitDriftwood(boat, wood) {
      // console.log('Driftwood Hit');
      wood.setVelocity(0, this.driftSpeed);
      this.landCollideSound.play();
      this.player.setVelocity(0, 0);
      this.loseLife();
   }

   hitRock(boat, rock) {
      //console.log('Rock Hit', this.rocks);
      rock.setVelocity(0, this.driftSpeed);
      this.landCollideSound.play();
      this.player.setVelocity(0, 0);
      this.loseLife();
   }

   hitIntel(boat, intel) {
      //console.log('Intel found');
      this.intelOverlapSound.play();
      this.player.intelScore += 1;
      this.updateIntelDisplay();
   }

   senseIntel(sensor, intel) {
      //console.log('Intel sensed');
      this.intelOverlapSound.play();
      this.player.intelScore += 1;
      this.updateIntelDisplay();
   }

   hitLand(boat, land) {
      //console.log('Land Hit');
      land.body.enable = false;
      this.landCollideSound.play();
      this.player.setVelocity(0, 0);
      // this.player.updateHealth(land.damage);
   }

   hitObstacles(boat, obstacle) {
      //console.log('Obstacle hit', obstacle);
   };

   loseLife() {
      this.invincible = true;
      this.player.life -= 1;
      this.updateLifeDisplay();
      this.cameras.main.shake(500);
      this.physics.pause();
      if (this.player.life > 0) {
         this.time.addEvent({
            delay: 2000,
            callback: this.newLife,
            callbackScope: this,
            loop: false
         });
      } else {
         this.endLevel();
      }
   }

   newLife() {
      // console.log("New life - fuel restored")
      this.physics.resume();
      this.player.fuel = this.player.startFuel;
      this.obstacles.incY(-200); // should be less than interval to avoid collisioon with previous obstacle, though usually X centre empty, except for a closed bridge.
      this.player.x = this.player.start_x;
   }

   createGameOverButtons() {
      // this.buttonMenu = new hudButton(this, 62, 30, 'placeholderButtonUp', 'placeholderButtonDown', 'Menu', () => {
      //    console.log('pointer down -> menu');
      //    this.scene.start("Home");
      // });
      //this.hud.add(this.buttonMenu);

      this.buttonReplay = new hudButton(this, displayWidth - 62, 30, 'placeholderButtonUp', 'placeholderButtonDown', 'Replay', () => {
         console.log('pointer down -> replay');
         // reset game state (lives, fuel, position)
         this.player.health = this.player.initialHealth;
         this.player.fuel = this.player.initialFuel;
         this.gameOver = false;
         this.obstacles.incY(-200);
         this.physics.resume();
         this.scene.restart();
      });
      //this.hud.add(this.buttonReplay);
   }

   endLevel() {
      this.gameOver = true;
      this.player.setTint(0xff0000);
      this.physics.pause();
      //this.saveBestScore();

      this.time.addEvent({
         delay: 1000,
         callback: () => {
            let x = this.player.x - 2;
            let y = this.player.y - 36;
            this.explosion = this.add.sprite(x, y, 'anim_placeholderExplosion', 0);
            this.explosion.play('explode');
            // let text = this.add.text(100, 300, 'Level over', { font: '40px Arial', color: '#ffffff' }).setOrigin(0.5);
            //this.hud.add(text);
         },
         loop: false
      });
      this.createGameOverButtons();

      this.time.addEvent({
         delay: 2500,
         callback: () => {
            this.player.health = this.player.initialHealth;
            this.player.fuel = this.player.initialFuel;
            //this.gameOver = false;
            //this.scene.restart();
         },
         loop: false
      });
   };

   showLeftSensorCone() {
      this.cone_left.x = this.player.x;
      this.cone_left.y = this.player.y - this.player.coneYoffset;
      this.cone_left
         .setVisible(true);
   }

   showRightSensorCone() {
      this.cone_right.x = this.player.x;
      this.cone_right.y = this.player.y - this.player.coneYoffset;
      this.cone_right
         .setVisible(true);
   }

   hideSensorCone() {
      this.cone_left
         .setVisible(false)
         .setPosition(-100, 0);
      this.cone_right
         .setVisible(false)
         .setPosition(-100, 0);
   }

   checkIfReachedPier() {
      if (!this.pierPlaced && this.progressInZone >= this.obstaclesToGoal) {
         return true;
      }
   };

   makePier() {
      this.pier = this.physics.add.sprite(displayWidth / 2, -40, 'pier')
         .setScale(0.8);
      this.pier.setVelocityY(this.zone.riverSpeed);
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
         this.scene.launch('Pause');
      }
   };

   getPreviousObstacleY() {
      let yPrevious = 700;
      this.obstacles.getChildren().forEach(obstacle => {
         yPrevious = Math.min(obstacle.y, yPrevious);
      });
      return yPrevious;
   }

   setDrift(speed) {
      this.driftSpeed = speed;
      this.obstacles.setVelocity(0, speed);
      this.features.setVelocity(0, speed);
      this.waterBG.tilePositionY -= speed / 60;
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

   setZoneParameters(numZone) {
      //let levelObjName = `Level_${ this.zoneNum }`;
      this.zone = this.data[numZone];
      this.obstacle_chances = [this.zone.obstacle.secret, this.zone.obstacle.boom, this.zone.obstacle.rapids];
      this.progressInZone = 0;
      this.debugObstacleChances();
      //console.log("boomgapmin", this.zone.boom.gapMin);
   }

   debugObstacleChances() {
      console.log(`Secret: ${this.zone.obstacle.secret}, Boom: ${this.zone.obstacle.boom}, Rapids: ${this.zone.obstacle.rapids}`);
      // console.log(`obstacles_chances ${this.obstacle_chances}`);
   }
};
