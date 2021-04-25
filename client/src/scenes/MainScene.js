import { PuppetGroup } from "../gameObjects/PuppetGroup.js";
import { TileMaps } from "../gameObjects/TileMaps.js";
import { Phaser, PLAYER_SKINS, SCENE_HEIGHT, SCENE_WIDTH } from "../globals.js";

export class MainScene extends Phaser.Scene {
    constructor () {
        super();
        // tbd
    }

    preload () {
        this.load.atlasXML("animals", "assets/atlas/animals.png", "assets/atlas/animals.xml");
        this.load.image("background", "assets/background.png");

        this.load.image("cake", "/assets/tileset/cake.png");
        this.load.tilemapTiledJSON("level_0", "assets/tilemap/level_0.json");
    }

    create () {
        const levelId = 0;
        const background = this.add.image(SCENE_WIDTH, SCENE_HEIGHT, "background");
        background.x = SCENE_WIDTH / 2;
        background.y = SCENE_HEIGHT / 2;

        TileMaps.init(this, levelId);
        this.add.existing(new PuppetGroup(this));

        const skinList = Object.values(PLAYER_SKINS);
        const skinIndex = Math.floor(Math.random() * skinList.length);
        this.player = this.add.player(skinList[skinIndex].id, 100, 100);

        this.physics.add.collider(this.player, TileMaps.terrain);
    }

    update (time, delta) {
        this.player.update(time, delta);
    }
}
