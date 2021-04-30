import { DYNAMIC, Phaser } from "../globals.js";

export class Saw extends Phaser.GameObjects.PathFollower {
    constructor (scene, startPos, endPos) {
        const path = new Phaser.Curves.Path(startPos.x, startPos.y).lineTo(endPos.x, endPos.y);

        super(scene, path, 0, 0, "saw", "saw_0");

        this.startFollow({
            positionOnPath: true,
            duration: 3000,
            yoyo: true,
            repeat: -1,
            rotateToPath: false,
            verticalAdjust: true,
        }, Math.random());

        const { world } = scene.physics;
        world.enable([this], DYNAMIC);

        // Will be overwritten by SawGroup
        this.body.setAllowGravity(false);

        const originalWidth = 64;
        const originalHeight = 64;
        const bodyRadius = 27;

        // The body is on bottom center
        this.body.setCircle(bodyRadius);
        this.body.setOffset((originalWidth - 2 * bodyRadius) / 2, originalHeight - bodyRadius);

        scene.anims.create({
            key: "sawRotate",
            frames: [
                { key: "saw", frame: "saw_0" },
                { key: "saw", frame: "saw_1" },
            ],
            frameRate: 20,
            repeat: -1,
        });

        this.anims.play("sawRotate");
    }
}
