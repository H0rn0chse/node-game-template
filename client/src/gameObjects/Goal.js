import { DYNAMIC, Phaser, PLAYER_STATUS } from "../globals.js";
import { GameManager } from "../views/GameManager.js";

export class Goal extends Phaser.Physics.Arcade.Image {
    constructor (scene, x, y) {
        const { world } = scene.physics;
        super(scene, x, y, "goal");

        this.setScale(0.5);
        this.setOrigin(0, 1);

        world.enable([this], DYNAMIC);

        this.setBounceY(2);
        this.setMaxVelocity(0, 100);

        this.sound = scene.sound.add("win");
        scene.volume.addSound(this.sound);
    }

    onPlayerOverlap () {
        if (GameManager.runEnded) {
            return;
        }

        this.sound.play();
        GameManager.endRun(PLAYER_STATUS.Alive);
    }
}
