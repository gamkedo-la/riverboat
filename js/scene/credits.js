class Credits extends Phaser.Scene {
   constructor() {
      super('Credits');
   }

   create() {
      this.cameras.main.setBackgroundColor(0x33bb77);

      if (keyboard != 'likely' || alwaysButtons == true) {
         this.makeMenuButton();
      }

      this.add.text(220, 50, 'Credits', { font: '48px Arial', color: '#000000' })
         .setOrigin(0.5);


      this.add.text(30, 100, 'Someone', { font: '20px Arial', color: '#000000' })
         .setOrigin(0, 0);

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
