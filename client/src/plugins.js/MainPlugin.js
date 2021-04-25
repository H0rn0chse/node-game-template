import { Player } from "../gameObjects/Player.js";
import { Phaser } from "../globals.js";

export class MainPlugin extends Phaser.Plugins.BasePlugin {
    constructor (pluginManager) {
        super(pluginManager);

        pluginManager.registerGameObject("player", function (x, y) {
            return this.displayList.add(new Player(this.scene, x, y));
        });
    }
}
