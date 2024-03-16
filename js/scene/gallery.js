class Gallery extends Phaser.Scene {
   constructor() {
      super('Gallery');
      this.boomGapRange = [80, 140];
      this.boom_length_min = 50;
      this.y_locations = [100, 230, 360, 460];
   }

   create() {
      this.cameras.main.setBackgroundColor(0x3333dd);
      if (keyboard != 'likely') {
         this.makeMenuButton();
      }

      this.add.text(displayWidth / 2, 30, 'Obstacles', { font: '24px Arial', color: '#ffffff' })
         .setOrigin(0.5);

      this.obstacles = this.physics.add.group();
      this.makeBoomPair();
      // this.makeBridge();
      this.makeRapids();
      this.makeSecret();
      // console.log(this.obstacles);

      this.cursors = this.input.keyboard.createCursorKeys();
      this.input.keyboard.on('keyup', this.anyKey, this);
   };

   makeBoomPair() {
      let leftBoom = null;
      let rightBoom = null;
      if (this.zone.boom.closable.chance == 0) {
         leftBoom = new Boom(this, 0, 0, 'boomUnitChain');
         rightBoom = new Boom(this, 0, 0, 'boomUnitChain');
      } else {
         const delay = this.zone.boom.delay;
         const speed = this.zone.boom.speed;
         leftBoom = new BoomClosable(this, 0, 0, 'boomUnitChain', delay, speed);
         rightBoom = new BoomClosable(this, 0, 0, 'boomUnitChain', delay, speed);
      }
      // because X gap measured from leftBoom's right-hand edge
      leftBoom.setOrigin(1, 0); // class default is 0,0
      this.placeBoomPair(leftBoom, rightBoom);
   }

   // in game also calculates Y based on previous Obstacle
   // here just a fixed Y position in static Gallery
   placeBoomPair(leftBoom, rightBoom) {
      // gap between left and right booms
      let gapSize = Phaser.Math.Between(...this.boomGapRange);
      // left side of gap's X coordinate i.e. right edge of left boom
      let gapLeftMin = this.boom_length_min;
      let gapLeftMax = 360 - gapSize - this.boom_length_min;
      let gapLeftRange = [gapLeftMin, gapLeftMax];
      let xGapLeft = Phaser.Math.Between(...gapLeftRange);
      leftBoom.x = xGapLeft;
      rightBoom.x = xGapLeft + gapSize;
      let yBoom = 100; // gallery
      leftBoom.y = yBoom;
      rightBoom.y = yBoom;
   };

   // choose left or right location of secret
   // protruding land and on that is enemy installation
   // on opposite bank, another land with tower (for searchlight)
   makeSecret() {
      let secretBank = "right";
      let towerBank = (secretBank === 'left') ? 'right' : 'left';

      let land_secret = new Land(this, 0, 0, 'land');
      let secret = new Secret(this, 0, 0, 'secret', secretBank);
      this.placeSecret(land_secret, secret, secretBank);

      let land_tower = new Land(this, 0, 0, 'land');
      // later use single tower texture and flip with Phaser
      let tower = new Tower(this, 0, 0, 'tower_left');
      this.placeTower(land_tower, tower, towerBank);
   }

   placeSecret(land, secret, bank) {
      let x;
      let y = this.y_locations[2]; // fixed in Gallery
      land.y = y;
      secret.y = y;
      if (bank === "left") {
         land.setOrigin(0, 0.5);
         secret.setOrigin(0, 0.5);
         x = 0;
         land.x = x;
         secret.x = x + 20;
      }
      else if (bank === "right") {
         land.setOrigin(1, 0.5);
         secret.setOrigin(1, 0.5);
         land.x = displayWidth;
         secret.x = displayWidth - 20;
      }
   }

   placeTower(land, tower, bank) {
      let x;
      let y = this.y_locations[2]; // fixed in Gallery
      land.y = y;
      tower.y = y;
      if (bank === "left") {
         land.setOrigin(0, 0.5);
         tower.setOrigin(0, 0.5);
         x = 0;
         land.x = x;
         tower.x = x + 20;
      }
      else if (bank === "right") {
         land.setOrigin(1, 0.5);
         tower.setOrigin(1, 0.5);
         land.x = displayWidth;
         tower.x = displayWidth - 20;
      }
   }

   makeRapids() {
      let rapids = new Rapids(this, 0, 0, "rapids");
      this.placeRapids(rapids);
   }
   placeRapids(rapids) {
      rapids.y = this.y_locations[3];
   }

   // all swing/tower bridges have small central gap
   makeBridge() {
      let leftBridge = new BridgeSide(this, 0, 0, "bridge");
      let rightBridge = new BridgeSide(this, 0, 0, "bridge");
      leftBridge.setOrigin(1, 0.5); // class default X origin 0
      this.placeBridgeSides(leftBridge, rightBridge);
      let van = new Van(this, 0, this.y_locations[1], "van");
   }

   placeBridgeSides(leftBridge, rightBridge) {
      let gapSize = 100;
      // left side of gap's X coordinate i.e. right edge of left boom
      let xGapLeft = 130;
      leftBridge.x = xGapLeft;
      rightBridge.x = xGapLeft + gapSize;
      let y = this.y_locations[1]; // gallery
      leftBridge.y = y;
      rightBridge.y = y;
   };
   anyKey(event) {
      let code = event.keyCode;
      if (code === Phaser.Input.Keyboard.KeyCodes.ESC) {
         this.scene.start('Home');
      }
   };
}
