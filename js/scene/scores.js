class Scores extends Phaser.Scene {
   constructor() {
      super('Scores');
   }

   create() {
      this.cameras.main.setBackgroundColor(0xf5bf03); // gold

      this.add.text(displayWidth / 2, 100, 'High Scores', { font: '48px Arial', color: '#000000' })
         .setOrigin(0.5);

      this.input.keyboard.on('keyup', this.anyKey, this);
   };

   anyKey(event) {
      let code = event.keyCode;
      if (code === Phaser.Input.Keyboard.KeyCodes.ESC) {
         this.scene.start('Home');;
      }
   };
}
