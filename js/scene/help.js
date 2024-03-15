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
      this.add.text(gameWidth / 2, top, "You control a boat moving with river's flow. Steer (left & right) to avoid obstacles. Motoring forward, or slow against flow (up & down) both use fuel. Edges = riverbank, and proximity of a Secret is INTEL icon. Spy by bringing your sensor cone over icon, and slow down for extra score aka 'Intel'. Number of obstacles 'Passed' is also tracked.", { font: '24px Verdana', color: '#000000', wordWrap: { width: 280 } }).setOrigin(0.5, 0);
      // if (keyboard === 'likely') {
      // }
      // else {q
      // }
   };

   makeMenuButton() {
      this.buttonMenu = new hudButton(this, 62, 30, 'placeholderButtonUp', 'placeholderButtonDown', 'Menu', () => {
         this.scene.start("Home");
      });
   }
}
