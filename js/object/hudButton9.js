class hudButton9 extends Phaser.GameObjects.Container {
   constructor(scene, x, y, key, hoverKey, text, targetCallback, alpha) {
      super(scene, x, y);
      Object.assign(this, { scene, x, y, key, hoverKey, text, targetCallback, alpha });
      this.createButton();
      scene.add.existing(this);
   }

   createButton() {
      this.button = this.scene.add.image(0, 0, 'placeholderButtonUp')
         .setScale(1.05, 1)
         .setOrigin(0.5)
         .setAlpha(this.alpha)
         .setInteractive();

      this.buttonText = this.scene.add.text(0, 0, this.text, { fontSize: '24px', fontName: 'Verdana', color: '#000' });

      Phaser.Display.Align.In.Center(this.buttonText, this.button, 0, -3);

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
