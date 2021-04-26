import { CoinGroup } from "../gameObjects/CoinGroup.js";
import { PuppetGroup } from "../gameObjects/PuppetGroup.js";
import { SawGroup } from "../gameObjects/SawGroup.js";
import { TileMaps } from "../gameObjects/TileMaps.js";
import { Phaser, PLAYER_SKINS, SCENE_HEIGHT, SCENE_WIDTH } from "../globals.js";

export class MainScene extends Phaser.Scene {
    constructor () {
        super();
        // tbd
    }

    preload () {
        this.load.atlasXML("animals", "assets/atlas/animals.png", "assets/atlas/animals.xml");
        this.load.atlasXML("saw", "assets/atlas/saw.png", "assets/atlas/saw.xml");
        this.load.atlasXML("coin", "assets/atlas/coin.png", "assets/atlas/coin.xml");
        this.load.image("background", "assets/background.png");

        this.load.image("dummy", "/assets/tileset/dummy.png");
        this.load.image("goal", "/assets/tileset/goal.png");

        this.load.image("cake", "/assets/tileset/cake.png");
        this.load.image("spikes", "/assets/tileset/spikes.png");
        this.load.tilemapTiledJSON("level_0", "assets/tilemap/level_0.json");
    }

    create () {
        const levelId = 0;
        const background = this.add.image(SCENE_WIDTH, SCENE_HEIGHT, "background");
        background.x = SCENE_WIDTH / 2;
        background.y = SCENE_HEIGHT / 2;

        TileMaps.init(this, levelId);
        this.add.existing(new PuppetGroup(this));

        this.coinGroup = this.add.existing(new CoinGroup(this, TileMaps.coins));
        const sawGroup = this.add.existing(new SawGroup(this, TileMaps.saws));

        const skinList = Object.values(PLAYER_SKINS);
        const skinIndex = Math.floor(Math.random() * skinList.length);
        this.player = this.add.player(skinList[skinIndex].id, TileMaps.spawnPoint.x, TileMaps.spawnPoint.y);

        const goal = this.add.goal(TileMaps.endPoint.x, TileMaps.endPoint.y);

        // ================== collision / overlap ==================
        this.physics.add.collider(this.player, TileMaps.terrain);
        this.physics.add.collider(goal, TileMaps.terrain);
        this.physics.add.overlap(this.player, TileMaps.spikes, (player, tile) => {
            if (tile.collides) {
                player.die();
            }
        });
        this.physics.add.overlap(this.player, goal, goal.onPlayerOverlap);
        this.physics.add.overlap(this.player, sawGroup, this.player.die);
        this.physics.add.overlap(this.player, this.coinGroup, this.coinGroup.collectCoin.bind(this));
    }

    resetScene () {
        this.player.resetPlayer(TileMaps.spawnPoint);
        this.coinGroup.resetCoins();
    }

    update (time, delta) {
        this.player.update(time, delta);
    }
}
