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

        this.spawnPoint = this.map.getObjectLayer("Start").objects[0];
        this.endPoint = this.map.getObjectLayer("End").objects[0];
    }
}

export const TileMaps = new _TileMaps();
