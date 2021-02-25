class _PlayerManager {
    constructor () {
        this.player = new Map();
        this.count = 1;
    }

    addPlayer () {
        const data = {
            id: this.count++
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
        data[key] = value
        this.player.set(id, data);
    }

    removeProperty (id, key) {
        const data = this.player.get(id);
        delete data[key];
        this.player.set(id, data);
    }

    removePlayer (id) {
        this.player.delete(id);
    }
}

export const PlayerManager = new _PlayerManager();
