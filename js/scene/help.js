class Help extends Phaser.Scene {
   constructor() {
      super('Help');
   }

   create() {
      this.cameras.main.setBackgroundColor(0xffffff);

      let gameWidth = this.sys.game.config.width;
      let titleCentre = [gameWidth / 2, 40];

      let text = this.add.text(...titleCentre, 'Help', { font: '36px Arial', color: '#000000' })
         .setOrigin(0.5)
         .setDepth(1);

      let style = {
         style: {
            font: 'bold 25px Arial',
            fill: 'white',
            wordWrap: { width: 300 }
         }
      };
      let top = 70;
      if (keyboard === 'likely') {
         this.add.text(gameWidth / 2, top, "You control remotely a boat moving stealthily with the river's flow of a river. Steer (left & right keys) to avoid obstacles. Motoring fast forward and slowing against flow (up & down keys) both cost fuel. Edge of screen is the riverbank, and proximity of a secret on land is flagged by an Intel-ligence icon. Spy by bringing your sensor cone above INTEL, and score more by slowing down. 'Intel' is your score, though the number of obstacles your boat 'Passed' also features on personal High Scores (not yet implemented).", { font: '22px Arial', color: '#000000', wordWrap: { width: 280 } }).setOrigin(0.5, 0);
      }
      else {
         this.add.text(gameWidth / 2, top, "You control remotely a boat moving stealthily with the river's flow of a river. Steer (left & right buttons) to avoid obstacles. Motoring fast forward and slowing against flow (up & down buttons) both cost fuel. Edge of screen is the riverbank, and proximity of a secret on land is flagged by an Intel-ligence icon. Spy by bringing your sensor cone above INTEL, and score more by slowing down. 'Intel' is your score, though the number of obstacles your boat 'Passed' also features on personal High Scores (not yet implemented).", { font: '22px Arial', color: '#000000', wordWrap: { width: 280 } }).setOrigin(0.5, 0);
      }
   };
}
