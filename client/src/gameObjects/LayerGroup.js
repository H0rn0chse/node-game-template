import { Phaser } from "../globals.js";
import { TiledEllipse } from "./TiledEllipse.js";
import { TiledPolygon } from "./TiledPolygon.js";
import { TiledRectangle } from "./TiledRectangle.js";

export class LayerGroup extends Phaser.Physics.Arcade.StaticGroup {
    constructor (scene, layer) {
        const { world } = scene.physics;
        super(world, scene);

        this.supportedShapes = ["rectangle", "ellipse", "polygon"];

        layer.forEachTile((tile /* tileId, tileList */) => {
            let shape;

            switch (this._getShape(tile)) {
                case "rectangle":
                    shape = new TiledRectangle(scene, tile);
                    break;
                case "ellipse":
                    shape = new TiledEllipse(scene, tile);
                    break;
                case "polygon":
                    shape = new TiledPolygon(scene, tile);
                    break;
                default:
            }

            if (shape) {
                this.add(shape, true);
            }
        }, this, 0, 0, layer.width, layer.height, { isNotEmpty: true });
    }

    _getCollision (tile) {
        return tile.getTileData()?.objectgroup.objects[0];
    }

    _getShape (tile) {
        const collisionData = this._getCollision(tile);
        if (!collisionData) {
            return;
        }

        for (const shape of this.supportedShapes) {
            if (collisionData[shape]) {
                return shape;
            }
        }
    }
}
