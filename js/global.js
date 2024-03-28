const testing = false; // jump into game & zone when true
const test_zone = 1; // zone to test
const test_no_colliders = true; // no need to navigate when false
const test_river_speed = 100; // 20 makes access to riverbank easier
const fuel_for_testing = 9999;
const zone_quantity_for_test = 3;

const developerMode = false;
const devMotorVolume = 0;

const displayWidth = 360;
const displayHeight = 600;
let controlPanelHeight;

// reduce bank Width to weaken button hitarea offset error
const bankWidth = 0; // 100 
const gameWidth = displayWidth + bankWidth * 2;

const waterColor = 0x0000ff;

const spawn_above_screen_Y = -100;
const start_obstacles_n = 1;
const bring_down_first_obstacle = 120;

const intelWidth = 70;
const intelDepth = 50;

const hudStyle = {
   font: '22px Arial',
   color: '#FFFFFF',
   stroke: '#000000',
   strokeThickness: 2
};

let deviceOS, keyboard;

let makingZone, boatInZone, zones_quantity;
// current intel tracked by player.intelScore
let estimatedProgress; // global so all scenes can access
let intelHighScores = [];
let progressHighScores = [];

// generate number between 0 and 1 with distribution biased toward 0.5
const randomBias2Middle = function () {
   let u = Math.random();
   let v = Math.random();
   let z = (u + v) / 2.0;
   return z;
};

// generate number between 0 and 1 with distribution more biased toward 0.5
const randomBiasMiddle = function () {
   let u = Math.random();
   let v = Math.random();
   let w = Math.random();
   let z = (u + v + w) / 3.0;
   return z;
};

// generate a number between 0 and 1 with distribution biased toward either 0.25 or 0.75
const randomAvoidMiddle = function () {
   let half = Math.random() < 0.5 ? 0 : 0.5;
   let z = half + (randomBiasMiddle() / 2);
   return z;
};

const developerModeSounds = function (game) {
   // play the sound of water on loop, volume 0.15
   game.waterSound = game.sound.add('snd_waterLoop', { volume: 0.03, loop: true });
   game.waterSound.play();
   game.lightNearSound = game.sound.add('snd_searchProximity', { volume: 0.015, loop: false });
   game.searchContactSound = game.sound.add('snd_searchContact', { volume: 0.01 });
   game.landCollideSound = game.sound.add('snd_landCollide', { volume: 0 });
   game.boomCollideSound = game.sound.add('snd_boomCollide', { volume: 0.08 });
   game.bridgeCollideSound = game.sound.add('snd_bridgeCollide', { volume: 0 });
   game.rapidsOverlapSound = game.sound.add('snd_rapidsOverlap', { volume: 0 });
   game.intelOverlapSound = game.sound.add('snd_intelOverlap', { volume: 0 });
   game.boomChainSound = game.sound.add('snd_boomChain', { volume: 0.05 });
   // game.sound.manager.maxSounds = 3;
};
