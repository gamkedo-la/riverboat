class Setup extends Phaser.Scene {
   constructor() {
      super('Setup');
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

      let loadingFile = this.add.text(width / 2, height / 2 + 100, 'XXXX', { font: '24px monospace', color: '#ffffff' }).setOrigin(0.5);

      this.load.on('fileprogress', function (file) {
         loadingFile.setText('Loading: ' + file.key);
      });

      // this.load.image('bank_left', 'public/art/bank_left_120.png');
      // this.load.image('bank_right', 'public/art/bank_right_120.png');
      this.load.image('boat', 'public/art/boat_30x65.png');
      this.load.image('anim_turnBoat', 'public/art/boat_5.png');
      this.load.image('wake', 'public/art/water_wake.png');
      this.load.image('sensor', 'public/art/sensor_cone.png');
      this.load.image('sensor2', 'public/art/BoatSensor_YellowCone.png');

      this.load.image('boom', 'public/art/boom_480x50.png');
      this.load.image('boomUnit', 'public/art/BoomUnit0.png');
      this.load.image('capstan', 'public/art/capstan.png');
      this.load.image('land', 'public/art/land.png');
      this.load.image('rock_ph', 'public/art/rock.png');
      this.load.image('secret', 'public/art/secret.png');
      this.load.image('intel', 'public/art/intel_2.png');
      this.load.image('bridge', 'public/art/bridge_480x50.png');
      this.load.image('rapids', 'public/art/rapids.png');
      this.load.image('van', 'public/art/van.png');
      this.load.image('searchlight', 'public/art/searchlight_trim.png');
      this.load.image('tower_left', 'public/art/tower_leftbank.png');
      this.load.image('tower_right', 'public/art/tower_rightbank.png');
      this.load.image('pier', 'public/art/goal.png');
      this.load.image('water', 'public/art/water_background.png');
      this.load.image('driftWood_gif', 'public/art/splashy_driftwood.gif');
      this.load.image('driftWood', 'public/art/splashy_driftwood.png');
      this.load.image('rock', 'public/art/boulder01.png');

      this.load.image('placeholderButtonUp', 'public/art/placeholder_button_up.png');
      this.load.image('placeholderButtonDown', 'public/art/placeholder_button_down.png');

      this.load.spritesheet('anim_driftwood', 'public/art/splashy_driftwood2.png', {
         frameWidth: 32,
         frameHeight: 32,
         spacing: 0
      });

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

      this.load.audio('snd_searchProximity', ['public/sound/searchlight_near.mp3']);
      this.load.audio('snd_searchContact', ['public/sound/searchlight_contact_2.mp3']);
      this.load.audio('snd_landCollide', ['public/sound/land_hit_placeholder.mp3']);
      this.load.audio('snd_boomCollide', ['public/sound/boom_hit_placeholder.mp3']);
      this.load.audio('snd_bridgeCollide', ['public/sound/bridge_hit_placeholder.mp3']);
      this.load.audio('snd_rapidsOverlap', ['public/sound/rapids_over_placeholder.mp3']);
      this.load.audio('snd_intelOverlap', ['public/sound/collider_placeholder.mp3']);
      this.load.audio('snd_boomChain', ['public/sound/boomChainSound.wav']);
      this.load.audio('snd_motorLoop', ['public/sound/motor_loop.wav']);

      if (testing) {
         this.load.json('zoneData', 'public/json/testZoneParams.json');
      } else {
         this.load.json('zoneData', 'public/json/zoneParameters.json');
      }

      this.load.once('complete', () => {
         let canvas = document.createElement('canvas');
         canvas.height = 30;
         let context = canvas.getContext('2d');
         let x = 0;
         let images = Array(20).fill('boomUnit');
         for (let image of images) {
            let img = this.textures.get(image).getSourceImage();
            context.drawImage(img, x, 0);
            x += img.width;
         }
         this.textures.addCanvas('boomUnitChain', canvas);
      });
   };

   create() {
      this.anims.create({
         key: 'splash_driftwood',
         frames: this.anims.generateFrameNames('anim_driftwood', { frames: [0, 1, 2, 3] }),
         frameRate: 1,
         yoyo: false,
         repeat: -1
      });

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

      if (testing) {
         currentZone = testZone;
         this.scene.start('Game');
      } else {
         this.scene.start('Home');
      }
   };

}
