class hudButton extends Phaser.GameObjects.Container {
   constructor(scene, x, y, key, hoverKey, text, targetCallback) {
      super(scene, x, y);
      Object.assign(this, { scene, x, y, key, hoverKey, text, targetCallback });
      this.createButton();
      scene.add.existing(this);
   }

   createButton() {
      this.button = this.scene.add.image(0, 0, 'placeholderButtonUp')
         .setScale(0.6, 1)
         .setOrigin(0.5)
         .setInteractive();

      this.buttonText = this.scene.add.text(0, 0, this.text, { fontSize: '24px Arial', color: '#000' });

      Phaser.Display.Align.In.Center(this.buttonText, this.button, 0, 0);

      this.add(this.button);
      this.add(this.buttonText);
      this.scrollFactorX = 0;
      this.setDepth(99);

      this.button.on('pointerdown', () => {
         this.targetCallback();
      });

      this.button.on('pointerover', () => {
         this.button.setTexture(this.hoverKey);
      });

      this.button.on('pointerout', () => {
         this.button.setTexture(this.key);
      });
   }
}
