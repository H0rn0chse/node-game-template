import { CoinGroup } from "../gameObjects/CoinGroup.js";
import { LayerGroup } from "../gameObjects/LayerGroup.js";
import { PuppetGroup } from "../gameObjects/PuppetGroup.js";
import { SawGroup } from "../gameObjects/SawGroup.js";
import { BaseScenePlugin } from "./BaseScenePlugin.js";

export class CustomGroupManager extends BaseScenePlugin {
    constructor (scene) {
        super(scene);
    }

    puppet (...args) {
        const group = new PuppetGroup(this.scene, ...args);
        return this.scene.add.existing(group);
    }

    coin (...args) {
        const group = new CoinGroup(this.scene, ...args);
        return this.scene.add.existing(group);
    }

    saw (...args) {
        const group = new SawGroup(this.scene, ...args);
        return this.scene.add.existing(group);
    }

    layer (...args) {
        const group = new LayerGroup(this.scene, ...args);
        return this.scene.add.existing(group);
    }
}
