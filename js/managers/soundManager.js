const SoundManager = {
   sounds: {},
   init(scene) {
      this.scene = scene;
   },
   load(key, path) {
      this.scene.load.audio(key, path);
   },
   add(key) {
      this.sounds[key] = this.scene.sound.add(key);
   },
   play(key) {
      if (this.sounds[key]) {
         this.sounds[key].play();
      }
   },
   stop(key) {
      if (this.sounds[key]) {
         this.sounds[key].stop();
      }
   }
};
