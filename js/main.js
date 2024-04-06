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
   scene: [Boot, Setup, Intro, Home, Options, Help, Game, Panel, Controls, Pause, Credits, Scores],
   title: 'Riverboat',
   pixelArt: true,
   roundPixels: true,
   backgroundColor: 'ffffff',
   physics: {
      default: 'arcade',
      arcade: {
         debug: false,
         gravity: { y: 0 }
      }
   }
};

let riverboat = new Phaser.Game(config);
