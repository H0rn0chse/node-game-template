export class _TileMaps {
    constructor () {
        this.map = null;
        this.terrain = null;
    }

    init (scene, levelId) {
        this.map = scene.make.tilemap({ key: `level_${levelId}` });

        this.cakeTileset = this.map.addTilesetImage("cake");
        this.spikeTileset = this.map.addTilesetImage("spikes");

        this.terrain = this.map.createLayer("Terrain", this.cakeTileset, 0, 0);
        this.terrain.setCollisionByExclusion([-1], true);

        this.spikes = this.map.createLayer("Spikes", this.spikeTileset, 0, 0);
        this.spikes.setCollisionByExclusion([-1], true);

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
}

export const TileMaps = new _TileMaps();
