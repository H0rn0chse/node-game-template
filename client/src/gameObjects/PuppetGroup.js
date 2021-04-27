import { GameBus } from "../EventBus.js";
import { Phaser } from "../globals.js";
import { Puppet } from "./Puppet.js";

export class PuppetGroup extends Phaser.GameObjects.Group {
    constructor (scene) {
        super(scene);

        GameBus.on("playerUpdated", this.onPlayerUpdated, this);
        GameBus.on("playerRemoved", this.onPlayerRemoved, this);
    }

    onPlayerUpdated (playerId, data) {
        let puppet = this.getMatching("playerId", playerId)[0];

        if (!puppet) {
            puppet = new Puppet(this.scene, data.avatarId, playerId);
            this.add(puppet, true);
        }

        const { x, y } = data.pos;
        puppet.setPosition(x, y);
    }

    onPlayerRemoved (playerId) {
        const puppet = this.getMatching("playerId", playerId)[0];
        if (puppet) {
            this.remove(puppet, true, true);
        }
    }

    destroy (...args) {
        GameBus.off("playerUpdated", this.onPlayerUpdated, this);
        GameBus.off("playerRemoved", this.onPlayerRemoved, this);
        super.destroy(...args);
    }
}
