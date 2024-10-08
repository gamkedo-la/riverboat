class Home extends Phaser.Scene {
   constructor() {
      super('Home');
   }

   init() {
      this.menu = [
         { scene: 'Game', text: 'Play game' },
         { scene: 'Credits', text: 'Credits' },
      ];
   };

   create() {
      this.cameras.main.setBackgroundColor(waterColor);

      let gameWidth = this.sys.game.config.width;
      let gameHeight = this.sys.game.config.height;
      let gameCentre = [gameWidth / 2, gameHeight / 2];
      let titleTop = 60;
      let titleCentre = [gameWidth / 2, titleTop];

      let text = this.add.text(...titleCentre, 'Spy Boat', { font: '36px Verdana', color: '#ffffff' })
         .setOrigin(0.5)
         .setDepth(1);

      let textPanel = this.add.graphics();
      textPanel.fillStyle(0x000000, 0.7);
      let margin = 12;
      let left = gameWidth / 2 - text.width / 2 - margin;
      let top = titleTop - text.height / 2 - margin;
      textPanel.fillRect(left, top, text.width + margin * 2, text.height + margin * 2);

      left = 110;
      top += 60 + 60;

      this.buttonPlay = new hudButton(this, left, top, 'placeholderButtonUp', 'placeholderButtonDown', 'Play', () => {
         makingZone = 1;
         this.scene.start('Game');
      }, 1);

      this.add.text(240, top, 'goto zone:', { font: '20px Verdana', color: '#ffffff' }).setOrigin(0.5);

      // Zone choice - buttons to jump direct to start of numbered zone
      top += 60;
      let incremX = 45;
      let x = left - 40;

      for (let i = 2; i <= 7; i++) {
         this[`buttonZone${i}`] = new zoneButton(this, x, top, 'placeholderButtonUp', 'placeholderButtonDown', i.toString(), () => {
            makingZone = i;
            this.scene.start('Game');
         });
         x += incremX;
      }

      top += 70;
      // show personal High Scores to help player understand aim of game
      this.buttonScore = new hudButton7(this, left, top, 'placeholderButtonUp', 'placeholderButtonDown', 'Scores', () => this.scene.start('Scores'), 1);

      this.buttonCredits = new hudButton7(this, left + 140, top, 'placeholderButtonUp', 'placeholderButtonDown', 'Credits', () => {
         makingZone = 1;
         this.scene.start('Credits');
      }, 1); // final parameter is Alpha

      top += 60;
      this.buttonHelp = new hudButton(this, left + 130, top, 'placeholderButtonUp', 'placeholderButtonDown', 'Help', () => {
         makingZone = 1;
         this.scene.start('Help');
      }, 1);

      // this.buttonOptions = new hudButton7(this, left, top, 'placeholderButtonUp', 'placeholderButtonDown', 'Options', () => {
      //    makingZone = 1;
      //    this.scene.start('Options');
      // }, 1);

      if (keyboard === 'likely') {
         top += 60;
         this.add.text(gameWidth / 2, top, 'Escape key return here.', { font: '20px Verdana', color: '#ffffff' }).setOrigin(0.5);
         top += 40;
         this.add.text(gameWidth / 2, top, 'P key Pause or Resume.', { font: '20px Verdana', color: '#ffffff' }).setOrigin(0.5);
         top += 40;
         this.add.text(gameWidth / 2, top, 'Arrow or WASD keys', { font: '20px Verdana', color: '#ffffff' }).setOrigin(0.5);
         top += 25;
         this.add.text(gameWidth / 2, top, 'up=fast, down=slow.', { font: '20px Verdana', color: '#ffffff' }).setOrigin(0.5);
      }
      else {
         top += 80; // while fewer text lines for phone than keyboard
         this.add.text(gameWidth / 2, top, 'Navigation buttons in-game.', { font: '20px Verdana', color: '#ffffff' }).setOrigin(0.5);
         top += 45;
         this.add.text(gameWidth / 2, top, 'Exit by closing phone display.', { font: '20px Verdana', color: '#ffffff' }).setOrigin(0.5);
      }
   };
}
