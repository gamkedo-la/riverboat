// our game's configuration
const config = {
   type: Phaser.AUTO,
   width: 360,
   height: 600,
   scene: [Boot, Setup, Home, game, credits],
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

// create the game, and pass it the configuration
let riverboat = new Phaser.Game(config);