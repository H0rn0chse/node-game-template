import { Phaser } from "../globals.js";

export class Puppet extends Phaser.Physics.Arcade.Image {
    constructor (scene, name, playerId) {
        super(scene, 0, 0, "animals", name);
        this.playerId = playerId;

        this.setScale(0.25);
    }
}
