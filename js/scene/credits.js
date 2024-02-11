const credits = new Phaser.Scene('Credits');

credits.init = function () {

};


credits.create = function () {
   this.cameras.main.setBackgroundColor(0x33bb77);

   this.add.text(displayWidth / 2, 100, 'Credits', { font: '64px Arial', fill: '#000000' })
      .setOrigin(0.5);

   this.input.keyboard.on('keyup', this.anyKey, this);
};


credits.anyKey = function (event) {
   let code = event.keyCode;
   if (code === Phaser.Input.Keyboard.KeyCodes.ESC) {
      this.scene.start('Home');;
   }
};