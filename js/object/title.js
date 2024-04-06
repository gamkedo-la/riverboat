class Title extends Phaser.GameObjects.Container {
   constructor(scene, x, y, text, margin = 12, fontSize = '36px', fontName = 'Verdana', fontColor = '#ffffff', panelColor = 0x000000, panelAlpha = 0.7) {
      super(scene, x, y);
      Object.assign(this, { scene, x, y, text, margin, fontSize, fontName, fontColor, panelColor, panelAlpha });

      this.createTitlePanel();
      scene.add.existing(this);
   }

   createTitlePanel() {
      // const gameWidth = this.scene.sys.game.config.width;
      // const titleCentre = [gameWidth / 2, this.y];

      this.titleText = this.scene.add.text(0, 0, this.text, {
         font: `${this.fontSize} ${this.fontName}`,
         color: this.fontColor
      }).setOrigin(0.5);

      const textWidth = this.titleText.width;
      const textHeight = this.titleText.height;

      this.panel = this.scene.add.graphics();
      this.panel.fillStyle(this.panelColor, this.panelAlpha);

      const panelWidth = textWidth + this.margin * 2;
      const panelHeight = textHeight + this.margin * 2;
      const panelX = this.x - panelWidth / 2;
      const panelY = this.y - panelHeight / 2;

      this.panel.fillRect(panelX, panelY, panelWidth, panelHeight);

      this.panel.setDepth(5);
      this.titleText.setDepth(6);

      Phaser.Display.Align.In.Center(this.titleText, this.panel);

      this.add(this.panel);
      this.add(this.titleText);
   }
}
