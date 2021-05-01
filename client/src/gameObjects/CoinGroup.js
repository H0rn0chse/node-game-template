import { GameBus } from "../EventBus.js";
import { Phaser } from "../globals.js";
import { Coin } from "./Coin.js";
import { GameManager } from "../views/GameManager.js";

export class CoinGroup extends Phaser.Physics.Arcade.StaticGroup {
    constructor (scene, coins = []) {
        const { world } = scene.physics;
        super(world, scene);

        coins.forEach((coinData) => {
            const coin = new Coin(scene, coinData.x, coinData.y, coinData.coinId);
            this.add(coin, true);
            coin.setVisible(true);
        });

        this.sound = scene.sound.add("coin_collect");
        scene.volume.addSound(this.sound);

        GameBus.on("hideCoin", this.onHideCoin, this);
        GameBus.on("coinCollected", this.onCoinCollected, this);
    }

    collectCoin (player, coin) {
        GameManager.collectCoin(coin.coinId);
        coin.hide();
    }

    onHideCoin (coinId) {
        const coin = this.getMatching("coinId", coinId)[0];
        if (coin) {
            coin.hide();
        }
    }

    onCoinCollected () {
        this.sound.play();
    }

    resetCoins () {
        const hiddenCoins = this.getMatching("visible", false);
        hiddenCoins.forEach((coin) => {
            coin.show();
        });
    }

    destroy (...args) {
        GameBus.off("hideCoin", this.onHideCoin, this);
        super.destroy(...args);
    }
}
