class Boot extends Phaser.Scene {
   constructor() {
      super('Boot');
   }

   preload() {
      this.load.image('logo', 'public/art/logo_hometeam.png');
   };

   create() {
      this.scene.start('Setup');
   };
}