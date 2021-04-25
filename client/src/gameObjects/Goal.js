import { Phaser } from "../globals.js";

export class Goal extends Phaser.Physics.Arcade.Image {
    constructor (scene, x, y) {
        super(scene, x, y, "goal");

        this.setScale(0.5);
        this.setOrigin(0, 1);

        scene.physics.world.enable([this], 0);

        this.setBounceY(2);
        this.setMaxVelocity(0, 100);
    }

    onPlayerOverlap () {
        console.log("game end");
    }
}
