class Title extends Phaser.GameObjects.Container {
   constructor(scene, y, text, margin = 12, fontSize = '36px', fontName = 'Verdana', fontColor = '#ffffff', panelColor = 0x000000, panelAlpha = 0.7) {
      super(scene);
      this.scene = scene;
      this.y = y;
      this.text = text;
      this.margin = margin;
      this.fontSize = fontSize;
      this.fontName = fontName;
      this.fontColor = fontColor;
      this.panelColor = panelColor;
      this.panelAlpha = panelAlpha;

      this.createTitlePanel();
      scene.add.existing(this);
   }

   createTitlePanel() {
      const gameWidth = this.scene.sys.game.config.width;
      const titleCentre = [gameWidth / 2, this.y];

      this.titleText = this.scene.add.text(...titleCentre, this.text, {
         font: `${this.fontSize} ${this.fontName}`,
         color: this.fontColor
      }).setOrigin(0.5).setDepth(1);

      const textWidth = this.titleText.width;
      const textHeight = this.titleText.height;

      this.panel = this.scene.add.graphics();
      this.panel.fillStyle(this.panelColor, this.panelAlpha);
      this.panel.setDepth(0);

      const panelWidth = textWidth + this.margin * 2;
      const panelHeight = textHeight + this.margin * 2;
      const panelX = gameWidth / 2 - panelWidth / 2;
      const panelY = this.y - panelHeight / 2;

      this.panel.fillRect(panelX, panelY, panelWidth, panelHeight);

      Phaser.Display.Align.In.Center(this.titleText, this.panel);

      this.add(this.panel);
      this.add(this.titleText);
   }
}
