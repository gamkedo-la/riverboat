class Boot extends Phaser.Scene {
   constructor() {
      super('Boot');
   }

   init() {
      let os = this.sys.game.device.os;
      deviceOS = "notPhone";
      keyboard = "unlikely";
      if (os.android) {
         deviceOS = "android";
      }
      else if (os.iOS) {
         deviceOS = "ios";
      }
      else if (os.windowsPhone) {
         deviceOS = "wphone";
      }
      else if (os.kindle) {
         deviceOS = "kindle";
      }
      else {
         keyboard = "likely";
      }
      console.log(deviceOS, keyboard);
   }

   preload() {
      this.load.image('logo', 'public/art/logo_hometeam.png');
   };

   create() {
      this.scene.start('Setup');
   };
}
