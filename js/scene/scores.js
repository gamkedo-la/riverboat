class Scores extends Phaser.Scene {
   constructor() {
      super('Scores');
   }

   init() {
      let scores = localStorage.getItem('scores');
      intelHighScores = scores ? JSON.parse(scores) : [];
      if (!intelHighScores.length) {
         intelHighScores = [0, 0, 0];
      }
   }

   create() {
      this.cameras.main.setBackgroundColor(0xf5bf03); // gold

      this.add.text(displayWidth / 2, 70, 'High Scores', { font: '48px Arial', color: '#000000' })
         .setOrigin(0.5);

      intelHighScores.forEach((score, index) => {
         this.add.text(50, 120 + index * 60, `${index + 1} Intel: ${score}`, { font: '36px Arial', fill: '#000000' });
      });

      this.makeMenuButton();
      this.input.keyboard.on('keyup', this.anyKey, this);
   };

   anyKey(event) {
      let code = event.keyCode;
      if (code === Phaser.Input.Keyboard.KeyCodes.ESC) {
         this.scene.start('Home');;
      }
   };

   makeMenuButton() {
      this.buttonMenu = new hudButton(this, 62, 30, 'placeholderButtonUp', 'placeholderButtonDown', 'Menu', () => {
         console.log('pointer down -> menu');
         this.scene.start("Home");
      });
   }
}
