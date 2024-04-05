class ScrollableText extends Phaser.GameObjects.Container {
   constructor(scene, x, y, width, height, text, style) {
      super(scene, x, y);

      // Merge the provided style object with the default color and fontFamily
      style = Object.assign({}, { color: '#ffffff', fontFamily: 'Arial' }, style);

      this.textBox = scene.add.text(0, 0, text, style);
      this.textBox.setWordWrapWidth(width);
      this.textBox.setFixedSize(width, height);
      this.textBox.setOrigin(0, 0);
      this.textBox.setInteractive();

      this.scrollBar = scene.add.graphics();
      this.scrollBar.fillStyle(0xcccccc);
      this.scrollBar.fillRect(width - 10, 0, 10, height);
      this.scrollBar.setInteractive();

      this.scrollThumb = scene.add.graphics();
      this.scrollThumb.fillStyle(0x888888);
      this.scrollThumb.fillRect(width - 10, 0, 10, 20);
      this.scrollThumb.setInteractive();

      this.add(this.textBox);
      this.add(this.scrollBar);
      this.add(this.scrollThumb);

      this.scrollThumb.on('pointerdown', this.startDrag, this);
      this.scrollThumb.on('pointermove', this.doDrag, this);
      this.scrollThumb.on('pointerup', this.stopDrag, this);
      this.scrollThumb.on('pointerupoutside', this.stopDrag, this);

      this.textBox.on('wheel', (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
         this.onMouseWheel(deltaY);
      });

      scene.add.existing(this);
   }

   startDrag(pointer) {
      this.dragStart = pointer.y;
   }

   doDrag(pointer) {
      if (this.dragStart !== null) {
         const maxScroll = this.textBox.height - this.textBox.displayHeight;
         const thumbHeight = Math.max(20, this.scrollBar.height * (this.textBox.displayHeight / this.textBox.height));
         const scrollAmount = (pointer.y - this.dragStart) * (maxScroll / (this.scrollBar.height - thumbHeight));
         this.textBox.setScrollY(scrollAmount);
         this.scrollThumb.y = scrollAmount * (this.scrollBar.height - thumbHeight) / maxScroll;
      }
   }

   stopDrag() {
      this.dragStart = null;
   }

   onMouseWheel(deltaY) {
      const maxScroll = this.textBox.height - this.textBox.displayHeight;
      const scrollAmount = deltaY * 0.1; // Adjust the scrolling speed as needed
      const newScrollY = Phaser.Math.Clamp(this.textBox.scrollY + scrollAmount, 0, maxScroll);
      this.textBox.setScrollY(newScrollY);
      this.updateScrollThumb();
   }

   updateScrollThumb() {
      const maxScroll = this.textBox.height - this.textBox.displayHeight;
      const thumbHeight = Math.max(20, this.scrollBar.height * (this.textBox.displayHeight / this.textBox.height));
      this.scrollThumb.y = this.textBox.scrollY * (this.scrollBar.height - thumbHeight) / maxScroll;
   }
}
