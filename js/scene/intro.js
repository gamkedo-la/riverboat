// an image and text to help player undersand aim of game (collecting Intel) and how to do that
class Intro extends Phaser.Scene {
   constructor() {
      super('Intro');
   }
   create() {
      let cutscene = this.add.image(0, 0, 'cutscene').setOrigin(0);
      let text = this.add.text(0, 0, 'River Spy', { font: '24px Verdana', color: '#ffffff' }).setOrigin(0.5);
      let buttonContinue = new hudButton(this, 62, 30, 'placeholderButtonUp', 'placeholderButtonDown', 'Menu', () => {
         this.scene.start("Home");
      });
   }
}
