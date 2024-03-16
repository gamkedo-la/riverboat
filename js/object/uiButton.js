class uiButton extends Phaser.GameObjects.Container {
   constructor(scene, x, y, key, hoverKey, text, targetCallback) {
      super(scene, x, y);
      Object.assign(this, { scene, x, y, key, hoverKey, text, targetCallback });
      this.createButton();
      scene.add.existing(this);
   }

   createButton() {
      this.button = this.scene.add.image(0, 0, 'placeholderButtonUp')
         .setDepth(99)
         .setScale(1.3, 1.1)
         .setOrigin(0.5)
         .setInteractive();

      this.buttonText = this.scene.add.text(0, 0, this.text, { fontSize: '24px Verdana', color: '#000' });

      Phaser.Display.Align.In.Center(this.buttonText, this.button, 0, -2);

      this.add(this.button);
      this.add(this.buttonText);

      this.button.on('pointerdown', () => {
         this.targetCallback();
      });

      this.button.on('pointerover', () => {
         this.button.setTexture(this.hoverKey);
      });

      this.button.on('pointerout', () => {
         this.button.setTexture(this.key);
      });

      this.buttonText.once('pointerdown', () => {
         this.button.emit('pointerdown');
      });

      this.buttonText.once('pointerover', () => {
         this.button.emit('pointerover');
      });

      this.buttonText.once('pointerout', () => {
         this.button.emit('pointerout');
      });
   }
}
