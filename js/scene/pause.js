// This scene object should be unpaused whenever the object pauses the 'Game' scene, so that it can listen to
// when the user presses 'P' again and unpause the 'Game' scene.
class Pause extends Phaser.Scene {
   constructor() {
      super('Pause');
   }


   init(data) {
      this.askingQuit = false;
      this.quitWasRequested = (data && data.askQuit === true);
   }


   create() {
      this.input.keyboard.on('keyup', this.anyKey, this);
      this.makeResumeButton();
      this.makeMenuButton();
      if (this.quitWasRequested) {
         this.askQuit();
      }
      //this.handlePauseButton();
   }


   anyKey(event) {
      let code = event.keyCode;
      if (this.askingQuit) {
         this.answerQuitByKey(code);
      }
      else if (isPauseKey(code)) {
         this.resuming();
      }
      else if (code === Phaser.Input.Keyboard.KeyCodes.ESC) {
         this.askQuit();
      }
   };


   answerQuitByKey(code) {
      if (code === Phaser.Input.Keyboard.KeyCodes.Q) {
         this.quitToHome();
      }
      else if (code === Phaser.Input.Keyboard.KeyCodes.ESC) {
         this.cancelQuit();
      }
   }


   makeMenuButton() {
      let x = displayWidth - this.scene.get('Game').panelOffsetButtonX;
      let y = displayHeight - 27;
      this.menuButton = new hudButton(this, x, y, 'placeholderButtonUp', 'placeholderButtonDown', 'Menu', () => {
         this.askQuit();
      }, 0.7);
      if (keyboard === 'likely') {
         this.menuButton.alpha = 0.4;
      }
   }


   makeResumeButton() {
      let x = displayWidth - this.scene.get('Game').panelOffsetButtonX;
      let y = displayHeight - this.scene.get('Game').panel2ndButtonY;
      this.resumeButton = new hudButton(this, x, y, 'placeholderButtonUp', 'placeholderButtonDown', 'Resume', () => {
         this.resuming(this);
      }, 0.7);
      if (keyboard === 'likely') {
         this.resumeButton.alpha = 0.4;
      }
   }


   askQuit() {
      this.askingQuit = true;
      this.resumeButton.destroy();
      this.menuButton.destroy();
      this.makeQuitText();
      this.makeQuitButtons();
   }


   makeQuitText() {
      this.quitPanel = this.add.container(0, 0).setDepth(99);
      this.quitPanel.add(this.makeMidText(150, 'Quit this run?', 28));
      this.quitPanel.add(this.makeMidText(202, 'The score so far is kept,\nbut the game progress is lost.', 16));
      if (keyboard === 'likely') {
         this.quitPanel.add(this.makeMidText(250, 'Q to quit, Esc to stay', 16));
      }
   }


   makeMidText(y, message, size) {
      let style = { font: size + 'px Verdana', color: '#ffffff', align: 'center', lineSpacing: 6 };
      return this.add.text(gameWidth / 2, y, message, style).setOrigin(0.5);
   }


   // Quit placed in upper slot so a stray second tap on Menu button lands on Cancel
   makeQuitButtons() {
      let x = displayWidth - this.scene.get('Game').panelOffsetButtonX;
      let upperY = displayHeight - this.scene.get('Game').panel2ndButtonY;
      this.quitButton = new hudButton(this, x, upperY, 'placeholderButtonUp', 'placeholderButtonDown', 'Quit', () => {
         this.quitToHome();
      }, 0.7);
      this.cancelButton = new hudButton(this, x, displayHeight - 27, 'placeholderButtonUp', 'placeholderButtonDown', 'Cancel', () => {
         this.cancelQuit();
      }, 0.7);
   }


   cancelQuit() {
      this.askingQuit = false;
      this.clearQuitAsk();
      if (this.quitWasRequested) {
         this.resuming();
         return;
      }
      this.makeResumeButton();
      this.makeMenuButton();
   }


   clearQuitAsk() {
      this.quitPanel.destroy();
      this.quitButton.destroy();
      this.cancelButton.destroy();
   }



   quitToHome() {
      const game = this.scene.get('Game');
      this.scene.stop('Pause');
      game.gotoHome();
   }


   handlePauseButton() {
      const pauseButton = this.scene.get('Game').controlButtons['pause'];
      pauseButton.hitArea.setInteractive();
      pauseButton.hitArea.on('pointerdown', () => {
         this.resuming();
      });
   }


   resuming() {
      this.scene.resume('Game');
      this.scene.stop('Pause');
      this.scene.get('Game').events.emit('resumeGame', true);
      if (this.scene.get('Game').player.spyingNow) {
         this.scene.get('Game').spyingSound.play();
      }
      this.scene.get('Game').menuButton.visible = true;
      this.scene.get('Game').pauseButton.visible = true;
   }
}
