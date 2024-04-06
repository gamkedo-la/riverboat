// an image and text to help player undersand aim of game (collecting Intel) and how to do that
class Intro extends Phaser.Scene {
   constructor() {
      super('Intro');
   }
   create() {

      let title = this.add.text(180, 'River Spy', { font: '36px Verdana', color: '#000000' })
         .setOrigin(0.5)
         .setDepth(103);

      let style = {
         style: {
            font: 'bold 36px Arial',
            fill: 'white',
            wordWrap: { width: 290 }
         }
      };

      let text = this.add.text(5 + gameWidth / 2, 380, "Spy! When your boat is near a secret, a sensor cone appears. Gain score when your cone overlaps an 'INTEL' icon. Slow boat while spying for extra score.", {
         font: '20px Arial',
         fill: 'black',
         wordWrap: { width: 320 }
      });
      text.setOrigin(0.5, 0);

      // { font: '24px Verdana', color: '#000000', wordWrap: { width: 280; } }).setOrigin(0.5, 0);
      //let text = this.add.text(0, 0, '', { font: '24px Verdana', color: '#ffffff' }).setOrigin(0.5);

      let buttonContinue = new uiButton(this, 180, 550, 'placeholderButtonUp', 'placeholderButtonDown', 'Start', () => {
         this.scene.start("Home");
      });

      this.anims.create({
         key: 'howToSpyAnim',
         frames: this.anims.generateFrameNumbers('howToSpy', { start: 0, end: 22 }),
         frameRate: 4,
         repeat: -1
      });

      this.spyingSprite = this.add.sprite(40, 30, 'howToSpy');

      this.spyingSprite.setOrigin(0, 0);

      this.spyingSprite.play('howToSpyAnim');

      // sprite.setPosition(50, 70);
   }
   update() {
      // this.spyingSprite.x = 50;
      // this.spyingSprite.y = 70;
   }
}
