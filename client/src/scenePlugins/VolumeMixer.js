import { GameBus } from "../EventBus.js";
import { BaseScenePlugin } from "./BaseScenePlugin.js";
import { SoundManager } from "../views/SoundManager.js";

export class VolumeMixer extends BaseScenePlugin {
    constructor (scene) {
        super(scene);

        this.music = new Map();
        this.sound = new Map();

        GameBus.on("musicVolume", this._setMusicVolume, this);
        GameBus.on("soundVolume", this._setSoundVolume, this);
    }

    _setSoundVolume (volume) {
        this.sound.forEach((sound) => {
            sound.setVolume(volume);
        });
    }

    _setMusicVolume (volume) {
        this.music.forEach((sound) => {
            sound.setVolume(volume);
        });
    }

    addMusic (sound) {
        this.music.set(sound, sound);
        sound.setVolume(SoundManager.getMusicVolume());
    }

    addSound (sound) {
        this.sound.set(sound, sound);
        sound.setVolume(SoundManager.getSoundVolume());
    }

    removeMusic (sound) {
        this.music.delete(sound);
    }

    removeSound (sound) {
        this.sound.delete(sound);
    }

    destroy () {
        GameBus.off("musicVolume", this._setMusicVolume, this);
        GameBus.off("soundVolume", this._setSoundVolume, this);
    }
}
