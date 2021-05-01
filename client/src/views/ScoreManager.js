import { addEventListener } from "../socket.js";
import { GameBus, PhaseBus } from "../EventBus.js";
import { PHASES, SCORE_COIN, SCORE_START, SCORE_TICK } from "../globals.js";
import { Timer } from "../Timer.js";

class _ScoreManager {
    constructor () {
        this.container = document.querySelector("#gameStats");
        this.score = document.querySelector("#score");

        this.currentScore = 0;
        this.running = false;
        this.timer = new Timer(SCORE_TICK, this.onTick.bind(this));

        addEventListener("coinCollected", this.onCoinCollected, this);
        addEventListener("updateScore", this.onUpdateScore, this);

        PhaseBus.on(PHASES.Run, this.onRun, this);
        PhaseBus.on(PHASES.PreRun, this.onPreRun, this);
    }

    // ========================================== Game logic & handler =============================================

    clearScore () {
        this.currentScore = 0;
        this.updateScore();
    }

    resetScore () {
        this.currentScore = SCORE_START;
        this.updateScore();
    }

    updateScore () {
        this.score.innerText = this.currentScore;
    }

    startTimer () {
        this.running = true;
        this.timer.start();
    }

    stopTimer () {
        this.running = false;
    }

    getScore () {
        return this.currentScore;
    }

    onTick () {
        if (this.running) {
            if (this.currentScore > 0) {
                this.currentScore -= 1;
                this.updateScore();
            }

            this.startTimer();
        }
    }

    // ========================================== Phase handler =============================================

    onPreRun (data) {
        this.resetScore();
    }

    onRun (data) {
        this.startTimer();
    }

    // ========================================== Websocket handler =============================================

    onCoinCollected (data) {
        this.currentScore += SCORE_COIN;
        this.updateScore();
        GameBus.emit("coinCollected", {});
    }

    onUpdateScore (data) {
        this.currentScore = data.score;
        this.updateScore();
    }
}

export const ScoreManager = new _ScoreManager();
globalThis.ScoreManager = ScoreManager;
