import { DatabaseManager } from "./DatabaseManager.js";
import { PlayerManager } from "./PlayerManager.js";
import { publish, registerMessageHandler, send, subscribe, unsubscribe } from "./socket.js";

class _HighscoreManager {
    init () {
        registerMessageHandler("subscribeHighscore", this.onSubscribeHighscore, this);
        registerMessageHandler("unsubscribeHighscore", this.onUnsubscribeHighscore, this);

        this.current = [];

        DatabaseManager.deferred.promise.then(async () => {
            this.current = this.ensureLength(await DatabaseManager.getHighscores());
        });
    }

    getPlacement (score) {
        return this.current.reduce((index, entry, currentIndex) => {
            if (entry.score < score) {
                return currentIndex;
            }
            return index;
        }, -1);
    }

    ensureLength (list) {
        const arr = new Array(10).fill(null);
        return arr.map((value, index) => {
            const entry = list.find((entry) => entry.placement === index + 1);
            if (entry) {
                return {
                    name: entry.name,
                    score: entry.score,
                    date: entry.date,
                };
            }
            return {
                name: "<empty>",
                score: 0,
                date: 0,
            };
        });
    }

    insertAndSort (entries) {
        // ensure all fields are set correctly
        entries.map((entry) => {
            return {
                name: entry.name || "unknown",
                score: entry.score || 0,
                date: entry.date || Date.now(),
            };
        });

        let shouldUpdate = false;
        entries.forEach((entry) => {
            this.current.push(entry);
            this.current.sort((a, b) => b.score - a.score);
            this.current.forEach((entry, index) => {
                entry.placement = index + 1;
            });

            shouldUpdate = shouldUpdate || this.current.indexOf(entry) < 10;
            this.current.splice(9, 1);
        });

        return shouldUpdate;
    }

    onSubscribeHighscore (ws, data, playerId) {
        subscribe(ws, "highscore");
        send(ws, "highscoreUpdate", this.current);
    }

    onUnsubscribeHighscore (ws, data, playerId) {
        unsubscribe(ws, "highscore");
    }

    // ================= not bound to events ==================================================

    onGameScore (data) {
        if (this.insertAndSort(data)) {
            DatabaseManager.updateHighscore(this.current).then(async () => {
                this.current = this.ensureLength(await DatabaseManager.getHighscores());
                publish("highscore", "highscoreUpdate", this.current);
            });
        }
    }
}

export const HighscoreManager = new _HighscoreManager();
