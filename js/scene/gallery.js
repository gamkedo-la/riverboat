class Gallery extends Phaser.Scene {
   constructor() {
      super('Gallery');
      this.boomGapRange = [80, 140];
      this.boom_length_min = 50;
   }

   create() {
      this.cameras.main.setBackgroundColor(0x3333dd);
      this.add.text(displayWidth / 2, 30, 'Obstacles', { font: '24px Arial', fill: '#ffffff' })
         .setOrigin(0.5);

      this.obstacles = this.physics.add.group();
      this.makeBoomPair();
      console.log(this.obstacles);

      this.cursors = this.input.keyboard.createCursorKeys();
      this.input.keyboard.on('keyup', this.anyKey, this);
   };

   makeBoomPair() {
      let leftBoom = new Boom(this, 0, 0, 'boom');
      let rightBoom = new Boom(this, 0, 0, 'boom');
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

   anyKey(event) {
      let code = event.keyCode;
      if (code === Phaser.Input.Keyboard.KeyCodes.ESC) {
         this.scene.start('Home');
      }
   };
}