import { DYNAMIC, Phaser, PLAYER_STATUS, STATIC } from "../globals.js";
import { GameManager } from "../views/GameManager.js";

export class Goal extends Phaser.Physics.Arcade.Image {
    constructor (scene, x, initialY) {
        const { world } = scene.physics;
        super(scene, x, initialY - 15, "goal");

        this.setScale(0.5);
        this.setOrigin(0, 1);

        scene.tweens.add({
            targets: this,
            y: initialY + 10,
            x,
            ease: "Sine.easeInOut",
            duration: 800,
            yoyo: true,
            repeat: -1,
        });

        world.enable([this], DYNAMIC);

        this.body.setAllowGravity(false);

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
