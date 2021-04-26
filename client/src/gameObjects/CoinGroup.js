import { Phaser } from "../globals.js";
import { Coin } from "./Coin.js";

export class CoinGroup extends Phaser.Physics.Arcade.StaticGroup {
    constructor (scene, coins = []) {
        const { world } = scene.physics;
        super(world, scene);

        coins.forEach((coinData) => {
            const coin = new Coin(scene, coinData.x, coinData.y);
            this.add(coin, true);
        });
    }

    collectCoin () {
        console.log("collected Coin");
    }
}
