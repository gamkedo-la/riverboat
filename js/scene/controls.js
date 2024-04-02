class Controls extends Phaser.Scene {
   constructor() {
      super('Controls');
      // Object.assign(this, { scene });
      // scene.add.existing(this);
   }

   preload() {
   }

   create() {
      this.arrows8way = this.add.image(0, displayHeight - 192, 'arrows_8_way');
      this.arrows8way.setOrigin(0, 0);
      this.arrows8way.setAlpha(0.7);

      const hitAreas = [];
      const x_start = 0;
      const y_start = displayHeight - 192;
      const buttonWidth = 64;
      const buttonHeight = 64;
      const spacing = 0; // if any spacing between button hitareas

      const button_labels = ['up_left', 'up', 'up_right', 'left', 'pause', 'right', 'down_left', 'down', 'down_right'];
      let i = 0;

      for (let row = 0; row < 3; row++) {
         for (let col = 0; col < 3; col++) {
            i += 1;
            const x = col * (buttonWidth + spacing) + spacing + x_start;
            const y = row * (buttonHeight + spacing) + spacing + y_start; console.log(buttonWidth, 'x:', x, 'y:', y);
            hitAreas.push({ x, y, width: buttonWidth, height: buttonHeight, label: button_labels[i] });
         }
      }

      for (const area of hitAreas) {
         const hitAreaSprite = this.physics.add.sprite(area.x, area.y, 'control_button_hitbox');  // Set frame to 0 for transparency
         hitAreaSprite.setVisible(true);
         hitAreaSprite.setDepth(99);
         hitAreaSprite.setOrigin(0, 0);
         hitAreaSprite.setInteractive();

         hitAreaSprite.on('pointerdown', () => {
            console.log('Hit area clicked:', area);
         });
      }
   }
}
