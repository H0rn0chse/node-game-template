import { Phaser } from "../globals.js";

export class Coin extends Phaser.Physics.Arcade.Sprite {
    constructor (scene, x, y) {
        const { world } = scene.physics;
        super(scene, x, y, "coin", "coin_0");

        world.enable([this], 1);

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
}
