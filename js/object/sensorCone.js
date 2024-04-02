class SensorCone extends Phaser.Physics.Arcade.Sprite {
   constructor(scene, x, y, key) {
      super(scene, x, y, key);
      Object.assign(this, { scene, x, y, key });
      scene.sensors.add(this);
      scene.physics.world.enable(this);
      this.setVisible(false);
      this.setOrigin(0, 0.5);
      this.setDepth(9);
      this.setAlpha(0.5);
      this.setScale(0.7, 0.7);
      this.setImmovable(true);
      this.sensorWaveMin = 0.3;
      this.sensorWaveMax = 0.5;
      this.sensorWaveLevel = this.sensorWaveMin;
      this.sensorWaveStep = 0.01;
      scene.add.existing(this);
   }

   show(x, y) {
      this.x = x;
      this.y = y;
      this.setVisible(true);
      this.setAlpha(this.sensorWaveLevel);
      // this.setScale(0.4 + this.sensorWaveLevel, 0.4 + this.sensorWaveLevel);
      this.sensorWaveLevel += this.sensorWaveStep;
      if (this.sensorWaveLevel < this.sensorWaveMin ||
         this.sensorWaveLevel > this.sensorWaveMax
      ) {
         this.sensorWaveStep *= -1;
      }
   }

   hide() {
      // this.x = -100; // off-screen
      // this.y = -100; // off-screen
      this.setVisible(false);
   }
}
