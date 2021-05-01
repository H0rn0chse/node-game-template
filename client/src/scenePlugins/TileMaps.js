import { BaseScenePlugin } from "./BaseScenePlugin.js";

export class TileMaps extends BaseScenePlugin {
    constructor (scene) {
        super(scene);
    }

    init (levelId) {
        this.debug = this.scene.add.graphics();
        this.debug.setDepth(10);

        this.map = this.scene.make.tilemap({ key: `level_${levelId}` });

        this.cakeTileset = this.map.addTilesetImage("cake");
        this.spikeTileset = this.map.addTilesetImage("spikes");

        this.saws = this.map.getObjectLayer("Saws").objects.map((saw) => {
            return {
                start: {
                    x: saw.x + 32,
                    y: saw.y - 32,
                },
                end: {
                    x: saw.width + saw.x - 32,
                    y: saw.y - 32,
                },
            };
        });

        this.coins = this.map.getObjectLayer("Coins").objects.map((coin) => {
            return {
                coinId: coin.id,
                x: coin.x,
                y: coin.y - 32,
            };
        });

        this.spawnPoint = this.map.getObjectLayer("Points").objects.find((point) => {
            return point.name === "Start";
        });
        this.endPoint = this.map.getObjectLayer("Points").objects.find((point) => {
            return point.name === "End";
        });
    }

    createLayer (layerId) {
        let tileset;

        switch (layerId) {
            case "Terrain":
                tileset = this.cakeTileset;
                break;
            case "Spikes":
                tileset = this.spikeTileset;
                break;
            default:
        }

        const layer = this.map.createLayer(layerId, tileset, 0, 0);

        switch (layerId) {
            case "Terrain":
                break;
            default:
                layer.setCollisionByExclusion([-1], true);
        }

        return layer;
    }
}
