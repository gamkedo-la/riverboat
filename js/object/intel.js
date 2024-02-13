function intel() {
   this.setObstacleSpeed = function (velocityY) {
      this.children.iterate((obstacle) => {
         obstacle.setVelocityY(velocityY);
      });
   };
}