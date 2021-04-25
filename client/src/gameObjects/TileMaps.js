export class _TileMaps {
    constructor () {
        this.map = null;
        this.terrain = null;
    }

    init (scene, levelId) {
        this.map = scene.make.tilemap({ key: `level_${levelId}` });

        this.cakeTileset = this.map.addTilesetImage("cake");

        this.terrain = this.map.createLayer("Terrain", this.cakeTileset, 0, 0);
        this.terrain.setCollisionByExclusion([-1], true);
    }
}

export const TileMaps = new _TileMaps();
