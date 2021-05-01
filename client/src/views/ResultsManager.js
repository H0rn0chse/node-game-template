import { PhaseBus } from "../EventBus.js";
import { PHASES, PLAYER_STATUS } from "../globals.js";
import { getId } from "../socket.js";
import { GameManager } from "./GameManager.js";

class _ResultsManager {
    constructor () {
        this.results = document.querySelector("#gameResults");
        this.resultsList = document.querySelector("#gameResultsList");
        this.backBtn = document.querySelector("#gameBack");
        this.nextBtn = document.querySelector("#gameNext");
        this.quitBtn = document.querySelector("#gameQuit");
        this.results.style.display = "none";

        this.backBtn.addEventListener("click", (evt) => {
            GameManager.stopGame();
        });

        this.nextBtn.addEventListener("click", (evt) => {
            GameManager.nextGame();
        });

        this.quitBtn.addEventListener("click", (evt) => {
            GameManager.leaveGame();
        });

        PhaseBus.on(PHASES.Results, this.onResults, this);
        PhaseBus.on(PHASES.PreRun, this.onPreRun, this);
    }

    // ========================================== Manager handler =============================================

    addResultRow (entryData, playerData, index) {
        const placement = document.createElement("span");
        this.resultsList.appendChild(placement);
        placement.innerText = index;

        const name = document.createElement("span");
        this.resultsList.appendChild(name);
        name.innerText = playerData.name;

        const you = document.createElement("span");
        this.resultsList.appendChild(you);
        if (playerData.id === getId()) {
            you.innerText = "(You)";
        }

        const status = document.createElement("span");
        this.resultsList.appendChild(status);
        if (entryData.status === PLAYER_STATUS.Dead) {
            status.innerText = `(${entryData.status})`;
        }

        const score = document.createElement("span");
        this.resultsList.appendChild(score);
        score.innerText = entryData.score;
    }

    // ========================================== Phase handler =============================================

    onResults (data) {
        this.resultsList.innerHTML = "";

        const list = Object.values(data.run).sort((a, b) => {
            return b.score - a.score;
        });

        list.forEach((entryData, index) => {
            const playerData = data.player[entryData.playerId];
            this.addResultRow(entryData, playerData, index + 1);
        });

        this.results.style.display = "";

        const isHost = data.host === getId();

        this.nextBtn.disabled = !isHost;
        this.backBtn.disabled = !isHost;
    }

    onPreRun () {
        this.results.style.display = "none";
    }

    // ========================================== Websocket handler =============================================
}
export const ResultsManager = new _ResultsManager();
globalThis.ResultsManager = ResultsManager;
