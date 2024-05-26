// an image and text to help player undersand aim of game (collecting Intel) and how to do that
class Intro extends Phaser.Scene {
   constructor() {
      super('Intro');
   }
   create() {
      let style = {
         style: {
            font: 'bold 36px Arial',
            fill: 'white',
            wordWrap: { width: 290 }
         }
      };

      // this.title = new Title(this, 200, 20, 'River Spy');

      let title = this.add.text(180, 35, 'Spy Boat', { font: '48px Verdana', color: '#000000' })
         .setOrigin(0.5)
         .setDepth(103);

      this.anims.create({
         key: 'howToSpyAnim',
         frames: this.anims.generateFrameNumbers('howToSpy', { start: 0, end: 22 }),
         frameRate: 4,
         repeat: -1
      });

      this.spyingSprite = this.add.sprite(40, 70, 'howToSpy');

      this.spyingSprite.setOrigin(0, 0);
      this.spyingSprite.setDepth(0);

      this.spyingSprite.play('howToSpyAnim');

      let text = this.add.text(5 + gameWidth / 2, 410, "Spy! When your boat is near a secret, a sensor cone appears. Gain score when your cone overlaps an 'INTEL' icon. Slow boat while spying for extra score.", {
         font: '20px Arial',
         fill: 'black',
         wordWrap: { width: 320 }
      });
      text.setOrigin(0.5, 0);

      this.uiButtonSound = this.sound.add('snd_uiButton', { volume: 0.9 });

      let buttonContinue = new uiButton(this, 180, 560, 'placeholderButtonUp', 'placeholderButtonDown', 'Start', () => {
         // this.scene.get('Game').uiButtonSound.play();
         this.uiButtonSound.play();
         this.scene.start("Home");
      });
   }
}
