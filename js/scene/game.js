class Game extends Phaser.Scene {
   constructor() {
      super('Game');
   }

   init() {
      this.initialiseVariables();
      this.getAllZonesData();
      this.makeTiledRiverBackground();
      this.createPhysicsGroups();

      if (developerMode) {
         developerModeSounds(this);
      } else {
         this.setupSounds();
      }

      this.setZoneParameters(makingZone); // reset when Milestone overlap
      this.applyRiverDrift(this.riverSpeed); // may be reset in update cycle

      // switches for obstacleMaker and placeObstaclesX
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
      this.setupInput();
      this.physics.world.bounds.width = gameWidth; // works without these?
      this.physics.world.bounds.height = displayHeight;

      this.makePlayer();
      this.makeHud();
      // this.scene.launch("Panel");
      if (keyboard != 'likely') {
         this.makeControlPanel();
         this.makeControlButtons();
      }

      // at game start, and when menu jumps to a zone start, create first obstacle
      this.makeInterval();
      // move it down from spawnY to visible start position, by call same method as update()
      this.moveFurnitureY(bring_down_first_obstacle); // this.ySpacing

      this.setupColliders();
      // this.logging();
   };

   update() {
      if (this.gameOver) return;

      this.applyRiverDrift(this.driftSpeed);
      this.player.update(this.cursors);

      this.isIntelWithinRange();

      this.updateFuelDisplay(); // should call from Player class

      this.destroyPassedObject();

      if (!this.stopMakingObstacles) this.testIfReadyForNextInterval();

      if (this.player.engine == 'off') {
         this.player.neitherFastOrSlow();
      }
   };

   makeObstacle() {
      let chosenObstacleType;

      if (this.numObstaclesCreatedInZone < this.obstaclesInZone) {
         chosenObstacleType = this.weightedRandomChoice(this.obstacle_types, this.obstacle_chances);
      }
      // when zone's quantity of obstacles made show milestone, and increment makingZone      
      else {
         if (makingZone > zones_quantity) {
            console.log(`makeInterval() should stop flow reaching here`);
            this.stopMakingObstacles = true;
            // this.waterSound.stop;
            // this.scene.start("Home");
         }
         else {
            chosenObstacleType = "milestone";
         }
      }

      // following playest, guarantee a Secret in zones 1 and 2
      if (makingZone <= 2 && this.numObstaclesCreatedInZone === this.obstaclesInZone - 2) {
         chosenObstacleType = "secret";
      }

      const obstacleSprites = this.obstacleMaker[chosenObstacleType]();
      this.placeObstaclesY(...obstacleSprites);
      this.placeObstaclesX[chosenObstacleType](obstacleSprites);

      if (testing) {
         //console.log(`obstacle ${this.numObstaclesCreatedInZone + 1} created in zone ${makingZone}`);
      }
      return chosenObstacleType;
   }

   placeObstaclesY(...components) {
      components.forEach((item) => {
         item.y = this.spawnY;
      });
   }

   testIfReadyForNextInterval() {
      this.previousY = this.getPreviousObstacleY();
      // console.log(previousY, this.ySpacing);
      if (this.previousY - this.spawnY > this.ySpacing) {
         // console.log('previousY:', this.previousY.toFixed(0), 'prev Yspacing:', this.ySpacing);
         this.makeInterval();
      }
   }

   // new obstacle created at spawnY, and any in-between objects go above
   makeInterval() {
      let chosenObstacleType = this.makeObstacle();
      // randomize new Y gap to next Obstacle
      this.ySpacing = Phaser.Math.Between(...this.ySpacingRange);

      this.checkIfDriftwood();
      this.checkIfBoulder();

      this.incrementObstacleCounter();
      this.updateProgressDisplay();
      this.updateLocator();
      if (testing) this.labelObstacleAndZoneID();

      if (chosenObstacleType === "milestone") {
         // increment makingZone
         // if zone exceeds limit stop creating obstacles 
         makingZone += 1;
         //console.log('Zone being made incremented to', makingZone);
         if (makingZone > zones_quantity) {
            this.stopMakingObstacles = true;
         } else {
            this.setZoneParameters(makingZone);
            this.numObstaclesCreatedInZone = 0;
            this.obstaclesInZone = this.zone.intervals;
            //this.getNextZone();
         }
      }

      if (this.previousObstacleWasLight) {
         if (searchlightWarned === false) {
            searchlightWarned = true;
            this.lightNearSound.play();
         }
         this.previousObstacleWasLight = false;
      }
      //console.log(this.milestones);
   }

   moveFurnitureY(y) {
      // at start of game move obstacles and associated furniture down from spawnY to player visible starting positions
      this.obstacles.incY(y);
      this.woods.incY(y);
      this.rocks.incY(y);
      if (testing) {
         this.idLabels.incY(y);
         // this.previousY = this.getPreviousObstacleY();
         // console.log('previousY:', this.previousY.toFixed(0), 'prev Yspacing:', this.ySpacing);
      }
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
            if (sensorOn == false) {
               sensorOn = true;
               this.sensorOnSound.play();
            }
         } // boat isn't near any Intel
         else {
            this.hideSensorCone();
            if (sensorOn == true) {
               sensorOn = false;
               this.sensorOffSound.play();
            }
         }
      }
   }

   setupSounds() {
      // play the sound of water on loop, volume 0.15
      this.waterSound = this.sound.add('snd_waterLoop', { volume: 0.15, loop: true });
      this.waterSound.play();

      this.lightNearSound = this.sound.add('snd_searchProximity', { volume: 0.5, loop: false });
      this.searchContactSound = this.sound.add('snd_searchContact', { volume: 0.2 });
      this.landCollideSound = this.sound.add('snd_landCollide', { volume: 0 });
      this.boomCollideSound = this.sound.add('snd_boomCollide', { volume: 0.5 });
      this.bridgeCollideSound = this.sound.add('snd_bridgeCollide', { volume: 0 });
      this.rapidsOverlapSound = this.sound.add('snd_rapidsOverlap', { volume: 0 });
      this.intelOverlapSound = this.sound.add('snd_intelOverlap', { volume: 0 });
      this.boomChainSound = this.sound.add('snd_boomChain', { volume: 0.15 });
      this.sensorOnSound = this.sound.add('snd_sensorOn', { volume: 0.3 });
      this.sensorOffSound = this.sound.add('snd_sensorOff', { volume: 0.3 });

      // this.sound.manager.maxSounds = 3;
   }

   // Player boat make & control
   makePlayer() {
      let start_x = gameWidth / 2; // game width screen + 2 * offset
      let start_y = displayHeight - controlPanelHeight - 10;
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

      this.cone_left = this.physics.add.sprite(start_x, start_y - this.player.coneYoffset, 'sensor2')
         .setOrigin(1, 0.5)
         .setVisible(false)
         .setDepth(9)
         .setAlpha(0.5)
         .setScale(1.1, 0.7)
         .setFlipX(true);
      this.cone_right = this.physics.add.sprite(start_x, start_y - this.player.coneYoffset, 'sensor2')
         .setOrigin(0, 0.5)
         .setVisible(false)
         .setAlpha(0.5)
         .setScale(1.1, 0.7)
         .setDepth(9);
      this.sensors.add(this.cone_left);
      this.sensors.add(this.cone_right);
   }

   showLeftSensorCone() {
      this.cone_left.x = this.player.x;
      this.cone_left.y = this.player.y - this.player.coneYoffset;
      this.cone_left
         .setVisible(true)
         .setScale(0.7, 0.7);
   }

   showRightSensorCone() {
      this.cone_right.x = this.player.x;
      this.cone_right.y = this.player.y - this.player.coneYoffset;
      this.cone_right
         .setVisible(true)
         .setScale(0.7, 0.7);
   }

   hideSensorCone() {
      this.cone_left
         .setVisible(false)
         .setPosition(-100, -100);
      this.cone_right
         .setVisible(false)
         .setPosition(-100, -100);
   }

   // UI HUD make & update
   makeHud() {
      // HUD centre at game centre, and don't scroll when river scroll sideways
      this.hud = this.add.container(displayWidth / 2, 0);
      this.hud.setDepth(99);
      this.hud.setScrollFactor(0);
      let y_UI_spacing = 35;
      let y = 45;
      this.makeLifeDisplay(y);
      y += y_UI_spacing;
      this.makeFuelDisplay(y);
      y += y_UI_spacing;
      this.makeProgressDisplay(y);
      y += y_UI_spacing;
      this.makeIntelDisplay(y);
      y += y_UI_spacing;

      this.makeLocator();
   }

   makeLocator() {
      const offsetX = 130;
      this.zoneOfZonesProgress = this.add.text(displayWidth - offsetX, displayHeight - 80, `Zone: ${boatInZone}/${zones_quantity}`, { font: '20px Verdana', color: '#ffffff' }).setOrigin(0, 0.5).setDepth(101);
      this.obstacleZoneProgress = this.add.text(displayWidth - offsetX, displayHeight - 50, `Local: `, { font: '20px Verdana', color: '#ffffff' }).setOrigin(0, 0.5).setDepth(101);
      this.obstacleGameProgress = this.add.text(displayWidth - offsetX, displayHeight - 20, `Game: `, { font: '20px Verdana', color: '#ffffff' }).setOrigin(0, 0.5).setDepth(101);
   }

   makeLifeDisplay(y) {
      this.lifeDisplay = this.add.text(0, y, `Life: ${this.player.life}`, hudStyle);
      this.lifeDisplay.setOrigin(0.5);
      this.hud.add(this.lifeDisplay);
   };

   makeProgressDisplay(y) {
      this.progressDisplay = this.add.text(0, y, `Passed: ${estimatedProgress}`, hudStyle);
      this.progressDisplay.setOrigin(0.5);
      this.hud.add(this.progressDisplay);
   };

   updateProgressDisplay() {
      this.progressDisplay.setText(`Passed: ${estimatedProgress}`);
   };
   updateLocator() {
      this.zoneOfZonesProgress.setText(`Zone: ${boatInZone}/${zones_quantity}`);
      this.obstacleZoneProgress.setText(`Local: ${this.estimatedProgressInZone}/${this.obstaclesInZone}`); // estimatePassed in Zone
      this.obstacleGameProgress.setText(`Game: ${estimatedProgress}/${this.countObstaclesInZones(zones_quantity)}`);
   }

   incrementObstacleCounter() {
      this.numObstaclesCreatedInZone += 1;
      // when 3rd obstacle created the 1st likely has exited or nearly so
      let x = this.numObstaclesCreatedInZone;
      this.estimatedProgressInZone = x <= 2 ? 0 : Math.abs(x - 2);
      estimatedProgress = this.numObstaclesPassedInPreviousZones + this.estimatedProgressInZone;
   }

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
         this.fuelDisplay.setTint(0xff00ff);
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

   // Boat control buttons make & control
   makeControlPanel() {
      const controlPanel = this.add.graphics();
      //controlPanel.setOrigin(0.5);
      // graphics don't have .setOrigin? always topLeft positioning?
      const panelMargin = 0;
      const panelWidth = displayWidth - panelMargin * 2;
      const panelHeight = controlPanelHeight;
      const panelX = panelMargin; // bankWidth + 
      const panelY = displayHeight - panelHeight - panelMargin + 1;

      controlPanel.fillStyle(0x000000, 0.3); // transparency
      controlPanel.fillRect(panelX, panelY, panelWidth, panelHeight);
      controlPanel.setInteractive();
   }

   // reposition existing buttons in low controlPanel
   makeControlButtons() {
      let top = displayHeight - controlPanelHeight + 35;
      let cameraCentreX = this.cameras.main.centerX;
      this.cameras.main.on('camera.scroll', this.updateButtonHitAreas, this);

      let gameCentreX = this.cameras.main.scrollX + displayWidth / 2;
      let scrollFactorX = this.cameras.main.scrollX / (gameWidth - displayWidth);
      let hitAreaOffsetX = scrollFactorX * displayWidth;

      let controlsXoffset = -70;
      let buttonXoffset = 38;
      let buttonYoffset = 60;
      let leftBtnX = cameraCentreX - buttonXoffset + controlsXoffset; // was 100
      let rightBtnX = cameraCentreX + buttonXoffset + controlsXoffset;

      Object.assign(this, { cameraCentreX, gameCentreX, leftBtnX, rightBtnX });
      // console.log(`scroll: ${this.cameras.main.scrollX}, cameraCentreX ${cameraCentreX}, gameCentreX ${gameCentreX}, leftBtnX ${leftBtnX}, rightBtnX ${rightBtnX}`);

      this.btnFast = new arrowButton(this, cameraCentreX + controlsXoffset, top, 'placeholderButtonUp', 'placeholderButtonDown', 'up', () => {
         this.player.motorForward();
      }, () => {
         this.player.neitherFastOrSlow();
      });
      this.btnFast.scrollFactorX = 0;

      top += buttonYoffset;
      this.btnLeft = new arrowButton(this, leftBtnX, top, 'placeholderButtonUp', 'placeholderButtonDown', '<', () => {
         this.player.turnLeft();
      }, () => { });
      this.btnLeft.scrollFactorX = 0;

      this.btnRight = new arrowButton(this, rightBtnX, top, 'placeholderButtonUp', 'placeholderButtonDown', '>', () => {
         this.player.turnRight();
      }, () => { });
      this.btnRight.scrollFactorX = 0;

      top += buttonYoffset;
      this.btnSlow = new arrowButton(this, cameraCentreX + controlsXoffset, top, 'placeholderButtonUp', 'placeholderButtonDown', 'v', () => {
         this.driftSpeed = this.riverSpeed / this.player.backward_ratio;
         this.player.engine = "backward";
         this.player.setTint(0xff00ff); // was bae946
         this.player.useFuel(this.player.backwardFuel);
      }, () => {
         this.player.neitherFastOrSlow();
      });
      this.btnSlow.scrollFactorX = 0;

      // this.btnLeft.setInteractive({ hitArea: new Phaser.Geom.Rectangle(this.btnLeft.width / 2 - hitAreaOffsetX, 0, this.btnLeft.width, this.btnLeft.height) });
   }

   makeArrowButtons() {
      let top = 200;
      let cameraCentreX = this.cameras.main.centerX;
      this.cameras.main.on('camera.scroll', this.updateButtonHitAreas, this);

      let gameCentreX = this.cameras.main.scrollX + displayWidth / 2;
      let scrollFactorX = this.cameras.main.scrollX / (gameWidth - displayWidth);
      let hitAreaOffsetX = scrollFactorX * displayWidth;

      let buttonXoffset = 38;
      let buttonYoffset = 60;
      let leftBtnX = cameraCentreX - buttonXoffset; // was 100
      let rightBtnX = cameraCentreX + buttonXoffset;

      Object.assign(this, { cameraCentreX, gameCentreX, leftBtnX, rightBtnX });
      // console.log(`scroll: ${this.cameras.main.scrollX}, cameraCentreX ${cameraCentreX}, gameCentreX ${gameCentreX}, leftBtnX ${leftBtnX}, rightBtnX ${rightBtnX}`);

      this.btnFast = new arrowButton(this, cameraCentreX, top, 'placeholderButtonUp', 'placeholderButtonDown', 'up', () => {
         this.player.motorForward();
      }, () => {
         this.player.neitherFastOrSlow();
      });
      this.btnFast.scrollFactorX = 0;

      top += buttonYoffset;
      this.btnLeft = new arrowButton(this, leftBtnX, top, 'placeholderButtonUp', 'placeholderButtonDown', '<', () => {
         this.player.turnLeft();
      }, () => { });
      this.btnLeft.scrollFactorX = 0;

      this.btnRight = new arrowButton(this, rightBtnX, top, 'placeholderButtonUp', 'placeholderButtonDown', '>', () => {
         this.player.turnRight();
      }, () => { });
      this.btnRight.scrollFactorX = 0;

      top += buttonYoffset;
      this.btnSlow = new arrowButton(this, cameraCentreX, top, 'placeholderButtonUp', 'placeholderButtonDown', 'v', () => {
         this.driftSpeed = this.riverSpeed / this.player.backward_ratio;
         this.player.engine = "backward";
         this.player.setTint(0xff00ff); // was bae946
         this.player.useFuel(this.player.backwardFuel);
      }, () => {
         this.player.neitherFastOrSlow();
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

   clearNavButtonEvents() {
      // to fix bug when lose life while button is pressed its repeating event carries on after respawn
      this.btnLeft.clearEvents();
      this.btnRight.clearEvents();
      // this.btnFast.clearEvents();
      // this.btnSlow.clearEvents();
   }

   // Scene control buttons (menu, pause, replay)
   makeMenuButton() {
      this.buttonMenu = new hudButton(this, 62, 30, 'placeholderButtonUp', 'placeholderButtonDown', 'Menu', () => {
         this.waterSound.stop();
         this.scene.start("Home");
      });
   }

   makePauseButton() {
      this.buttonPause = new hudButton(this, displayWidth - 62, 30, 'placeholderButtonUp', 'placeholderButtonDown', 'Pause', () => {
         this.scene.pause('Game');
         this.scene.launch("Pause");
      });
   }

   createGameOverButtons() {
      // this.buttonMenu = new hudButton(this, 62, 30, 'placeholderButtonUp', 'placeholderButtonDown', 'Menu', () => {
      //    console.log('pointer down -> menu');
      //    this.scene.start("Home");
      // });
      //this.hud.add(this.buttonMenu);

      if (keyboard != 'likely') {
         this.buttonPause.destroy();
      }

      this.buttonReplay = new hudButton(this, displayWidth - 62, 30, 'placeholderButtonUp', 'placeholderButtonDown', 'Replay', () => {
         // reset game (lives, fuel, position)
         this.player.health = this.player.initialHealth;
         this.player.fuel = this.player.initialFuel;
         this.gameOver = false;
         //this.obstacles.incY(-200);
         this.physics.resume();
         this.scene.restart();
      });
      //this.hud.add(this.buttonReplay);
   }

   // Making furniture/obstacles
   makeMilestone() {
      let milestone = new Rapids(this, 0, 0, "rapids");
      milestone.id = makingZone;
      this.milestones.add(milestone);
      this.milestone = milestone;
      // console.log(`Milestone before zone ${makingZone}`);
      return [milestone];
   }

   // getNextZone() {
   //    makingZone += 1;
   //    console.log('Zone incremented to', makingZone);
   //    this.setZoneParameters(makingZone);
   //    this.numObstaclesCreatedInZone = 0;
   //    this.obstaclesInZone = this.zone.intervals;
   // }

   makeStrayRock() {
      let rock = new Rock(this, 0, 0, "rock", 0);
      let ratioSpacingY = randomBiasMiddle();
      let offsetX = randomAvoidMiddle();
      rock.x = bankWidth + offsetX * displayWidth;
      let offsetY = ratioSpacingY * this.ySpacing;
      rock.y = this.spawnY - offsetY;
      rock.setVelocityY(this.driftSpeed);
      this.rocks.add(rock);
      console.log('placed rock at', Math.trunc(rock.x), Math.trunc(rock.y), 'after offset_X', offsetX.toFixed(2), '& offset_Y', ratioSpacingY.toFixed(2), Math.trunc(offsetY), 'of', this.ySpacing);
   }

   makeDriftwood() {
      //console.log('wood when making obstacle', this.numObstaclesCreatedInZone, 'at', this.spawnY);
      let wood = new Driftwood(this, 0, 0, "anim_driftwood", 0);
      let ratioSpacingY = randomBiasMiddle();
      let offsetX = randomAvoidMiddle();
      wood.x = bankWidth + offsetX * displayWidth;
      let offsetY = ratioSpacingY * this.ySpacing;
      wood.y = this.spawnY - offsetY;
      wood.setVelocityY(this.driftSpeed);
      wood.angle = 90;
      wood.setSize(18, 30, true); // set hitbox size, centred
      wood.play('splash_driftwood');
      this.woods.add(wood);
      // console.log('placed wood at', Math.trunc(wood.x), Math.trunc(wood.y), 'after offset_X', offsetX.toFixed(2), '& offset_Y', ratioSpacingY.toFixed(2), Math.trunc(offsetY), 'of', this.ySpacing);
   }

   makeBooms() {
      let leftBoom = null;
      let rightBoom = null;
      if (this.zone.boom.closable.chance == 0) {
         leftBoom = new Boom(this, 0, 0, 'boomUnitChain');
         rightBoom = new Boom(this, 0, 0, 'boomUnitChain');
      } else {
         const delay = this.zone.boom.closable.delay;
         const speed = this.zone.boom.closable.speed;
         leftBoom = new BoomClosable(this, 0, 0, 'boomUnitChain', delay, speed);
         rightBoom = new BoomClosable(this, 0, 0, 'boomUnitChain', delay, speed);
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

      let intel = new Intel(this, 0, 0, 'intel');
      this.intels.add(intel);
      let secret = new Secret(this, 0, 0, 'secret');

      let land_tower = new Land(this, 0, 0, 'land');
      // later use single tower texture and flip with Phaser
      let tower;
      if (this.towerBank === 'left') {
         tower = new Tower(this, 0, 0, 'tower_left');
      } else {
         tower = new Tower(this, 0, 0, 'tower_right');
      }

      let light = new Searchlight(this, 0, 0, 'searchlight', this.bank);

      // instead of checking in update() distance player to light, which would play too often, and seems to truncate sound, instead play once per light creation - but should delay until light is near player or at least visible on screen (spawns above screen)
      this.previousObstacleWasLight = true;

      // return [secret, intel, tower, light];
      return [secret, intel, light, tower, land_tower];
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
      return [rapidsLine, danger];
   }

   checkIfDriftwood() {
      if (this.zone.wood.minQuantity > 0) {
         this.makeDriftwood();
      }
   }
   checkIfBoulder() {
      if (this.zone.rock.minQuantity > 0) {
         this.makeStrayRock();
      }
   }

   // Placing objects within furniture/obstacles
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

      // need space to walk between capstan and edge of river (if manually turned)
      leftCapstan.x = bankWidth - 30;
      rightCapstan.x = bankWidth + displayWidth + 30;

      if (leftBoom.closable) {
         this.time.addEvent({
            delay: leftBoom.delay,
            callback: () => {
               this.boomChainSound.play();
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
               this.boomChainSound.play();
               rightBoom.x -= rightBoom.speed;
            },
            repeat: true,
            repeatCount: (rightBoom.x - leftBoom.x) / rightBoom.speed / 2,
         });
      }
   }

   // There is a search-tower on land, which helps player understand what the light circle is and where it comes from.
   placeSecret(secret, intel, light, tower, land_tower) {
      let x;
      let distSecretFromRiver = 45;
      let distTowerFromRiver = -20;

      if (this.bank === "left") {
         light.x = Phaser.Math.Between(bankWidth + light.width / 2, gameWidth + bankWidth - light.width / 2 - 80);

         intel.setOrigin(0, 0.5).setAlpha(0.3);
         secret.setOrigin(0, 0.5);
         x = bankWidth;
         intel.x = x;
         secret.x = x - distSecretFromRiver;

         land_tower.setOrigin(1, 0.5);
         tower.setOrigin(1, 0.5);
         x = gameWidth - bankWidth + distTowerFromRiver;
         land_tower.x = x + 20;
         tower.x = x + 20;
      }
      else if (this.bank === "right") {
         light.x = Phaser.Math.Between(bankWidth + light.width / 2 + 80, gameWidth + bankWidth - light.width / 2);

         intel.setOrigin(1, 0.5).setAlpha(0.3);
         secret.setOrigin(1, 0.5);
         x = gameWidth - bankWidth;
         intel.x = x;
         secret.x = x + distSecretFromRiver;

         land_tower.setOrigin(0, 0.5);
         tower.setOrigin(0, 0.5);
         x = bankWidth - distTowerFromRiver;
         land_tower.x = x - 20;
         tower.x = x - 20;
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

   // GameLoop or Events handling
   destroyPassedObject() {
      this.obstacles.getChildren().forEach(obstacle => {
         if (obstacle.getBounds().top > displayHeight) {
            obstacle.destroy();
         }
      });
      this.rocks.getChildren().forEach(child => {
         if (child.getBounds().top > displayHeight) {
            child.destroy();
         }
      });
      this.woods.getChildren().forEach(child => {
         if (child.getBounds().top > displayHeight) {
            child.destroy();
         }
      });
      // this.saveBestScore();
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

   applyRiverDrift(speed) {
      this.driftSpeed = speed;
      this.obstacles.setVelocityY(speed);
      this.rocks.setVelocityY(speed);
      this.woods.setVelocityY(speed);
      this.waterBG.tilePositionY -= speed / 60;
      if (testing) {
         this.idLabels.incY(speed / 60);
      }
   }

   saveBestScore() {
      let bestScoreStr = localStorage.getItem('bestScore');
      let bestScore = bestScoreStr && parseInt(bestScoreStr, 10);
      if (!bestScore || this.score > bestScore) {
         localStorage.setItem('bestScore', this.score);
      }
   };

   reachMilestone(player, milestone) {
      if (!this.milestoneTriggered[boatInZone] && milestone.id === boatInZone) {
         this.milestoneTriggered[boatInZone] = true;
         console.log(`Boat in zone ${boatInZone} reached milestoneID:${milestone.id} and flags ${this.milestoneTriggered}`);
         boatInZone += 1;
         if (boatInZone > zones_quantity) {
            // if (this.isZoneLastInGame() === true) {
            console.log('Game Over');
            this.physics.pause();
            this.gameOver = true;
            // this.scene.start("Home");
         }
      }
      else {
      }
   }

   // Overlap & collision handling
   setupColliders() {
      this.physics.add.overlap(this.player, this.milestones, this.reachMilestone, null, this);
      // quick test of milestone trigger zones, without bumping into obstacles
      if (!testing) {
         this.physics.add.overlap(this.player, this.obstacles, this.hitObstacle, null, this);
         this.physics.add.overlap(this.player, this.rapids, this.hitRapids, null, this);
         this.physics.add.collider(this.player, this.woods, this.hitDriftwood, null, this);
         this.physics.add.collider(this.player, this.rocks, this.hitRock, null, this);
         this.physics.add.overlap(this.player, this.intels, this.hitIntel, null, this);
         this.physics.add.overlap(this.sensors, this.secrets, this.senseSecret, null, this);
         this.physics.add.overlap(this.sensors, this.intels, this.senseIntel, null, this);
         this.physics.add.overlap(this.player, this.lights, this.boatSeen, null, this);
         this.physics.add.collider(this.player, this.land, this.hitLand, null, this);
         this.physics.add.collider(this.player, this.booms, this.hitBooms, null, this);
         this.physics.add.collider(this.player, this.bridges, this.hitBridges, null, this);
      }
   }

   boatSeen(boat, light) {
      let boatBounds = boat.getBounds();
      let lightBounds = light.getBounds();
      let overlapX = Math.min(lightBounds.right, boatBounds.right) - Math.max(lightBounds.left, boatBounds.left);
      let overlapY = Math.min(lightBounds.bottom, boatBounds.bottom) - Math.max(lightBounds.top, boatBounds.top);
      if (overlapX > 20 && overlapY > 20) {
         //console.log('Boat seen by light');
         this.searchContactSound.play();
         this.loseLife();
         // delay before tower's gun fires on boat
         // this.scene.time.addEvent({ delay: 1000, callback: this.loseLife, callbackScope: this });
      }
      else {
         // this.thatWasClose.play(); 
      }
      // console.log(`Light`, lightBounds.left, lightBounds.right, lightBounds.top, lightBounds.bottom);
      // console.log(`Boat`, boatBounds.left, boatBounds.right, boatBounds.top, boatBounds.bottom);
      // console.log(`Light/boat overlap: ${overlapX} ${overlapY}`);
   }

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
      //console.log('Intel run-over');
      //this.intelOverlapSound.play();
      this.player.intelScore += 3;
      this.updateIntelDisplay();
   }

   senseIntel(sensor, intel) {
      //console.log('Intel sensed');
      //this.intelOverlapSound.play();
      this.player.intelScore += 1;
      this.updateIntelDisplay();
   }
   senseSecret(sensor, secret) {
      // overlap secret on land, for Riverboat 2
   }

   hitLand(boat, land) {
      //console.log('Land Hit');
      land.body.enable = false;
      //this.landCollideSound.play();
      this.player.setVelocity(0, 0);
      // this.player.updateHealth(land.damage);
   }

   hitObstacle(boat, obstacle) {
   };

   loseLife() {
      this.invincible = true;
      this.player.life -= 1;
      this.updateLifeDisplay();

      this.cameras.main.shake(500);
      this.physics.pause();
      if (keyboard != 'likely') {
         this.clearNavButtonEvents();
      }

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
      this.rocks.incY(-200);
      this.woods.incY(-200);
      this.player.x = this.player.start_x;
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

   resetGame() {
   };

   // Testing & debugging
   debugObstacleChances() {
      console.log(`Zone ${makingZone} obstacles ${this.zone.intervals}: Secret = ${this.zone.obstacle.secret}, Boom = ${this.zone.obstacle.boom}, closable ${this.zone.boom.closable.chance}`);
      // Omitting unused parameters from JSON easily causes bugs!
      // if (makingZone > 2) {
      // closable ${this.zone.boom.closable.chance}
   }

   labelObstacleAndZoneID() {
      let idLabel = this.add.text(bankWidth + 12, this.spawnY, `${this.numObstaclesPassedInPreviousZones + this.numObstaclesCreatedInZone}`, { font: '36px Verdana', color: '#ffffff' }).setOrigin(0, 0.5).setDepth(101);
      this.idLabels.add(idLabel);
      let zoneLabel = this.add.text(bankWidth + displayWidth - 12, this.spawnY, `z${makingZone}-${this.numObstaclesCreatedInZone}`, { font: '36px Times', color: '#ffffff' }).setOrigin(1, 0.5).setDepth(101);
      this.idLabels.add(zoneLabel);
   }

   logging() {
   }

   // Utilities & helpers
   getPreviousObstacleY() {
      let yPrevious = 700;
      this.obstacles.getChildren().forEach(obstacle => {
         yPrevious = Math.min(obstacle.y, yPrevious);
      });
      return yPrevious;
   }

   isYspaceReadyForNextObstacle() {
      this.previousY = this.getPreviousObstacleY();
      // console.log('previousY:', this.previousY.toFixed(0), 'curr Yspacing:', this.ySpacing, 'prev obstacle ID:', this.madeInGame, 'prev in zone:', this.madeInZone);
      return this.previousY - this.spawnY > this.ySpacing;
   }

   isObstacleRemainingInZone() {
      return this.obstaclesInZone > this.numObstaclesCreatedInZone;
   }

   isZoneLastInGame() {
      return makingZone === zones_quantity;
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

   // Initialise game and zones
   getAllZonesData() {
      this.data = this.cache.json.get('zoneData');
      if (!testing) {
         zones_quantity = this.data.length - 1;
      } else {
         zones_quantity = zone_quantity_for_test;
      }
      console.log(`${zones_quantity} zones in game`);

      // this.milestoneTriggered = [false, false, false, false, false, false, false, false, false, false, false, false, false];
      // extra element so zone ID can match array index
      this.milestoneTriggered = new Array(zones_quantity + 1).fill(false);
   }

   setZoneParameters(numZone) {
      //let levelObjName = `Level_${ this.zoneNum }`;
      this.zone = this.data[numZone];
      this.obstacle_chances = [this.zone.obstacle.secret, this.zone.obstacle.boom, this.zone.obstacle.rapids];
      this.debugObstacleChances();

      // if zone was selected in menu
      if (makingZone > 1) {
         // for (let i = 1; i < makingZone; i++) {
         //    this.numObstaclesPassedInPreviousZones += this.data[i].intervals;
         // }
         this.numObstaclesPassedInPreviousZones = countObstaclesInZones(makingZone);
      }
      estimatedProgress = this.numObstaclesPassedInPreviousZones;
      // pre-placed obstacle at start of game must be accounted for
      this.obstaclesInZone = this.zone.intervals;

      if (testing) {
         this.riverSpeed = test_river_speed; // global test speed 
      } else {
         this.riverSpeed = this.zone.riverSpeed;
      }

      // convert zone data into pre-existing game variables
      // perhaps this can be replaced by direct references to zone data
      this.ySpacingRange = [this.zone.ySpacing.min, this.zone.ySpacing.max];
      this.ySpacing = Phaser.Math.Between(...this.ySpacingRange);

      this.boomGapRange = [this.zone.boom.gapMin, this.zone.boom.gapMax];
      this.boom_length_min = this.zone.boom.lengthMin;
      this.boom_closable_chance = this.zone.boom.closable.chance;
      this.boom_closable_delay = this.zone.boom.closable.delay;
      this.boom_closable_speed = this.zone.boom.closable.speed;
   }

   countObstaclesInZones(topZone) {
      let count = 0;
      for (let i = 1; i <= topZone; i++) {
         count += this.data[i].intervals;
      }
      return count;
   }

   initialiseVariables() {
      boatInZone = makingZone;
      this.obstacle_types = ['secret', 'boom', 'rapids'];
      this.spawnY = spawn_above_screen_Y;

      this.numObstaclesCreatedInZone = 0;
      this.numObstaclesPassedInPreviousZones = 0;

      this.stopMakingObstacles = false;
      this.gameOver = false;
      this.previousObstacleWasLight = false;

      this.intel_alert = 180;
      this.light_alert = 250;

      this.fontSize = 16;
      this.lineHeight = 70;
      this.fontOptions = { fontSize: `${this.fontSize}px`, color: '#999' };
   }

   setupInput() {
      this.input.scene.active = true;
      this.makeMenuButton();
      if (keyboard != 'likely') {
         this.makePauseButton();
         this.makeControlButtons();
         // this.makeArrowButtons();
      }
      this.cursors = this.input.keyboard.createCursorKeys();
      // add W,A,S,D to cursors so they work in addition to the arrow keys
      this.cursors.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
      this.cursors.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
      this.cursors.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
      this.cursors.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
      this.input.keyboard.on('keyup', this.anyKey, this);
   }

   // Tiles and physics groups
   makeTiledRiverBackground() {
      this.waterBG = this.add.tileSprite(0, 0, gameWidth, displayHeight, 'water');
      this.waterBG.setOrigin(0, 0);
      //make background tileSprite scroll with camera
      this.waterBG.tilePositionX = this.cameras.main.scrollX;
      this.waterBG.tilePositionY = this.cameras.main.scrollY;
   }

   createPhysicsGroups() {
      this.land = this.physics.add.group({ runChildUpdate: true });
      this.booms = this.physics.add.group({ runChildUpdate: true });
      this.bridges = this.physics.add.group({ runChildUpdate: true });
      this.rapids = this.physics.add.group({ runChildUpdate: true });
      this.woods = this.physics.add.group({ runChildUpdate: true });
      this.rocks = this.physics.add.group({ runChildUpdate: true });
      this.sensors = this.physics.add.group({ runChildUpdate: true });
      this.secrets = this.physics.add.group({ runChildUpdate: true });
      this.intels = this.physics.add.group({ runChildUpdate: true });
      this.lights = this.physics.add.group({ runChildUpdate: true });
      // decoration of land and water
      this.milestones = this.physics.add.group({ runChildUpdate: true });
      this.obstacles = this.physics.add.group({ runChildUpdate: true });
      this.idLabels = this.physics.add.group({ runChildUpdate: true });
   }
};
