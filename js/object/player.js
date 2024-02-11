const player = {
   start_health: 10,
   start_fuel: 1000,
   sideway_speed: 30,
   sideway_drag: 35,
   forward_speed: -40,
   backward_speed: 40,
   start_x: displayWidth / 2,
   start_y: displayHeight - 90, // - player.boat.height

   create: function (scene) {
      this.health = this.start_health;
      this.fuel = this.start_fuel;
      this.boat = scene.physics.add.sprite(this.start_x, this.start_y, 'boat')
         .setDrag(this.sideway_drag)
         .setVelocity(0, 0);
   },

   useFuel: function (usage) {
      this.fuel -= usage;
   }
};