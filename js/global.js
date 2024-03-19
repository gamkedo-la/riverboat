const displayWidth = 360;
const displayHeight = 600;
// reduce bank Width to weaken button hitarea offset error
const bankWidth = 0; // 100 
const gameWidth = displayWidth + bankWidth * 2;
const riverSpeed = 60; // 20 makes access to riverbank easier
const intelWidth = 70;
const intelDepth = 50;
const waterColor = 0x0000ff;

const hudStyle = {
   font: '22px Arial',
   color: '#FFFFFF',
   stroke: '#000000',
   strokeThickness: 2
};

let deviceOS, keyboard;

let currentZone;
let zones_quantity;

// const testing = true;
const testing = false;

const withColliders = true;
// const withColliders = false;

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
}

