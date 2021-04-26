import { Phaser } from "../globals.js";
import { Saw } from "./Saw.js";

export class SawGroup extends Phaser.Physics.Arcade.Group {
    constructor (scene, saws = []) {
        const { world } = scene.physics;
        super(world, scene);

        saws.forEach((sawData) => {
            const saw = new Saw(scene, sawData.start, sawData.end);
            this.add(saw, true);
            saw.body.setAllowGravity(false);
        });
    }
}
