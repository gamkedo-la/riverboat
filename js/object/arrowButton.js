class arrowButton extends Phaser.GameObjects.Container {
   constructor(scene, x, y, key, hoverKey, text, targetCallback, callbackOnRelease) {
      super(scene, x, y);
      Object.assign(this, { scene, x, y, key, hoverKey, text, targetCallback, callbackOnRelease });
      this.createButton();
      scene.add.existing(this);
   }

   createButton() {
      this.button = this.scene.add.image(0, 0, 'placeholderButtonUp')
         .setDepth(99)
         .setScale(0.35, 1.2)
         .setOrigin(0.5)
         .setInteractive();

      this.buttonText = this.scene.add.text(0, 0, this.text, { fontSize: '24px', color: '#000' });

      Phaser.Display.Align.In.Center(this.buttonText, this.button, 0, -2);

      this.add(this.button);
      this.add(this.buttonText);
      this.scrollFactorX = 0;
      this.setDepth(99);

      //this.input.hitAreaDebug = true;
      // this.iterate(function (child) {
      //    child.input.hitArea.debugBodyColor = 0xffff00; // Yellow 
      // });

      this.button.on('pointerdown', () => {
         // this.targetCallback();
         if (!this.repeatEvent) {
            this.repeatEvent = this.scene.time.addEvent({ delay: 100, callback: this.targetCallback, callbackScope: this, loop: true });
         }
      });

      this.button.on('pointerup', () => {
         this.clearEvents();
         this.callbackOnRelease();
         // this.scene.time.removeEvent(this.targetCallback);
      });

      this.button.on('pointerover', () => {
         this.button.setTexture(this.hoverKey);
      });

      this.button.on('pointerout', () => {
         this.button.setTexture(this.key);
      });
   }

   // bug when lose life while button press, repeating event not removed
   clearEvents() {
      if (this.repeatEvent) {
         this.repeatEvent.remove();
         this.repeatEvent = null;
      }
   }
}
