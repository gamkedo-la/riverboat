class Secret extends Phaser.Physics.Arcade.Image {
   constructor(scene, x, y, texture, bank) {
      super(scene, x, y, texture, bank);
      Object.assign(this, { scene, x, y, bank });
      this.scene.obstacles.add(this);
      this.scene.secrets.add(this);
      this.scene.physics.world.enable(this);
      this.setImmovable(true);
      if (bank === "left") {
         this.setOrigin(0, 0.5);
      }
      else if (bank === "right") {
         this.setOrigin(1, 0.5);
      }
      this.setScale(0.8);
      this.setDepth(5);
      this.scene.add.existing(this);
   }
}