class Credits extends Phaser.Scene {
   constructor() {
      super('Credits');
   }

   create() {
      this.cameras.main.setBackgroundColor(0x33bb77);

      // if (keyboard != 'likely') {
      this.makeMenuButton();
      //}

      this.add.text(displayWidth / 2, 100, 'Credits', { font: '64px Arial', color: '#000000' })
         .setOrigin(0.5);

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
