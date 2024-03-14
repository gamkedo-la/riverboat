class Home extends Phaser.Scene {
   constructor() {
      super('Home');
   }

   init() {
      this.menu = [
         { scene: 'Gallery', text: 'Gallery' },
         { scene: 'Game', text: 'Play game' },
         { scene: 'Credits', text: 'Credits' },
      ];
   };

   create() {
      this.cameras.main.setBackgroundColor(waterColor);

      let gameWidth = this.sys.game.config.width;
      let gameHeight = this.sys.game.config.height;
      let gameCentre = [gameWidth / 2, gameHeight / 2];
      let titleCentre = [gameWidth / 2, 60];

      let text = this.add.text(...titleCentre, 'River boat', { font: '36px Verdana', color: '#ffffff' })
         .setOrigin(0.5)
         .setDepth(1);

      let textPanel = this.add.graphics();
      textPanel.fillStyle(0x000000, 0.7);
      let margin = 12;
      let left = gameWidth / 2 - text.width / 2 - margin;
      let top = 60 - text.height / 2 - margin;
      textPanel.fillRect(left, top, text.width + margin * 2, text.height + margin * 2);

      top += 100;
      this.buttonPlay = this.add.text(gameWidth / 2, top, 'Test (zone 0)', { font: '24px Verdana', color: '#ffffff' })
         .setOrigin(0.5)
         .setInteractive();
      this.buttonPlay.on('pointerdown', () => {
         currentZone = 0;
         this.scene.start('Game');
      });

      top += 60;
      this.buttonScore = new uiButton(this, gameWidth / 2, top, 'placeholderButtonUp', 'placeholderButtonDown', 'Help', () => {
         currentZone = 1;
         this.scene.start('Help');
      });

      top += 60;
      this.buttonScore = new uiButton(this, gameWidth / 2, top, 'placeholderButtonUp', 'placeholderButtonDown', 'Play', () => {
         currentZone = 1;
         this.scene.start('Game');
      });

      top += 60;
      // this.buttonScore = new uiButton(this, gameWidth / 2, top, 'placeholderButtonUp', 'placeholderButtonDown', 'To zone 2', () => {
      //    currentZone = 2;
      //    this.scene.start('Game');
      // });
      let incremX = 44;
      let x = 70; //77;
      this.buttonZone2 = new zoneButton(this, x, top, 'placeholderButtonUp', 'placeholderButtonDown', '2', () => {
         currentZone = 2;
         this.scene.start('Game');
      });
      x += incremX;
      this.buttonZone3 = new zoneButton(this, x, top, 'placeholderButtonUp', 'placeholderButtonDown', '3', () => {
         currentZone = 3;
         this.scene.start('Game');
      });
      x += incremX;
      this.buttonZone4 = new zoneButton(this, x, top, 'placeholderButtonUp', 'placeholderButtonDown', '4', () => {
         currentZone = 4;
         this.scene.start('Game');
      });
      x += incremX;
      this.buttonZone5 = new zoneButton(this, x, top, 'placeholderButtonUp', 'placeholderButtonDown', '5', () => {
         currentZone = 5;
         this.scene.start('Game');
      });
      x += incremX;
      this.buttonZone6 = new zoneButton(this, x, top, 'placeholderButtonUp', 'placeholderButtonDown', '6', () => {
         currentZone = 6;
         this.scene.start('Game');
      });
      x += incremX + 1;
      this.buttonZone7 = new zoneButton(this, x, top, 'placeholderButtonUp', 'placeholderButtonDown', '7', () => {
         currentZone = 7;
         this.scene.start('Game');
      });
      // top += 60;
      // this.buttonScore = new uiButton(this, gameWidth / 2, top, 'placeholderButtonUp', 'placeholderButtonDown', 'High score', () => this.scene.start('Scores'));

      top += 60;
      this.buttonScore = new uiButton(this, gameWidth / 2, top, 'placeholderButtonUp', 'placeholderButtonDown', 'Credits', () => {
         currentZone = 1;
         this.scene.start('Credits');
      });

      if (keyboard === 'likely') {
         top += 70;
         this.add.text(gameWidth / 2, top, 'Escape key to return here.', { font: '20px Verdana', color: '#ffffff' }).setOrigin(0.5);
         top += 40;
         this.add.text(gameWidth / 2, top, 'P key to Pause or Resume.', { font: '20px Verdana', color: '#ffffff' }).setOrigin(0.5);
         top += 40;
         this.add.text(gameWidth / 2, top, 'Arrow or WASD keys', { font: '20px Verdana', color: '#ffffff' }).setOrigin(0.5);
         top += 25;
         this.add.text(gameWidth / 2, top, 'up=fast, down=slow.', { font: '20px Verdana', color: '#ffffff' }).setOrigin(0.5);
      }
      else {
         top += 90; // while fewer text lines for phone than keyboard
         this.add.text(gameWidth / 2, top, 'Navigation buttons in-game.', { font: '20px Verdana', color: '#ffffff' }).setOrigin(0.5);
         top += 45;
         this.add.text(gameWidth / 2, top, 'Exit by closing phone display.', { font: '20px Verdana', color: '#ffffff' }).setOrigin(0.5);
      }
   };

   makeMenu(menu) {
      menu.forEach(menuItem => {

      });
   }

}
