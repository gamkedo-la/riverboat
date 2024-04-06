class Button extends Phaser.GameObjects.Container {
   constructor(scene, x, y, key, hoverKey, text, targetCallback, releaseCallback, scaleX = 1, scaleY = 1, alpha = 1, fontSize = '24px', fontName = 'Verdana', fontColour = '#000') {
      super(scene, x, y);
      Object.assign(this, { scene, x, y, key, hoverKey, text, targetCallback, releaseCallback, scaleX, scaleY, alpha, fontSize, fontName, fontColour });
      this.createButton();
      scene.add.existing(this);
   }

   createButton() {
      this.buttonImage = this.scene.add.image(0, 0, this.key)
         .setScale(this.scaleX, this.scaleY)
         .setOrigin(0.5)
         .setAlpha(this.alpha)
         .setInteractive();

      this.add(this.buttonImage);

      this.buttonText = this.scene.add.text(0, 0, this.text, { fontSize: this.fontSize, fontFamily: this.fontName, color: this.fontColour })
         .setOrigin(0.5);

      // const buttonBounds = this.buttonImage.getBounds();
      // this.buttonText.setPosition(buttonBounds.centerX, buttonBounds.centerY);

      this.add(this.buttonText);

      Phaser.Display.Align.In.Center(this.buttonText, this.buttonImage, 0, -3);

      this.buttonImage.on('pointerdown', () => {
         this.targetCallback();
      });

      this.buttonImage.on('pointerup', () => {
         if (this.releaseCallback) {
            this.releaseCallback();
         }
      });

      this.buttonImage.on('pointerover', () => {
         this.buttonImage.setTexture(this.hoverKey);
      });

      this.buttonImage.on('pointerout', () => {
         this.buttonImage.setTexture(this.key);
      });
   }
}
