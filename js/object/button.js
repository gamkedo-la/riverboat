class Button extends Phaser.GameObjects.Container {
   constructor(scene, x, y, key, hoverKey, text, targetCallback, releaseCallback, scaleX = 1, scaleY = 1, alpha = 1, fontSize = '24px', fontName = 'Arial', fontColour = '#000') {
      super(scene, x, y);
      Object.assign(this, { scene, x, y, key, hoverKey, text, targetCallback, releaseCallback, scaleX, scaleY, alpha, fontSize, fontName, fontColour });
      this.createButton();
      scene.add.existing(this);
   }

   createButton() {
      this.button = this.scene.add.image(0, 0, 'placeholderButtonUp')
         .setScale(this.scaleX, this.scaleY)
         .setOrigin(0.5)
         .setAlpha(this.alpha)
         .setInteractive();

      this.buttonText = this.scene.add.text(0, 0, this.text, { fontSize: this.fontSize, fontFamily: this.fontName, color: this.fontColour });

      Phaser.Display.Align.In.Center(this.buttonText, this.button, 0, 0);

      this.add(this.button);
      this.add(this.buttonText);
      this.setDepth(99);

      this.button.on('pointerdown', () => {
         this.targetCallback();
      });

      this.button.on('pointerup', () => {
         if (this.releaseCallback) {
            this.releaseCallback();
         }
      });

      this.button.on('pointerover', () => {
         this.button.setTexture(this.hoverKey);
      });

      this.button.on('pointerout', () => {
         this.button.setTexture(this.key);
      });
   }
}
