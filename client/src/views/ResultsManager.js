import { PhaseBus } from "../EventBus.js";
import { PHASES } from "../globals.js";
import { getId } from "../socket.js";
import { GameManager } from "./GameManager.js";

class _ResultsManager {
    constructor () {
        this.results = document.querySelector("#gameResults");
        this.resultsList = document.querySelector("#gameResultsList");
        this.resultsNextButton = document.querySelector("#gameResultsNext");
        this.results.style.display = "none";
        this.resultsNextButton.addEventListener("click", (evt) => {
            GameManager.nextGame();
        });

        PhaseBus.on(PHASES.Results, this.onResults, this);
        PhaseBus.on(PHASES.PreRun, this.onPreRun, this);
    }

    // ========================================== Manager handler =============================================

    // ========================================== Phase handler =============================================

    onResults (data) {
        this.resultsList.innerHTML = `<span>${JSON.stringify(data, null, 4)}</span>`;

        this.results.style.display = "";

        this.resultsNextButton.disabled = data.host !== getId();
    }

    onPreRun () {
        this.results.style.display = "none";
    }

    // ========================================== Websocket handler =============================================
}
export const ResultsManager = new _ResultsManager();
globalThis.ResultsManager = ResultsManager;
