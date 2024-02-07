let player = {
   start_health: 10,
   start_fuel: 1000,
   start_x: displayWidth / 2,
   start_y: 40,
   sideway_speed: 50,
   sideway_drag: 35,
   decelerate: 30,

   create: function (scene) {
      this.health = this.start_health;
      this.fuel = this.start_fuel;
      this.boat = scene.physics.add.sprite(this.start_x, this.start_y, 'boat')
         .setDrag(this.sideway_drag);
   }
};