// eslint-disable-next-line import/no-cycle
import { registerMessageHandler } from "./socket.js";

class _PlayerManager {
    constructor () {
        this.player = new Map();
        this.count = 0;
    }

    init () {
        registerMessageHandler("userNameUpdate", this.onUserNameUpdate, this);
    }

    onUserNameUpdate (ws, data, playerId) {
        this.setProperty(playerId, "name", data.name);
    }

    addPlayer () {
        this.count += 1;
        const data = {
            id: this.count,
            name: "unknown",
        };
        this.player.set(data.id, data);
        return data.id;
    }

    getProperty (id, key) {
        const data = this.player.get(id);
        return data[key];
    }

    setProperty (id, key, value) {
        const data = this.player.get(id);
        data[key] = value;
    }

    removeProperty (id, key) {
        const data = this.player.get(id);
        delete data[key];
    }

    removePlayer (id) {
        this.player.delete(id);
    }
}

export const PlayerManager = new _PlayerManager();
