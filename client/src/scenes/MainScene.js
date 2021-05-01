import { Phaser, SCENE_HEIGHT, SCENE_WIDTH } from "../globals.js";

export class MainScene extends Phaser.Scene {
    constructor () {
        super();
        // tbd
    }

    preload () {
        this.load.image("background", "assets/background.png");

        this.load.setPath("assets/atlas");
        this.load.atlasXML("animals", "animals.png", "animals.xml");
        this.load.atlasXML("saw", "saw.png", "saw.xml");
        this.load.atlasXML("coin", "coin.png", "coin.xml");

        this.load.setPath("assets/tileset");
        this.load.image("dummy", "dummy.png");
        this.load.image("goal", "goal.png");
        this.load.image("cake", "cake.png");
        this.load.image("spikes", "spikes.png");

        this.load.setPath("assets/tilemap");
        this.load.tilemapTiledJSON("level_0", "level_0.json");
        this.load.tilemapTiledJSON("level_1", "level_1.json");

        this.load.setPath("assets/sound");
        this.load.audio("theme", "theme.ogg");
        this.load.audio("coin_collect", "coin_collect.ogg");
        this.load.audio("loose", "loose.ogg");
        this.load.audio("win", "win.ogg");
        this.load.audio("jump", "jump.ogg");

        this.load.setPath("assets/sound/walk");
        for (let i = 0; i < 4; i++) {
            this.load.audio(`walk_${i}`, `walk_goo_00${i}.ogg`);
        }

        this.load.setPath("assets/sound/countdown");
        for (let i = 1; i < 11; i++) {
            this.load.audio(`count${i}`, `${i}.ogg`);
        }
    }

    create () {
        const { instanceConfig } = this.game;
        const { levelId, skinId } = instanceConfig;

        this.sound.setVolume(0.2);
        this.sound.pauseOnBlur = false;

        const background = this.add.image(SCENE_WIDTH, SCENE_HEIGHT, "background");
        background.x = SCENE_WIDTH / 2;
        background.y = SCENE_HEIGHT / 2;
        const theme = this.sound.add("theme");
        this.volume.addMusic(theme);
        theme.play({ loop: true });

        this.tileMaps.init(levelId);
        const terrainLayer = this.tileMaps.createLayer("Terrain");
        const terrain = this.addGroup.layer(terrainLayer);
        const spikes = this.tileMaps.createLayer("Spikes");

        this.debug.addLayer("Spikes", spikes);

        this.addGroup.puppet();

        this.coinGroup = this.addGroup.coin(this.tileMaps.coins);
        const sawGroup = this.addGroup.saw(this.tileMaps.saws);

        this.player = this.add.player(skinId, this.tileMaps.spawnPoint.x, this.tileMaps.spawnPoint.y);
        this.player.setDepth(1);

        const goal = this.add.goal(this.tileMaps.endPoint.x, this.tileMaps.endPoint.y);

        // ================== collision / overlap ==================
        this.physics.add.collider(this.player, terrain);
        this.physics.add.collider(goal, terrain);
        this.physics.add.overlap(this.player, spikes, (player, tile) => {
            if (tile.collides) {
                player.die();
            }
        });
        this.physics.add.overlap(this.player, goal, goal.onPlayerOverlap, null, goal);
        this.physics.add.overlap(this.player, sawGroup, this.player.die, null, this.player);
        this.physics.add.overlap(this.player, this.coinGroup, this.coinGroup.collectCoin, null, this.coinGroup);
    }

    resetScene () {
        this.player.resetPlayer(this.tileMaps.spawnPoint);
        this.coinGroup.resetCoins();
    }

    update (time, delta) {
        this.player.update(time, delta);
    }
}
