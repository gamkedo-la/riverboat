class Credits extends Phaser.Scene {
   constructor() {
      super('Credits');
   }

   create() {
      this.cameras.main.setBackgroundColor(0x33bb77);
      this.makeMenuButton();

      this.add.text(220, 35, 'Credits', { font: '48px Arial', color: '#000000' })
         .setOrigin(0.5);

      let longText = "Patrick McKeown: project lead, core gameplay, level design, key/touch control, sensor on/off timing, spotlight, UI, scores, fuel, sounds(sensor on/off, river recording, searchlight warnings), bugfixes and gameplay tuning\n\nJason Timms: art (log, rock, boom unit, sensor-cone), animation (driftwood), chain crank sound & integration, rock collision box, closable boom & tuning adjustments, menu button improvement, dynamic beam for spotlight, sensor-cone alpha pulse, return-to-station on touch\n\nChrister \"McFunkypants\" Kaitila: wake particles vfx, WASD support, motor sound with pitch modulation, ambient stream sound\n\nRyan Malm: water background tile scroll\n\nKyle Knutson: boat art\n\nMarvin Chong: pause scene fix\n\nKlaim (A. Joël Lamotte), Stebs, Alex Joiner, Rodrigo Bonzerr Lopez, Elizabeth McMahill: testing";

      this.creditsText = [
         "Patrick McKeown: Project lead",
         "Jason Timms: art (log, rock, boom unit, sensor-cone), animation (driftwood), chain crank sound & integration, rock collision box, closable boom & tuning adjustments, menu button improvement, dynamic beam for spotlight, sensor-cone alpha pulse, return-to-station on touch",
         "Christer \"McFunkypants\" Kaitila: Wake effect, WASD support, motor sound with pitch modulation, ambient stream sound",
         "Ryan Malm: Scrolling water background",
         "Kyle Knutson: Boat art",
         "Marvin Chong: Pause scene",
         "Klaim (A. Joël Lamotte), Stebs, Alex Joiner, Rodrigo Bonzerr Lopez, Elizabeth McMahill: Testing"
      ];

      const style = {
         fontFamily: 'Arial',
         fontSize: '16px',
         color: '#000000',
         wordWrap: { width: 320 }
         // wordWrap: { width: 400, useAdvancedWrap: true }
      };

      this.textBox = this.add.text(30, 75, longText, style);

      this.input.keyboard.on('keyup', this.anyKey, this);

      // this.drawCredits();

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

      // const scrollable = new ScrollableText(this, 30, 70, 300, 550, longText, { fontSize: '16px', color: '#000000', fontFamily: 'Verdana' });
      // this.add.existing(scrollable);
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

   drawCredits() {
      let creditsText = this.creditsText;
      if (!this.creditsPaused) {
         if (creditsFrameCount < 1300) {
            creditsFrameCount++;
         } else {
            creditsButtonLabel = ["Menu", , , ,];
         }
      }
      colorRect(canvasContext, 0, 0, gameCanvas.width, gameCanvas.height, "black");
      // canvasContext.drawImage(creditsBGPic, 0, 0);
      canvasContext.drawImage(menuBGPic, 0, 0);

      indentX = CREDITS_X;
      BLOCK_GAP = 40;
      BLOCK_LINE_SPACING = 35;
      canvasContext.font = SUBHEAD_FONT + "px Verdana";
      headLine("Credits");
      var line = 0;
      var block = 1;
      indentX = CREDITS_X;
      topY = CREDITS_Y - creditsFrameCount;
      canvasContext.font = CREDITS_FONT + "px Verdana";

      for (const creditText of creditsText) {
         const txtLines = getLines(canvasContext, creditText, CREDITS_WIDTH);
         for (const txt of txtLines) {
            blockLine(txt, ++line, block);
         }

         block++;
      }
   } // end drawCredits
}
let creditsFrameCount = 0;
