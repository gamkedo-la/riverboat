const displayWidth = 360;
const displayHeight = 600;
const bankWidth = 100;
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
