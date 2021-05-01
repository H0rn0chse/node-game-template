import { HighscoreEntry } from "../domElements/HighscoreEntry.js";
import { addEventListener, removeEventListener, send } from "../socket.js";

class _HighscoreManager {
    constructor () {
        this.list = document.querySelector("#highscoreList");

        this.entries = [];
        for (let i = 0; i < 10; i++) {
            const entry = new HighscoreEntry(i + 1, "name", "0");
            this.list.appendChild(entry.container);
            this.entries.push(entry);
        }

        this.listening = false;
    }

    onHighscoreUpdate (list) {
        list.forEach((entry, index) => {
            this.entries[index].setName(entry.name);
            this.entries[index].setScore(entry.score);
            this.entries[index].setVisible(true);
        });
    }

    stopListen () {
        removeEventListener("highscoreUpdate", this.onHighscoreUpdate);
        send("unsubscribeHighscore");
        this.listening = false;
    }

    startListen () {
        addEventListener("highscoreUpdate", this.onHighscoreUpdate, this);
        send("subscribeHighscore");
        this.listening = true;
    }
}

export const HighscoreManager = new _HighscoreManager();
globalThis.HighscoreManager = HighscoreManager;
