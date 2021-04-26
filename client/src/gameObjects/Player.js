import { GameManager } from "../views/GameManager.js";
import { PhaseManager } from "../PhaseManager.js";
import { Phaser, PHASES, PLAYER_STATUS } from "../globals.js";

export class Player extends Phaser.Physics.Arcade.Image {
    constructor (scene, name, x, y) {
        const { world } = scene.physics;
        super(scene, x, y, "animals", name);

        world.enable([this], 0);

        this.setBounce(0.2);
        this.setCollideWorldBounds(true);

        this.setScale(0.25);

        this.isDead = false;
    }

    update (time, delta) {
        const pos = {
            x: this.x,
            y: this.y,
        };

        GameManager.updatePlayer(pos);

        if (this.isDead || !PhaseManager.isPhase(PHASES.Run) || GameManager.runEnded) {
            if (!this.isDead) {
                this.setVelocityX(0);
            }
            return;
        }

        const cursor = this.scene.input.keyboard.createCursorKeys();

        if (cursor.left.isDown) {
            this.body.setVelocityX(-180);
        } else if (cursor.right.isDown) {
            this.body.setVelocityX(180);
        } else {
            this.body.setVelocityX(0);
        }

        if (cursor.up.isDown && this.body.onFloor()) {
            this.body.setVelocityY(-500);
        }
    }

    die () {
        this.isDead = true;
        GameManager.endRun(PLAYER_STATUS.Dead);
    }

    resetPlayer (point) {
        this.isDead = false;
        this.setVelocity(0);
        this.setPosition(point.x, point.y);
    }
}
