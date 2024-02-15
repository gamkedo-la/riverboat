class uiButton extends Phaser.GameObjects.Container {
   constructor(scene, x, y, key, hoverKey, text, targetCallback) {
      super(scene, x, y);
      Object.assign(this, { scene, x, y, key, hoverKey, text, targetCallback });
      this.createButton();
      scene.add.existing(this);
   }

   createButton() {
      this.button = this.scene.add.image(0, 0, 'placeholderButtonUp')
         .setScale(1.5)
         .setInteractive();

      this.buttonText = this.scene.add.text(0, 0, this.text, { fontSize: '28px', fill: '#000' });

      Phaser.Display.Align.In.Center(this.buttonText, this.button, 0, -2);

      this.add(this.button);
      this.add(this.buttonText);

      this.button.on('pointerdown', () => {
         console.log('pointer down');
         this.targetCallback();
      });

      this.button.on('pointerover', () => {
         console.log('pointer over');
         this.button.setTexture(this.hoverKey);
      });

      this.button.on('pointerout', () => {
         console.log('pointer out');
         this.button.setTexture(this.key);
      });
   }
}
