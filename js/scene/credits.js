class Credits extends Phaser.Scene {
   constructor() {
      super('Credits');
   }

   create() {
      this.cameras.main.setBackgroundColor(0x33bb77);
      this.makeMenuButton();

      this.add.text(220, 35, 'Credits', { font: '48px Arial', color: '#000000' })
         .setOrigin(0.5);
      // this.add.text(30, 100, 'Someone', { font: '20px Arial', color: '#000000' })
      //    .setOrigin(0, 0);

      let longText = "Name 1: item description, item description, item description, item description, item description.\n\nName 2: item description, item description, item description, item description, item description.\n\nName 3: item description, item description, item description, item description, item description.\n\nName 4: item description, item description, item description, item description, item description.\n\nName 5: item description, item description, item description, item description, item description.\n\nName 6: item description, item description, item description, item description, item description.\n\nNames of playtesters: PlayTesting\n\n";

      const style = {
         fontFamily: 'Arial',
         fontSize: '16px',
         color: '#ffffff',
         wordWrap: { width: 400, useAdvancedWrap: true }
      };

      // const textArea = this.add.text(100, 100, longText, style);
      // const mask = this.add.graphics(100, 100);
      // mask.fillStyle(0xffffff);
      // mask.fillRect(0, 0, 400, 200);
      // textArea.setMask(mask);

      // this.tweens.add({
      //    targets: textArea,
      //    y: -textArea.height + 200,
      //    ease: 'Linear',
      //    duration: 5000,
      //    repeat: -1
      // });

      // const scrollingText = new AutoScrollingText(this, 0, 0, longText, { fontSize: '20px' }, 0.1);
      // this.add.existing(scrollingText);

      const scrollable = new ScrollableText(this, 30, 70, 300, 470, longText, { fontSize: '16px', color: '#000000', fontFamily: 'Verdana' });
      this.add.existing(scrollable);

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
