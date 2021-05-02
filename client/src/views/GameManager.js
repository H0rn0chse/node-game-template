import { GameInstance } from "../GameInstance.js";
import { ViewManager } from "../ViewManager.js";
import { AvatarManager } from "../AvatarManager.js";
import { ScoreManager } from "./ScoreManager.js";
import { PhaseManager } from "../PhaseManager.js";
import { getId, send, addEventListener, removeEventListener, ready } from "../socket.js";
import { DebugBus, GameBus, PhaseBus } from "../EventBus.js";
import { PHASES, PLAYER_STATUS } from "../globals.js";

class _GameManager {
    constructor () {
        this.lobbyName = "";
        this.ingame = false;

        this.container = document.querySelector("#game");
        this.instanceContainer = document.querySelector("#gameArea");

        this.debugCbx = document.querySelector("#debugCbx");
        this.debugCbx.addEventListener("change", (evt) => {
            DebugBus.emit("setDebug", this.debugCbx.checked);
        });

        this.instance = null;

        this.gameHandler = [
            { channel: "playerRemoved", handler: this.onPlayerRemoved },
            { channel: "closeGame", handler: this.onCloseGame },
            { channel: "playerUpdate", handler: this.onPlayerUpdate },
            { channel: "resetRun", handler: this.onResetRun },
            { channel: "hideCoin", handler: this.onHideCoin },
        ];

        this.runEnded = true;
        PhaseBus.on(PHASES.PreRun, this.onPreRun, this);

        // initial state
        ready().then(() => {
            addEventListener("joinGame", this.onJoinGame, this);
        });
    }

    // ========================================== Game logic & handler =============================================

    endRun (status) {
        ScoreManager.stopTimer();
        PhaseManager.setTitle("Waiting for others...");

        if (!this.runEnded) {
            if (status === PLAYER_STATUS.Dead) {
                ScoreManager.clearScore();
            }

            const data = {
                status,
                score: ScoreManager.getScore(),
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

    leaveGame () {
        send("leaveGame", {});
        ViewManager.showOverview();
    }

    stopGame () {
        send("stopGame", {});
    }

    collectCoin (coinId) {
        send("collectCoin", { coinId });
    }

    getGameInstanceConfig () {
        if (!this.lobbyData) {
            return;
        }

        const playerData = this.lobbyData.player[getId()];

        return {
            skinId: playerData.avatarId || AvatarManager.getDefault(),
            levelId: this.lobbyData.levelId,
        };
    }

    // ========================================== Phase handler =============================================

    onPreRun (data) {
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
        this.lobbyData = data;
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

    onHideCoin (data) {
        GameBus.emit("hideCoin", data.coinId);
    }

    // ========================================== Basic Manager Interface =============================================

    show () {
        this.startListen();
        this.container.style.display = "";
        this.instance = new GameInstance(this.instanceContainer, this);
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
