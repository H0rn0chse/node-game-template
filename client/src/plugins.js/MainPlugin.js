import { Goal } from "../gameObjects/Goal.js";
import { Player } from "../gameObjects/Player.js";
import { Phaser } from "../globals.js";

export class MainPlugin extends Phaser.Plugins.BasePlugin {
    constructor (pluginManager) {
        super(pluginManager);

        pluginManager.registerGameObject("player", function (skinId, x, y) {
            return this.displayList.add(new Player(this.scene, skinId, x, y));
        });

        pluginManager.registerGameObject("goal", function (x, y) {
            return this.displayList.add(new Goal(this.scene, x, y));
        });
    }
}
