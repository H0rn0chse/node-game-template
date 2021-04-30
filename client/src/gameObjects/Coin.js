import { Phaser, STATIC } from "../globals.js";

export class Coin extends Phaser.Physics.Arcade.Sprite {
    constructor (scene, x, y, coinId) {
        super(scene, x, y, "coin", "coin_0");

        this.coinId = coinId;

        const { world } = scene.physics;
        world.enable([this], STATIC);

        scene.anims.create({
            key: "coinRotate",
            frames: [
                { key: "coin", frame: "coin_0" },
                { key: "coin", frame: "coin_1" },
                { key: "coin", frame: "coin_2" },
                { key: "coin", frame: "coin_3" },
                { key: "coin", frame: "coin_4" },
                { key: "coin", frame: "coin_5" },
            ],
            frameRate: 8,
            repeat: -1,
        });

        this.anims.play("coinRotate");
    }

    hide () {
        this.setVisible(false);
        this.body.enable = false;
    }

    show () {
        this.setVisible(true);
        this.body.enable = true;
    }
}
