class SearchlightBeam extends Phaser.GameObjects.Graphics {
   constructor(scene, lightSource, light) {
      super(scene);
 
      Object.assign(this, { scene, lightSource, light });
      scene.lights.add(this);
      scene.physics.world.enable(this);
      this.setDepth(40);
      this.color = 0x888800;
      // this.setAlpha(0.5);
      // this.body.setDrag(0);
      scene.add.existing(this);
   }

   update() {
      this.points = [];
      const lisrcX = this.lightSource.x;
      const lisrcY = this.lightSource.y;
      const lisrcH = this.lightSource.height;
      const lisrcW = this.lightSource.width;
      const lightX = this.light.x;
      const lightY = this.light.y;
      const lightH = this.light.height;
      // const lightW = this.light.width;

      // light offsets
      const lightYOffsetFar = 71;
      const lightYOffsetNear = 71;

      // light source offsets
      const lisrcXOffsetLeft = -17;
      const lisrcXOffsetRight = 17;

      const lisrcYOffsetFar = 88;
      const lisrcYOffsetNear = 65;

      if (lisrcX < lightX) {
         this.points.push({ x: lisrcX + lisrcW + lisrcXOffsetLeft, y: lisrcY + lisrcYOffsetFar});
         this.points.push({ x: lightX, y: lightY + lightYOffsetFar });  
         this.points.push({ x: lightX, y: lightY + lightH + lightYOffsetNear });
         this.points.push({ x: lisrcX + lisrcW + lisrcXOffsetLeft, y: lisrcY + lisrcH + lisrcYOffsetNear });
      } else {
         this.points.push({ x: lisrcX - lisrcW + lisrcXOffsetRight, y: lisrcY + lisrcYOffsetFar});
         this.points.push({ x: lightX, y: lightY + lightYOffsetFar });  
         this.points.push({ x: lightX, y: lightY + lightH + lightYOffsetNear });
         this.points.push({ x: lisrcX - lisrcW + lisrcXOffsetRight, y: lisrcY + lisrcH + lisrcYOffsetNear });
      }

      this.cutoutY = lightY + lightYOffsetFar + lightH / 2 + 1;

      this.draw();
   }

   draw() {
      this.clear();
      this.lineStyle(0, this.color, 0);
      this.fillStyle(this.color, 0.5);

      // Start the path at the first point of the polygon
      this.beginPath();
      this.lineTo(this.points[0].x, this.points[0].y);
      this.lineTo(this.points[1].x, this.points[1].y);

      const towerOnLeft = this.lightSource.x < this.light.x;
      if (towerOnLeft) {
         this.arc(this.light.x, this.cutoutY, this.light.height/2, Phaser.Math.DegToRad(270), Phaser.Math.DegToRad(90), true);
      } else {
         this.arc(this.light.x, this.cutoutY, this.light.height/2, Phaser.Math.DegToRad(270), Phaser.Math.DegToRad(90), false);
      }

      this.lineTo(this.points[2].x, this.points[2].y);
      this.lineTo(this.points[3].x, this.points[3].y);

      // Close the path and fill it
      this.closePath();
      this.fillPath();
   }
};
