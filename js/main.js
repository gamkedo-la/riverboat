// import Phaser from './lib/phaser.js'; // not needed for Intellisense

const config = {
   type: Phaser.AUTO,
   scale: {
      parent: 'game-container',
      width: 360,
      height: 600,
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH
   },
   scene: [Boot, Setup, Home, Gallery, Game, Credits],
   title: 'Riverboat',
   pixelArt: true,
   roundPixels: true,
   backgroundColor: 'ffffff',
   physics: {
      default: 'arcade',
      arcade: {
         debug: true,
         gravity: { y: 0 }
      }
   }
};

let riverboat = new Phaser.Game(config);
