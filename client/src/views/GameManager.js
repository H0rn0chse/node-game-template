import { GameInstance } from "../GameInstance.js";
import { ViewManager } from "../ViewManager.js";
import { getId, send, addEventListener, removeEventListener, ready } from "../socket.js";
import { GameBus, PhaseBus } from "../EventBus.js";
import { PHASES } from "../globals.js";

class _GameManager {
    constructor () {
        this.lobbyName = "";
        this.ingame = false;

        this.container = document.querySelector("#game");
        this.points = document.querySelector("#gamePoints");

        // Results
        this.results = document.querySelector("#gameResults");
        this.resultsList = document.querySelector("#gameResultsList");
        this.resultsNextButton = document.querySelector("#gameResultsNext");
        this.results.style.display = "none";
        this.resultsNextButton.addEventListener("click", (evt) => {
            this.nextGame();
        });

        this.instance = null;

        this.gameHandler = [
            { channel: "playerRemoved", handler: this.onPlayerRemoved },
            { channel: "closeGame", handler: this.onCloseGame },
            { channel: "playerUpdate", handler: this.onPlayerUpdate },
            { channel: "resetRun", handler: this.onResetRun },
        ];

        this.runEnded = true;
        PhaseBus.on(PHASES.Results, this.onResults, this);
        PhaseBus.on(PHASES.PreRun, this.onPreRun, this);

        // initial state
        ready().then(() => {
            addEventListener("joinGame", this.onJoinGame, this);
        });
    }

    // ========================================== Game logic & handler =============================================

    endRun (status) {
        if (!this.runEnded) {
            const data = {
                status,
            };
            send("runEnd", data);
            this.runEnded = true;
        }
    }

    updatePlayer (pos) {
        const data = {
            pos,
        };
        send("playerUpdate", data);
    }

    nextGame () {
        send("setPhase", { phase: PHASES.PreRun });
    }

    collectCoin (coinId) {
        console.log("collectingCoin", coinId);
    }

    // ========================================== Phase handler =============================================

    onResults (data) {
        this.resultsList.innerHTML = `<span>${JSON.stringify(data, null, 4)}</span>`;

        this.results.style.display = "";

        this.resultsNextButton.disabled = data.host !== getId();
    }

    onPreRun (data) {
        this.results.style.display = "none";
        this.instance.resetMainScene();
    }

    // ========================================== Websocket handler =============================================

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

    onResetRun () {
        this.runEnded = false;
    }

    // ========================================== Basic Manager Interface =============================================

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
