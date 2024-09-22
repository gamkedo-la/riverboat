// This scene object should be unpaused whenever the object pauses the 'Game' scene, so that it can listen to when the user presses 'P' again and unpause the 'Game' scene.
class Pause extends Phaser.Scene {
   constructor() {
      super('Pause');
   }

   create() {
      this.input.keyboard.on('keyup', this.anyKey, this);
      this.events.on('resumeGame', (isVisible) => {
         this.menuButton.visible = isVisible;
      });

      this.makeResumeButton();
   }

   anyKey(event) {
      let code = event.keyCode;
      if (code === Phaser.Input.Keyboard.KeyCodes.P) {
         this.resuming();
      }
   };

   makeMenuButton() {
      this.buttonMenu = new hudButton(this, 62, 30, 'placeholderButtonUp', 'placeholderButtonDown', 'Menu', () => {
         this.scene.stop('Game');
         this.scene.stop('Pause');
         this.scene.gotoHome();
      }, 1);
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

   handlePauseButton() {
      const pauseButton = this.scene.get('Game').controlButtons['pause'];
      pauseButton.hitArea.setInteractive();
      pauseButton.hitArea.on('pointerdown', () => {
         this.resuming();
      });
   }

   resuming() {
      // this.resumeButton.visible = false;
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
