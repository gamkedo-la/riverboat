class Secret extends Obstacle {
   constructor(scene, y) {
      super(scene, y);
      this.scene = scene;
      this.scene.physics.world.enable(this);
      this.scene.add.existing(this);
   }
}