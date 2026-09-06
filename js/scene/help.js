class Help extends Phaser.Scene {
   constructor() {
      super('Help');
   }

   create() {
      this.cameras.main.setBackgroundColor(0xffffff);
      let gameWidth = this.sys.game.config.width;
      let titleCentre = [gameWidth / 2, 30];

      this.makeMenuButton();

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
      this.add.text(gameWidth / 2, top, "You control a boat that is drifting downstream with the river's flow. You can use its motor to go faster or, in reverse gear, to slow down. Motoring uses fuel: 4 for double speed; only 1 for slowing. You can steer left or right to avoid obstacles. Spy by bringing the sensor cone over an INTEL icon, which means a secret is near on the riverbank. Slow to gain more spying time.", { font: '24px Verdana', color: '#000000', wordWrap: { width: 280 } }).setOrigin(0.5, 0);
   };

   makeMenuButton() {
      this.buttonMenu = new hudButton(this, 62, 30, 'placeholderButtonUp', 'placeholderButtonDown', 'Menu', () => {
         this.scene.start("Home");
      }, 1);
   }
}
