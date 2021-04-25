import { Phaser, SCENE_HEIGHT, SCENE_WIDTH } from "./globals.js";
import { MainScene } from "./scenes/MainScene.js";
import { MainPlugin } from "./plugins.js/MainPlugin.js";

export class GameInstance {
    constructor (container, controller) {
        this.container = container;

        this.controller = controller;

        const config = {
            type: globalThis.Phaser.AUTO,
            width: SCENE_WIDTH,
            height: SCENE_HEIGHT,
            parent: container,
            physics: {
                default: "arcade",
                arcade: {
                    debug: false,
                    gravity: { y: 600 },
                },
            },
            plugins: {
                global: [
                    { key: "MainPlugin", plugin: MainPlugin, start: true },
                ],
            },
            scene: MainScene,
        };

        this.game = new Phaser.Game(config);
    }

    destroy () {
        this.game.destroy(true);
    }
}
