class Scores extends Phaser.Scene {
   constructor() {
      super('Scores');
   }

   init() {
   }

   create() {
      this.cameras.main.setBackgroundColor(0xf5bf03); // gold

      this.add.text(displayWidth / 2, 80, 'Spying scores', { font: '48px Arial', color: '#000000' })
         .setOrigin(0.5);

      allScores.forEach((score, index) => {
         this.add.text(50, 130 + index * 60, `${index + 1} Intel: ${allScores[index].intel}`, { font: '36px Arial', fill: '#000000' });
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
         this.scene.start("Home");
      }, 1);
   }
}
