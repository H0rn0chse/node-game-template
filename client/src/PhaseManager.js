import { getId, send, addEventListener } from "./socket.js";
import { GameManager } from "./views/GameManager.js";
import { Timer } from "./Timer.js";
import { PRERUN_COUNTDOWN, PHASES, PHASE_TEXTS, RESULTS_COUNTDOWN } from "./globals.js";
import { GameBus, PhaseBus } from "./EventBus.js";

class _PhaseManager {
    constructor () {
        addEventListener("joinGame", this.onJoinGame, this);
        addEventListener("setPhase", this.onSetPhase, this);
        addEventListener("setCountdown", this.onSetCountdown, this);
        addEventListener("runProgress", this.onRunProgress, this);
        addEventListener("runEnd", this.onRunEnd, this);

        this.currentPhase = PHASES.Initial;

        this.title = document.querySelector("#phaseTitle");
        this.setTitle(PHASE_TEXTS[this.currentPhase]);

        this.countdown = document.querySelector("#phaseCountdown");

        this.isHost = false;
        this.remainingSeconds = 0;

        PhaseBus.on(PHASES.PreRun, this.onPreRun, this);
        PhaseBus.on(PHASES.Run, this.onRun, this);
    }

    isPhase (phase) {
        return this.currentPhase === phase;
    }

    _startPhaseCountdown (seconds, phase) {
        this.remainingSeconds = seconds;

        const timer = new Timer(1, () => {
            send("setCountdown", { seconds: this.remainingSeconds });

            if (this.remainingSeconds > 0) {
                this.remainingSeconds -= 1;
                timer.start();
            } else {
                send("setPhase", { phase });
            }
        });
        timer.start();
        send("setCountdown", { seconds: this.remainingSeconds + 1 });
    }

    onPreRun () {
        if (!this.isHost) {
            return;
        }

        this._startPhaseCountdown(PRERUN_COUNTDOWN - 1, PHASES.Run);
    }

    onRun () {
        if (!this.isHost) {
            return;
        }

        send("resetRun", {});
    }

    onRunProgress (data) {
        console.log("runProgress", data);
    }

    onRunEnd (data) {
        if (!this.isHost) {
            return;
        }

        setTimeout(() => {
            data.phase = PHASES.Results;
            send("setPhase", data);
        }, RESULTS_COUNTDOWN * 1000);
    }

    onJoinGame (data) {
        this.isHost = data.host === getId();

        if (!this.isHost) {
            return;
        }
        send("setPhase", { phase: PHASES.PreRun });
    }

    onSetPhase (data) {
        if (!GameManager.ingame) {
            return;
        }

        this.currentPhase = data.phase;
        this.setTitle(PHASE_TEXTS[this.currentPhase]);

        PhaseBus.emit(data.phase, data);
    }

    setTitle (title) {
        this.title.innerText = title;
    }

    onSetCountdown (data) {
        const seconds = data.seconds ? `&nbsp;&nbsp;${data.seconds}` : "";
        this.countdown.innerHTML = seconds;
        GameBus.emit("countdown", data.seconds);
    }
}

export const PhaseManager = new _PhaseManager();
globalThis.PhaseManager = PhaseManager;
