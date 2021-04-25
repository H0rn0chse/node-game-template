import { GameInstance } from "../GameInstance.js";
import { ViewManager } from "../ViewManager.js";
import { getId, send, addEventListener, removeEventListener, ready } from "../socket.js";
import { GameBus } from "../EventBus.js";

class _GameManager {
    constructor () {
        this.lobbyName = "";
        this.ingame = false;

        this.container = document.querySelector("#game");
        this.points = document.querySelector("#gamePoints");

        this.instance = null;

        this.gameHandler = [
            { channel: "playerRemoved", handler: this.onPlayerRemoved },
            { channel: "closeGame", handler: this.onCloseGame },
            { channel: "playerUpdate", handler: this.onPlayerUpdate },

        ];

        // initial state
        ready().then(() => {
            addEventListener("joinGame", this.onJoinGame, this);
        });
    }

    show () {
        this.startListen();
        this.container.style.display = "";
        this.instance = new GameInstance(this.container, this);
    }

    hide () {
        this.ingame = false;
        this.stopListen();
        this.container.style.display = "none";

        this.instance.destroy();
        this.instance = null;
    }

    updatePlayer (pos) {
        const data = {
            pos,
        };
        send("playerUpdate", data);
    }

    onPlayerUpdate (data) {
        if (data.id === getId()) {
            return;
        }

        GameBus.emit("playerUpdated", data.id, data);
    }

    onJoinGame (data) {
        this.lobbyName = data.name;
        this.ingame = true;
        ViewManager.showGame();

        Object.values(data.player).forEach((playerData) => {
            if (playerData.id === getId()) {
                return;
            }

            GameBus.emit("playerUpdated", playerData.id, playerData);
        });
    }

    onPlayerRemoved (data) {
        GameBus.emit("playerRemoved", data.id);
    }

    onCloseGame (data) {
        console.log("host left the game", data);
        ViewManager.showOverview();
    }

    stopListen () {
        addEventListener("joinGame", this.onJoinGame, this);

        this.gameHandler.forEach((data) => {
            removeEventListener(data.channel, data.handler, this);
        });
    }

    startListen () {
        removeEventListener("joinGame", this.onJoinGame, this);

        this.gameHandler.forEach((data) => {
            addEventListener(data.channel, data.handler, this);
        });
    }
}

export const GameManager = new _GameManager();
globalThis.GameManager = GameManager;
