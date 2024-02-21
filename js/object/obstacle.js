class Obstacle extends Phaser.Physics.Group {
   constructor(scene, y) {
      super(scene, y);
      this.scene = scene;
      this.scene.physics.world.enable(this);
      this.scene.add.existing(this);
   }
}
// this.setObstacleSpeed = function (velocityY) {
//    this.children.iterate((obstacle) => {
//       obstacle.setVelocityY(velocityY);
//    });
// };