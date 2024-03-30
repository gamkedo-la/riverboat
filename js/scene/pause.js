// This scene object should be unpaused whenever the object pauses the 'Game' scene, so that it can listen to
// when the user presses 'P' again and unpause the 'Game' scene.
class Pause extends Phaser.Scene {
   constructor() {
      super('Pause');
   }

   create() {
      this.input.keyboard.on('keyup', this.anyKey, this);
      // this.makeMenuButton();
      this.events.on('resumeGame', (isVisible) => {
         this.menuButton.visible = isVisible;
      });

      this.makeResumeButton();
      //this.scene.get('Game').events.on('pauseMenuToggle', this.handleMenuVisibility, this);
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
         this.scene.stop('Game');
         this.scene.stop('Pause');
         this.scene.gotoHome();
      });
   }

   makeResumeButton() {
      this.buttonResume = new hudButton(this, displayWidth - 62, 30, 'placeholderButtonUp', 'placeholderButtonDown', 'Resume', () => {
         this.scene.resume('Game');
         this.scene.stop('Pause');
         this.scene.get('Game').events.emit('resumeGame', true);
         this.scene.get('Game').menuButton.visible = true;
      });
   }
}
