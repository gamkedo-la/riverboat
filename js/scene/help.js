class Help extends Phaser.Scene {
   constructor() {
      super('Help');
   }

   create() {
      this.cameras.main.setBackgroundColor(0xffffff);
      let gameWidth = this.sys.game.config.width;
      let titleCentre = [gameWidth / 2, 30];

      //if (keyboard != 'likely') {
      this.makeMenuButton();
      //}

      let text = this.add.text(...titleCentre, 'Help', { font: '36px Arial', color: '#000000' })
         .setOrigin(0.5)
         .setDepth(1);

      let style = {
         style: {
            font: 'bold 25px Arial',
            fill: 'white',
            wordWrap: { width: 320 }
         }
      };
      let top = 60;
      this.add.text(gameWidth / 2, top, "You control a boat moving with river's flow. Steer to avoid obstacles. Motor fast forward, or slow against flow (up & down) both use fuel. Spy by bringing your sensor cone - slow down for extra score - over an INTEL icon: means a secret is near on land. 'Intel' is your score; though number of obstacles 'Passed' is also tracked.", { font: '24px Verdana', color: '#000000', wordWrap: { width: 280 } }).setOrigin(0.5, 0);
   };

   makeMenuButton() {
      this.buttonMenu = new hudButton(this, 62, 30, 'placeholderButtonUp', 'placeholderButtonDown', 'Menu', () => {
         this.scene.start("Home");
      });
   }
}
