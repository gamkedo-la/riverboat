class Setup extends Phaser.Scene {
   constructor() {
      super('Setup');
   }

   init() {
      allScores = loadScores();
   }

   preload() {
      this.makeLoadingBar();
      this.loadAssets();
   }

   makeLoadingBar() {
      let width = this.cameras.main.width;
      let height = this.cameras.main.height;
      // this.sys.game.config.width is the same as this.cameras.main.width elsewhere using global const displayWidth

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
   }

   loadAssets() {
      this.load.image('boat', 'public/art/boat_cropfront_62.png');
      this.load.image('main_hull_hitbox', 'public/art/boat_hitbox_main_hull_60.png');
      this.load.image('outriggers_hitbox', 'public/art/boat_hitbox_outriggers.png');
      this.load.image('anim_turnBoat', 'public/art/boat_5.png');

      this.load.image('wake', 'public/art/water_wake.png');
      this.load.image('sensor', 'public/art/sensor_cone.png');
      this.load.image('sensor2', 'public/art/BoatSensor_YellowCone.png');
      this.load.image('sensor3', 'public/art/BoatSensor_GreenCone.png');

      this.load.image('spy_cutscene', 'public/art/spying.png');
      this.load.image('boom', 'public/art/boom_480x50.png');
      this.load.image('boomUnit', 'public/art/BoomUnit0_trim.png');
      this.load.image('capstan', 'public/art/capstan.png');
      this.load.image('land', 'public/art/land.png');
      this.load.image('rock_ph', 'public/art/rock.png');
      this.load.image('secret', 'public/art/secret.png');
      this.load.image('intel', 'public/art/intel_2.png');
      this.load.image('bridge', 'public/art/bridge.png');
      this.load.image('rapids', 'public/art/rapids.png');
      this.load.image('van', 'public/art/van.png');
      this.load.image('searchlight', 'public/art/searchlight_trim.png');
      this.load.image('tower_left', 'public/art/tower_leftbank.png');
      this.load.image('tower_right', 'public/art/tower_rightbank.png');
      this.load.image('pier', 'public/art/pier.png');
      this.load.image('water', 'public/art/water_background.png');
      this.load.image('driftWood_gif', 'public/art/splashy_driftwood.gif');
      this.load.image('driftWood', 'public/art/splashy_driftwood.png');
      this.load.image('rock', 'public/art/boulder01.png');

      this.load.image('placeholderButtonUp', 'public/art/placeholder_button_up.png');
      this.load.image('placeholderButtonDown', 'public/art/placeholder_button_down.png');
      this.load.image('arrows_8_way', 'public/art/grid_buttons.png');
      this.load.image('control_button_hitbox', 'public/art/hitbox_controlButton.png');

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

      this.load.spritesheet('howToSpy', 'public/art/spying_23_frames_286x321.png', {
         frameWidth: 286,
         frameHeight: 321
      });

      this.load.audio('snd_uiButton', ['public/sound/ui_button.mp3']);

      this.load.audio('snd_searchProximity', ['public/sound/searchlight_near.mp3']);
      this.load.audio('snd_searchContact', ['public/sound/searchlight_contact_2.mp3']);
      this.load.audio('snd_landCollide', ['public/sound/land_hit_placeholder.mp3']);
      this.load.audio('snd_boomCollide', ['public/sound/boom_hit_placeholder.mp3']);
      this.load.audio('snd_bridgeCollide', ['public/sound/bridge_hit_placeholder.mp3']);
      this.load.audio('snd_rapidsOverlap', ['public/sound/rapids_over_placeholder.mp3']);

      this.load.audio('snd_boomChain', ['public/sound/boomChainSound.mp3']);
      this.load.audio('snd_sensorOn', ['public/sound/sensor_on.mp3']);
      this.load.audio('snd_sensorOff', ['public/sound/sensor_off_2.mp3']);
      this.load.audio('snd_spying', ['public/sound/spying_2.mp3']);
      this.load.audio('snd_intelOverlap', ['public/sound/collider_placeholder.mp3']);

      this.load.audio('snd_motorLoop', ['public/sound/motor_loop.mp3']);
      this.load.audio('snd_waterLoop', ['public/sound/flowing_stream_Argal.mp3']);

      this.load.audio('snd_selfDestruct', ['public/sound/self_destruct_2.mp3']);

      this.load.audio('snd_reachedMilestone', ['public/sound/milestone.mp3']);

      if (testing) {
         this.load.json('zoneData', 'public/json/testzoneParams.json');
      } else {
         this.load.json('zoneData', 'public/json/zoneParameters.json');
      }

      this.load.once('complete', () => {
         let canvas = document.createElement('canvas');
         canvas.height = 13;
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
   }

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
         makingZone = test_zone;
         this.scene.start('Game');
      }
      else if (developerMode) {
         makingZone = test_zone;
         this.scene.start('Home');
      }
      else {
         this.scene.start('Intro');
      }
   };

}
