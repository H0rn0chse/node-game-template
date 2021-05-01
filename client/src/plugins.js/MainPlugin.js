import { Goal } from "../gameObjects/Goal.js";
import { Player } from "../gameObjects/Player.js";
import { Phaser } from "../globals.js";
import { CustomGroupManager } from "../helper/CustomGroupManager.js";
import { DebugHelper } from "../helper/DebugHelper.js";
import { TileMaps } from "../helper/TileMaps.js";

export class MainPlugin extends Phaser.Plugins.BasePlugin {
    constructor (pluginManager) {
        super(pluginManager);

        pluginManager.registerGameObject("player", function (skinId, x, y) {
            return this.displayList.add(new Player(this.scene, skinId, x, y));
        });

        pluginManager.registerGameObject("goal", function (x, y) {
            return this.displayList.add(new Goal(this.scene, x, y));
        });

        pluginManager.installScenePlugin("tileMaps", TileMaps, "tileMaps");

        pluginManager.installScenePlugin("addGroup", CustomGroupManager, "addGroup");

        pluginManager.installScenePlugin("debug", DebugHelper, "debug");
    }

    destroy () {
        this.pluginManager.removeScenePlugin("tileMaps");
        this.pluginManager.removeScenePlugin("addGroup");
        this.pluginManager.removeScenePlugin("debug");

        super.destroy();
    }
}
