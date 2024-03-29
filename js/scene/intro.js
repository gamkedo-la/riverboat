// an image and text to help player undersand aim of game (collecting Intel) and how to do that
class Intro extends Phaser.Scene {
   constructor() {
      super('Intro');
   }
   create() {
      let cutscene = this.add.image(70, -20, 'spy_cutscene').setOrigin(0);
      cutscene.setScale(0.8);

      let style = {
         style: {
            font: 'bold 25px Arial',
            fill: 'white',
            wordWrap: { width: 290 }
         }
      };

      let text = this.add.text(5 + gameWidth / 2, 300, "Spy on enemy secrets! When your boat is near a secret, a sensor cone appears. Gain score when your cone overlaps an 'INTEL' icon. Slow while spying for extra score.", {
         font: '24px Arial',
         fill: 'black',
         wordWrap: { width: 320 }
      });
      text.setOrigin(0.5, 0);

      // { font: '24px Verdana', color: '#000000', wordWrap: { width: 280; } }).setOrigin(0.5, 0);
      //let text = this.add.text(0, 0, '', { font: '24px Verdana', color: '#ffffff' }).setOrigin(0.5);

      let buttonContinue = new uiButton(this, 180, 550, 'placeholderButtonUp', 'placeholderButtonDown', 'Start', () => {
         this.scene.start("Home");
      });
      buttonContinue;
   }
}
