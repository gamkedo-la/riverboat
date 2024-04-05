class FitButton extends Phaser.GameObjects.Container {
   constructor(scene, x, y, key, hoverKey, text, targetCallback, releaseCallback, alpha = 1, marginX = 16, marginY = 12, fontSize = '24px', fontName = 'Verdana', fontColour = '#000') {
      super(scene, x, y);
      Object.assign(this, { scene, x, y, key, hoverKey, text, targetCallback, releaseCallback, alpha, marginX, marginY, fontSize, fontName, fontColour });
      this.createButton();
      scene.add.existing(this);
   }

   createButton() {
      this.buttonText = this.scene.add.text(0, 0, this.text, {
         fontSize: this.fontSize,
         fontFamily: this.fontName,
         color: this.fontColour
      });

      const textWidth = this.buttonText.width;
      const textHeight = this.buttonText.height;

      const buttonWidth = textWidth + this.marginX * 2;
      const buttonHeight = textHeight + this.marginY * 2;

      this.button = this.scene.add.image(0, 0, this.key)
         .setDisplaySize(buttonWidth, buttonHeight)
         .setOrigin(0, 0)
         .setAlpha(this.alpha)
         .setInteractive();

      this.add(this.button);
      this.add(this.buttonText);
      this.setSize(buttonWidth, buttonHeight);
      this.setDepth(99);

      Phaser.Display.Align.In.Center(this.buttonText, this.button, 0, -3);

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
