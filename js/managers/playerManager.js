class PlayerManager {
   constructor(scene) {
      this.scene = scene;
      this.player = null;
   }

   createPlayer() {
      const x = this.scene.game.config.width / 2;
      const y = this.scene.game.config.height - 10;
      this.player = new Player(this.scene, x, y, 'boat');
      this.player.create();
      return this.player;
   }

   updatePlayer(cursors) {
      if (this.player) {
         this.player.update(cursors);
      }
   }
}
