class Setup extends Phaser.Scene {
   constructor() {
      super('Setup');
   }
   init() {
      this.sys.game.config.gameCentre = [180, 320];
   }

   preload() {
      let width = this.cameras.main.width;
      let height = this.cameras.main.height;
      // console.log(width, height, this.sys.game.config.width, this.sys.game.config.height);

      const barW = 150;
      const barH = 30;
      const barLeft = this.sys.game.config.width / 2 - barW / 2;
      const barTop = this.sys.game.config.height / 2 - barH / 2;

      let splash = this.add.sprite(this.sys.game.config.width / 2, 150, 'logo');

      let bgBar = this.add.graphics()
         .setPosition(barLeft, barTop);
      bgBar.fillStyle(0xF5F5F5, 1);
      bgBar.fillRect(0, 0, barW, barH);

      let progressBar = this.add.graphics()
         .setPosition(barLeft, barTop);

      this.load.on('progress', function (value) {
         progressBar.clear();
         progressBar.fillStyle(0x9AD98D, 1);
         progressBar.fillRect(0, 0, value * barW, barH);
      }, this);

      let loadingFile = this.add.text(width / 2, height / 2 + 100, 'XXXX', { font: '24px monospace', fill: '#ffffff' }).setOrigin(0.5);

      this.load.on('fileprogress', function (file) {
         loadingFile.setText('Loading: ' + file.key);
      });

      // test progress bar
      for (let i = 0; i < 50; i++) {
         this.load.image('river' + i, 'public/art/river_0_360x640.png');
      }

      this.load.image('river', 'public/art/river_0_360x640.png');
      this.load.image('boat', 'public/art/boat_30x65.png');
      this.load.image('anim_turnBoat', 'public/art/boat_5.png');
      this.load.image('wake', 'public/art/water_wake.png');
      this.load.image('boom', 'public/art/boom_480x50.png');
      this.load.image('pier', 'public/art/goal.png');

      this.load.image('placeholderButtonUp', 'public/art/placeholder_button_up.png');
      this.load.image('placeholderButtonDown', 'public/art/placeholder_button_down.png');

      this.load.spritesheet('anim_boat', 'public/art/boat_5.png', {
         frameWidth: 30,
         frameHeight: 65,
         spacing: 0
      });

      this.load.spritesheet('anim_placeholderExplosion', 'public/art/placeholderExplosion.png', {
         frameWidth: 97,
         frameHeight: 83,
         spacing: 1,
         margin: 1
      });

      this.load.audio('snd_boomCollide', ['public/sound/collider_placeholder.mp3']);
   };

   create() {
      this.anims.create({
         key: 'turnLeft',
         frames: this.anims.generateFrameNames('anim_boat', { frames: [1, 0, 1, 2] }),
         frameRate: 2,
         yoyo: false,
         repeat: 0
      });

      this.anims.create({
         key: 'turnRight',
         frames: this.anims.generateFrameNames('anim_boat', { frames: [3, 4, 3, 2] }),
         frameRate: 2,
         yoyo: false,
         repeat: 0
      });

      this.anims.create({
         key: 'explode',
         frames: this.anims.generateFrameNames('anim_placeholderExplosion', { frames: [1, 2, 3] }),
         frameRate: 7,
         yoyo: true,
         repeat: 1
      });
      this.scene.start('Home');
   };

}
