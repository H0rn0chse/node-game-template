import { DebugBus } from "../EventBus.js";

export class DebugHelper {
    constructor (scene) {
        this.scene = scene;
        this.graphics = [];
        this.layers = new Map();

        DebugBus.on("setDebug", this.onSetDebug, this);

        setTimeout(() => {
            DebugBus.emit("setDebug", true);
            setTimeout(() => {
                //DebugBus.emit("setDebug", false);
            }, 3000);
        }, 2000);
    }

    addLayer (layerId, layer) {
        this.layers.set(layerId, layer);
    }

    removeLayer (layerId) {
        this.layers.delete(layerId);
    }

    onSetDebug (showDebug) {
        if (showDebug) {
            const physicsGraphic = this.scene.physics.world.createDebugGraphic();
            this.graphics.push(physicsGraphic);

            this.layers.forEach((layer) => {
                const graphic = this.scene.add.graphics();
                layer.renderDebug(graphic, {
                    tileColor: null,
                    // collidingTileColor: null,
                    faceColor: null,
                });
                this.graphics.push(graphic);
            });
        } else {
            this.graphics.forEach((graphic) => {
                graphic.destroy();
            });
        }
    }
}