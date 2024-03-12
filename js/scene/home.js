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
      let titleCentre = [gameWidth / 2, 80];

      let text = this.add.text(...titleCentre, 'River boat', { font: '36px Arial', color: '#ffffff' })
         .setOrigin(0.5)
         .setDepth(1);

      let textPanel = this.add.graphics();
      textPanel.fillStyle(0x000000, 0.7);
      let margin = 12;
      let left = gameWidth / 2 - text.width / 2 - margin;
      let top = 80 - text.height / 2 - margin;
      textPanel.fillRect(left, top, text.width + margin * 2, text.height + margin * 2);
      top += 50;

      top += 50;
      this.buttonPlay = this.add.text(gameWidth / 2, top, 'Test zone', { font: '24px Arial', color: '#ffffff' })
         .setOrigin(0.5)
         .setInteractive();
      this.buttonPlay.on('pointerdown', () => {
         currentZone = 0;
         this.scene.start('Game');
      });

      top += 50;
      this.buttonPlay = this.add.text(gameWidth / 2, top, 'Play game', { font: '24px Arial', color: '#ffffff' })
         .setOrigin(0.5)
         .setInteractive();
      this.buttonPlay.on('pointerdown', () => {
         currentZone = 1;
         this.scene.start('Game');
      });

      top += 50;
      this.buttonPlay = this.add.text(gameWidth / 2, top, 'Goto Zone 2', { font: '24px Arial', color: '#ffffff' })
         .setOrigin(0.5)
         .setInteractive();
      this.buttonPlay.on('pointerdown', () => {
         currentZone = 2;
         this.scene.start('Game');
      });

      top += 50;
      this.buttonCredits = this.add.text(gameWidth / 2, top, 'Credits', { font: '24px Arial', color: '#ffffff' })
         .setOrigin(0.5)
         .setInteractive();
      this.buttonCredits.on('pointerdown', () => this.scene.start('Credits'));

      top += 60;
      this.buttonScore = new uiButton(this, gameWidth / 2, top, 'placeholderButtonUp', 'placeholderButtonDown', 'High Scores', () => this.scene.start('Scores'));

      top += 80;
      if (keyboard === 'likely') {
         this.add.text(gameWidth / 2, top, 'P key to Pause or Restart.', { font: '20px Arial', color: '#ffffff' }).setOrigin(0.5);
         top += 45;
         this.add.text(gameWidth / 2, top, 'Escape key to return here.', { font: '20px Arial', color: '#ffffff' }).setOrigin(0.5);
         top += 45;
         this.add.text(gameWidth / 2, top, 'Arrow or WASD keys', { font: '20px Arial', color: '#ffffff' }).setOrigin(0.5);
         top += 30;
         this.add.text(gameWidth / 2, top, 'Up=fast, Down=slow.', { font: '20px Arial', color: '#ffffff' }).setOrigin(0.5);
      }
      else {
         this.add.text(gameWidth / 2, top, 'Keyboard required currently', { font: '20px Arial', color: '#ffffff' }).setOrigin(0.5);
      }

      //top += 155;
      // this.add.text(gameWidth / 2, top, 'To exit game on mobile device close display', { font: '22px Arial', color: '#ffffff' }).setOrigin(0.5);
   };

   makeMenu(menu) {
      menu.forEach(menuItem => {

      });
   }

}
