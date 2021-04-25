import { GameManager } from "../views/GameManager.js";
import { Phaser } from "../globals.js";

export class Player extends Phaser.Physics.Arcade.Image {
    constructor (scene, name, x, y) {
        super(scene, x, y, "animals", name);

        scene.physics.world.enable([this], 0);

        this.setBounce(0.2);
        this.setCollideWorldBounds(true);

        this.setScale(0.25);
    }

    update (time, delta) {
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

        const pos = {
            x: this.x,
            y: this.y,
        };

        GameManager.updatePlayer(pos);
    }

    die () {
        console.log("The player died");
    }
}
