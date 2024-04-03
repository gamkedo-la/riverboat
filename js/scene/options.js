// an image and text to help player undersand aim of game (collecting Intel) and how to do that
class Options extends Phaser.Scene {
   constructor() {
      super('Options');
   }
   create() {
      let style = {
         style: {
            font: 'bold 25px Arial',
            fill: 'white',
            wordWrap: { width: 290 }
         }
      };

      let text = this.add.text(5 + gameWidth / 2, 300, "Options: difficulty, sound etc", {
         font: '24px Arial',
         fill: 'black',
         wordWrap: { width: 320 }
      });
      text.setOrigin(0.5, 0);

      this.makeMenuButton();
   }
   makeMenuButton() {
      this.buttonMenu = new hudButton(this, 62, 30, 'placeholderButtonUp', 'placeholderButtonDown', 'Menu', () => {
         this.scene.start("Home");
      }, 1);
   }
}
