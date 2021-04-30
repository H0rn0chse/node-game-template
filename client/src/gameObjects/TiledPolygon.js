import { Phaser, STATIC } from "../globals.js";

export class TiledPolygon extends Phaser.GameObjects.Polygon {
    constructor (scene, tile) {
        // pixelX and pixelY are topLeft of the tile in relation to the layer
        // This calcualation assumes that the layer is positioned at 0,0 and the camera does not apply any scale
        const collisionData = tile.getTileData()?.objectgroup.objects[0];

        // The points are relative to the polygon position
        // phaser draws the object correct, but cannot handle them in a body
        const points = collisionData.polygon.map((point) => {
            return {
                x: point.x + collisionData.x,
                y: point.y + collisionData.y,
            };
        });
        const x = tile.pixelX;
        const y = tile.pixelY;

        super(scene, 0, 0, points /* 0xff0000 */);

        this.setOrigin(0);
        this.setPosition(x, y);

        const { world } = scene.physics;
        world.enable([this], STATIC);

        const topLeft = points.reduce((target, point) => {
            const { x, y } = point;

            if (target === null) {
                return {
                    x,
                    y,
                };
            }
            target.x = x < target.x ? x : target.x;
            target.y = y < target.y ? y : target.y;
            return target;
        }, null);

        this.body.setOffset(topLeft.x, topLeft.y);
    }
}
