class Scores extends Phaser.Scene {
   constructor() {
      super('Scores');
   }

   init() {
      this.showHighScores = false;
      this.numScoresToShow = 9;
      this.toggleLabel = 'show High';
   }

   create() {
      this.cameras.main.setBackgroundColor(0xf5bf03); // gold

      this.add.text(displayWidth / 2, 80, 'Spying scores', { font: '48px Arial', color: '#000000' })
         .setOrigin(0.5);

      // highScores = allScores sorted by intel values
      this.highScores = [...allScores].sort((a, b) => b.intel - a.intel);

      // show either allScores or highScores based on toggle button
      this.displayScores();

      this.makeMenuButton();
      this.makeToggleButton();
      this.input.keyboard.on('keyup', this.anyKey, this);
   };

   displayScores() {
      // clear previous score texts
      if (this.scoreTexts) {
         this.scoreTexts.forEach(text => text.destroy());
      }

      let scores = this.showHighScores ? this.highScores : allScores;
      scores = scores.slice(0, this.numScoresToShow);

      this.scoreTexts = scores.map((score, index) => {
         return this.add.text(30, 130 + index * 50, `${index + 1}. Intel: ${score.intel}  Progress: ${score.progress}`, { font: '24px Arial', fill: '#000000' });
      });
   }

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

   makeToggleButton() {
      this.buttonToggle = new hudButton(this, displayWidth - 62, 30, 'placeholderButtonUp', 'placeholderButtonDown', this.toggleLabel, () => {
         this.showHighScores = !this.showHighScores;
         this.updateToggleLabel();
         this.buttonToggle.buttonText.setText(this.toggleLabel);
         this.displayScores();
      }, 1);
   }

   // makeToggleButton() {
   //    this.buttonToggle = new hudButton(this, displayWidth - 62, 30, 'placeholderButtonUp', 'placeholderButtonDown', this.toggleLabel, () => {
   //       this.showHighScores = !this.showHighScores;
   //       this.updateToggleLabel();
   //       this.displayScores();
   //    }, 1);
   // }

   updateToggleLabel() {
      if (this.showHighScores) {
         this.toggleLabel = 'show Recent';
      } else {
         this.toggleLabel = 'show High';
      }
   }
}
