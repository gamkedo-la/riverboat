class Panel extends Phaser.Scene {
   constructor() {
      super('Panel');
   }

   create() {
      const controlPanel = this.add.graphics();
      //controlPanel.setOrigin(0.5);
      // graphics don't have .setOrigin? always topLeft positioning?
      const panelMargin = 0;
      const panelWidth = displayWidth - panelMargin * 2;
      const panelHeight = controlPanelHeight;
      const panelX = panelMargin; // bankWidth + 
      const panelY = displayHeight - panelHeight - panelMargin + 1;

      controlPanel.fillStyle(0x000000, 1); // transparency
      controlPanel.fillRect(panelX, panelY, panelWidth, panelHeight);
      controlPanel.setInteractive();

      //this.makeArrowButtons();

      let text = this.add.text(0, 0, 'Panel', { font: '36px Arial', color: '#ffffff' })
         .setOrigin(0.5)
         .setDepth(99);
      Phaser.Display.Align.In.Center(text, controlPanel, 0, 0);
   }
}
