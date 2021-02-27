import { DatabaseManager } from "./DatabaseManager.js";
import { PlayerManager } from "./PlayerManager.js";
import { publish, registerMessageHandler, send } from "./socket.js";

class _HighscoreManager {
    init () {
        registerMessageHandler("subscribeHighscore", this.onSubscribeHighscore, this);
        registerMessageHandler("unsubscribeHighscore", this.onUnsubscribeHighscore, this);
        registerMessageHandler("gamePoints", this.onGamePoints, this);

        this.current = [];

        DatabaseManager.deferred.promise.then(async () => {
            this.current = this.ensureLength(await DatabaseManager.getHighscores());
        });
    }

    getPlacement (points) {
        return this.current.reduce((index, entry, currentIndex) => {
            if (entry.points < points) {
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
                    points: entry.points,
                    date: entry.date,
                };
            }
            return {
                name: "<empty>",
                points: 0,
                date: 0,
            };
        });
    }

    insertAndSort (entry, name) {
        // ensure all fields are set correctly
        entry.name = name || "unknown";
        entry.points = entry.points || 0;
        entry.date = entry.date || Date.now();

        this.current.push(entry);
        this.current.sort((a, b) => b.points - a.points);
        this.current.forEach((entry, index) => {
            entry.placement = index + 1;
        });
        const shouldUpdate = this.current.indexOf(entry) < 10;
        this.current.splice(9, 1);
        return shouldUpdate;
    }

    onSubscribeHighscore (ws, data, playerId) {
        ws.subscribe("highscore");
        send(ws, "highscoreUpdate", this.current);
    }

    onUnsubscribeHighscore (ws, data, playerId) {
        ws.unsubscribe("highscore");
    }

    onGamePoints (ws, data, playerId) {
        const playerName = PlayerManager.getProperty(playerId, "name");
        if (this.insertAndSort(data, playerName)) {
            DatabaseManager.updateHighscore(this.current).then(async () => {
                this.current = this.ensureLength(await DatabaseManager.getHighscores());
                publish("highscore", "highscoreUpdate", this.current);
            });
        }
    }
}

export const HighscoreManager = new _HighscoreManager();
