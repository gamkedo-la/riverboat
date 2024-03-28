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

      controlPanel.fillStyle(0x000000, 0.3); // transparency
      controlPanel.fillRect(panelX, panelY, panelWidth, panelHeight);
      controlPanel.setInteractive();

      this.makeArrowButtons();

      let text = this.add.text(0, 0, 'Panel', { font: '36px Arial', color: '#ffffff' })
         .setOrigin(0.5)
         .setDepth(99);
      Phaser.Display.Align.In.Center(text, controlPanel, 0, 0);
   }

   makeArrowButtons() {
      let top = displayHeight - controlPanelHeight; //200;
      let cameraCentreX = this.cameras.main.centerX;
      this.cameras.main.on('camera.scroll', this.updateButtonHitAreas, this);

      let gameCentreX = this.cameras.main.scrollX + displayWidth / 2;
      let scrollFactorX = this.cameras.main.scrollX / (gameWidth - displayWidth);
      let hitAreaOffsetX = scrollFactorX * displayWidth;

      let buttonXoffset = 38;
      let buttonYoffset = 60;
      let leftBtnX = cameraCentreX - buttonXoffset; // was 100
      let rightBtnX = cameraCentreX + buttonXoffset;

      Object.assign(this, { cameraCentreX, gameCentreX, leftBtnX, rightBtnX });
      // console.log(`scroll: ${this.cameras.main.scrollX}, cameraCentreX ${cameraCentreX}, gameCentreX ${gameCentreX}, leftBtnX ${leftBtnX}, rightBtnX ${rightBtnX}`);

      this.btnFast = new arrowButton(this, cameraCentreX, top, 'placeholderButtonUp', 'placeholderButtonDown', 'up', () => {
         this.player.motorForward();
      }, () => {
         this.player.neitherFastOrSlow();
      });
      this.btnFast.scrollFactorX = 0;

      top += buttonYoffset;
      this.btnLeft = new arrowButton(this, leftBtnX, top, 'placeholderButtonUp', 'placeholderButtonDown', '<', () => {
         this.player.turnLeft();
      }, () => { });
      this.btnLeft.scrollFactorX = 0;

      this.btnRight = new arrowButton(this, rightBtnX, top, 'placeholderButtonUp', 'placeholderButtonDown', '>', () => {
         this.player.turnRight();
      }, () => { });
      this.btnRight.scrollFactorX = 0;

      top += buttonYoffset;
      this.btnSlow = new arrowButton(this, cameraCentreX, top, 'placeholderButtonUp', 'placeholderButtonDown', 'v', () => {
         this.driftSpeed = this.riverSpeed / this.player.backward_ratio;
         this.player.engine = "backward";
         this.player.setTint(0xff00ff); // was bae946
         this.player.useFuel(this.player.backwardFuel);
      }, () => {
         this.player.neitherFastOrSlow();
      });
      this.btnSlow.scrollFactorX = 0;

      // this.btnLeft.setInteractive({ hitArea: new Phaser.Geom.Rectangle(this.btnLeft.width / 2 - hitAreaOffsetX, 0, this.btnLeft.width, this.btnLeft.height) });
   }
}
