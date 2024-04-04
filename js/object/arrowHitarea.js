class arrowHitarea extends Phaser.GameObjects.Container {
   constructor(scene, x, y, width, height, label, targetCallback, callbackOnRelease) {
      super(scene, x, y);
      Object.assign(this, { scene, x, y, width, height, label, targetCallback, callbackOnRelease });
      this.createHitArea();
      scene.add.existing(this);
   }

   createHitArea() {
      this.hitArea = this.scene.add.rectangle(0, 0, this.width, this.height, 0x000000, 0);
      this.hitArea.setOrigin(0, 0);
      this.hitArea.setInteractive();
      this.add(this.hitArea);

      this.scrollFactorX = 0;
      this.setDepth(99);

      this.hitArea.on('pointerdown', () => {
         if (!this.repeatEvent) {
            this.repeatEvent = this.scene.time.addEvent({
               delay: 100,
               callback: this.targetCallback,
               callbackScope: this,
               loop: true
            });
         }
      });

      this.hitArea.on('pointerup', () => {
         this.clearEvents();
         this.callbackOnRelease();
      });
   }

   clearEvents() {
      if (this.repeatEvent) {
         this.repeatEvent.remove();
         this.repeatEvent = null;
      }
   }
}
