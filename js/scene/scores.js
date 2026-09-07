class Scores extends Phaser.Scene {
   constructor() {
      super('Scores');
   }

   init() {
      this.showHighScores = false;
      this.numScoresToShow = 9;
      this.toggleLabel = 'High';
   }

   // initially show recent scores, with toggle button to show high scores
   create() {
      this.cameras.main.setBackgroundColor(0xf5bf03); // gold

      this.add.text(displayWidth / 2, 80, 'Spying scores', { font: '48px Arial', color: '#000000' })
         .setOrigin(0.5);

      this.makeViewLabel();
      this.makeSortDescription();

      this.displayScores();

      this.makeMenuButton();
      this.makeToggleButton();
      // this.makeClearButton(); // hide until safer UI decided
      this.input.keyboard.on('keyup', this.anyKey, this);
   };


   displayScores() {
      this.showViewLabel();
      this.showSortDescription();
      if (this.scoreTexts) {
         this.scoreTexts.forEach(text => text.destroy());
      }
      let scores = this.showHighScores ? this.sortedByIntel() : [...allScores].reverse();
      scores = scores.slice(0, this.numScoresToShow);
      if (scores.length === 0) {
         this.scoreTexts = [this.makeScoreLine(0, 'No runs recorded yet')];
         return;
      }
      this.scoreTexts = scores.map((score, index) => {
         return this.makeScoreLine(index, `${index + 1}. Intel: ${score.intel}  Progress: ${score.progress}`);
      });
   }


   makeViewLabel() {
      this.viewLabel = this.add.text(180, 30, '', { font: '32px Arial', color: '#000000' })
         .setOrigin(0.5);
   }


   showViewLabel() {
      this.viewLabel.setText(this.showHighScores ? 'High' : 'New');
   }


   makeSortDescription() {
      this.sortDescription = this.add.text(displayWidth / 2, 116, '', { font: '18px Arial', color: '#000000' })
         .setOrigin(0.5);
   }


   showSortDescription() {
      if (allScores.length === 0) {
         this.sortDescription.setText('');
         return;
      }
      let wording = this.showHighScores ? 'sorted by highest intel' : 'most recent first';
      this.sortDescription.setText(wording);
   }


   sortedByIntel() {
      return [...allScores].sort((a, b) => b.intel - a.intel);
   }


   makeScoreLine(index, message) {
      return this.add.text(30, 145 + index * 42, message, { font: '24px Arial', fill: '#000000' });
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
      this.buttonToggle = new hudButton(this, 298, 30, 'placeholderButtonUp', 'placeholderButtonDown', this.toggleLabel, () => {
         this.showHighScores = !this.showHighScores;
         this.updateToggleLabel();
         this.buttonToggle.buttonText.setText(this.toggleLabel);
         this.displayScores();
      }, 1);
   }


   makeClearButton() {
      this.buttonClear = new hudButton(this, 298, 30, 'placeholderButtonUp', 'placeholderButtonDown', "Clear", () => {
         eraseScores();
         this.displayScores();
      }, 1);
   }


   updateToggleLabel() {
      if (this.showHighScores) {
         this.toggleLabel = 'New';
      } else {
         this.toggleLabel = 'High';
      }
   }
}
