class _ScoreManager {
    constructor () {
        this.score = document.querySelector("score");
    }
}

export const ScoreManager = new _ScoreManager();
globalThis.ScoreManager = ScoreManager;
