import { HighscoreEntry } from "./HighscoreEntry.js";
import { addEventListener, removeEventListener, send } from "./socket.js";

class _HighscoreManager {
    constructor () {
        this.list = document.querySelector("#highscoreList");
        this.userName = document.querySelector("#userName input");

        this.entries = [];
        for (let i = 0; i < 10; i++) {
            const entry = new HighscoreEntry(i + 1, "name", "0");
            this.list.appendChild(entry.container);
            this.entries.push(entry);
        }

        this.userName.addEventListener("focusout", (evt) => {
            send("userNameUpdate", { name: this.userName.value });
        });
    }

    onHighscoreUpdate (list) {
        list.forEach((entry, index) => {
            this.entries[index].setName(entry.name);
            this.entries[index].setPoints(entry.points);
            this.entries[index].setVisible(true);
        });
    }

    stopListen () {
        removeEventListener("highscoreUpdate", this.onHighscoreUpdate);
        send("unsubscribeHighscore");
    }

    startListen () {
        addEventListener("highscoreUpdate", this.onHighscoreUpdate, this);
        send("subscribeHighscore");
    }
}

export const HighscoreManager = new _HighscoreManager();
