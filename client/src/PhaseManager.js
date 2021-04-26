import { getId, send, addEventListener } from "./socket.js";
import { GameManager } from "./views/GameManager.js";
import { Timer } from "./Timer.js";
import { PHASES, PHASE_TEXTS } from "./globals.js";

class _PhaseManager {
    constructor () {
        addEventListener("joinGame", this.onJoinGame, this);
        addEventListener("setPhase", this.onSetPhase, this);
        addEventListener("setCountdown", this.onSetCountdown, this);
        addEventListener("runProgress", this.onRunProgress, this);
        addEventListener("runEnd", this.onRunEnd, this);

        this.currentPhase = PHASES.Initial;

        this.title = document.querySelector("#phaseTitle");
        this.title.innerText = this.currentPhase;

        this.countdown = document.querySelector("#phaseCountdown");

        this.isHost = false;
        this.remainingSeconds = 0;

        this.listener = {};
        Object.keys(PHASES).forEach((key) => {
            this.listener[key] = [];
        });

        this.listen(PHASES.PreRun, this.onPreRun.bind(this));
        this.listen(PHASES.Run, this.onRun.bind(this));
    }

    listen (phase, handler) {
        this.listener[phase].push(handler);
    }

    dispatch (phase, data) {
        this.listener[phase].forEach((handler) => {
            handler(data);
        });
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

    onColors () {
        if (!this.isHost) {
            return;
        }

        setTimeout(() => {
            send("setPhase", { phase: PHASES.Build });
        }, 1000);
    }

    onBuild () {
        if (!this.isHost) {
            return;
        }

        this._startPhaseCountdown(10, PHASES.PreRun);
    }

    onPreRun () {
        if (!this.isHost) {
            return;
        }

        this._startPhaseCountdown(3, PHASES.Run);
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

        data.phase = PHASES.Results;

        send("setPhase", data);
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

        // todo: Check if we need to wait for the scene / deferred
        this.currentPhase = data.phase;
        this.title.innerText = PHASE_TEXTS[this.currentPhase];

        this.dispatch(data.phase, data);
    }

    onSetCountdown (data) {
        const seconds = data.seconds ? `&nbsp;&nbsp;${data.seconds}` : "";
        this.countdown.innerHTML = seconds;
    }
}

export const PhaseManager = new _PhaseManager();
globalThis.PhaseManager = PhaseManager;
