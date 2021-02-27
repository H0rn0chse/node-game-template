class _PlayerManager {
    constructor () {
        this.player = new Map();
        this.count = 0;
    }

    addPlayer () {
        this.count += 1;
        const data = {
            id: this.count,
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
