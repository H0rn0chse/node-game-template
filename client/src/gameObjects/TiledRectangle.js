import { Phaser, STATIC } from "../globals.js";

export class TiledRectangle extends Phaser.GameObjects.Rectangle {
    constructor (scene, tile) {
        // pixelX and pixelY are topLeft of the tile in relation to the layer
        // This calcualation assumes that the layer is positioned at 0,0 and the camera does not apply any scale
        const collisionData = tile.getTileData()?.objectgroup.objects[0];

        const { width, height } = collisionData;
        const x = tile.pixelX + collisionData.x;
        const y = tile.pixelY + collisionData.y;

        super(scene, 0, 0, width, height /* 0xff0000 */);

        this.setOrigin(0);
        this.setPosition(x, y);

        const { world } = scene.physics;
        world.enable([this], STATIC);
    }
}
