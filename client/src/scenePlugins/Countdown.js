import { Deferred } from "../Deferred.js";
import { GameBus } from "../EventBus.js";
import { BaseScenePlugin } from "./BaseScenePlugin.js";

export class Countdown extends BaseScenePlugin {
    constructor (scene) {
        super(scene);

        GameBus.on("countdown", this.announce, this);
        this.scene.events.on("create", this.init, this);
        this.deferred = new Deferred();
    }

    init () {
        this.numbers = {};

        for (let i = 1; i < 11; i++) {
            const sound = this.scene.sound.add(`count${i}`);
            this.scene.volume.addSound(sound);
            this.numbers[i] = sound;
        }

        this.deferred.resolve();
    }

    async announce (number) {
        await this.deferred.promise;

        const sound = this.numbers[number];
        if (sound) {
            sound.play();
        }
    }

    destroy () {
        GameBus.off("countdown", this.announce, this);
        this.scene.events.on("create", this.init, this);
    }
}
