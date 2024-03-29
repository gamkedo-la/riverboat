// This scene object should be unpaused whenever the object pauses the 'Game' scene, so that it can listen to
// when the user presses 'P' again and unpause the 'Game' scene.
class Pause extends Phaser.Scene {
   constructor() {
      super('Pause');
   }

   create() {
      this.input.keyboard.on('keyup', this.anyKey, this);
      this.makeMenuButton();
      this.makeResumeButton();
   }

   anyKey(event) {
      let code = event.keyCode;
      if (code === Phaser.Input.Keyboard.KeyCodes.P) {
         this.scene.resume('Game');
         this.scene.stop('Pause');
      }
   };

   makeMenuButton() {
      this.buttonMenu = new hudButton(this, 62, 30, 'placeholderButtonUp', 'placeholderButtonDown', 'Menu', () => {
         this.player.spyingNow = false;
         this.spyingSound.stop();
         this.scene.stop('Game');
         this.scene.stop('Pause');
         this.scene.gotoHome();
      });
   }

   makeResumeButton() {
      this.buttonResume = new hudButton(this, displayWidth - 62, 30, 'placeholderButtonUp', 'placeholderButtonDown', 'Resume', () => {
         this.scene.resume('Game');
         this.scene.stop('Pause');
      });
   }
}
