class Gallery extends Phaser.Scene {
   constructor() {
      super('Gallery');
   }

   create() {
      this.cameras.main.setBackgroundColor(0x3333dd);

      this.add.text(displayWidth / 2, 30, 'Obstacles', { font: '24px Arial', fill: '#ffffff' })
         .setOrigin(0.5);

   };


   anyKey(event) {
      let code = event.keyCode;
      if (code === Phaser.Input.Keyboard.KeyCodes.ESC) {
         this.scene.start('Home');;
      }
   };
}