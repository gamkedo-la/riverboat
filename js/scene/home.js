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
      //this.input.on('pointerdown', () => this.scene.start('Game'));

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

      top += 120;
      this.buttonPlay = this.add.text(gameWidth / 2, top, 'Gallery', { font: '32px Arial', color: '#ffffff' })
         .setOrigin(0.5)
         .setInteractive();
      this.buttonPlay.on('pointerdown', () => this.scene.start('Gallery'));

      top += 70;
      this.buttonPlay = this.add.text(gameWidth / 2, top, 'Play game', { font: '32px Arial', color: '#ffffff' })
         .setOrigin(0.5)
         .setInteractive();
      this.buttonPlay.on('pointerdown', () => this.scene.start('Game'));

      top += 70;
      this.buttonCredits = this.add.text(gameWidth / 2, top, 'Credits', { font: '32px Arial', color: '#ffffff' })
         .setOrigin(0.5)
         .setInteractive();
      this.buttonCredits.on('pointerdown', () => this.scene.start('Credits'));

      top += 90;
      this.buttonScore = new uiButton(this, gameWidth / 2, top, 'placeholderButtonUp', 'placeholderButtonDown', 'Scores', () => { console.log('pointer down -> show High Scores'); });

      top += 125;
      this.add.text(gameWidth / 2, top, 'ESCape key to return here', { font: '22px Arial', color: '#ffffff' }).setOrigin(0.5);
   };

   makeMenu(menu) {
      menu.forEach(menuItem => {

      });
   }

}
