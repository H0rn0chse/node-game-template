class _LobbyManager {
    constructor () {
        this.lobbies = new Map();
        this.count = 0;
    }

    createLobby (name) {
        this.count += 1;
        const lobbyData = {
            id: this.count,
            running: false,
            player: {},
            run: {},
            items: {},
            name,
        };

        this.lobbies.set(lobbyData.id, lobbyData);
        return lobbyData;
    }

    getLobbyNames () {
        const result = [];
        this.lobbies.forEach((lobbyData, lobbyId) => {
            if (!lobbyData.running) {
                const data = {
                    id: lobbyId,
                    name: lobbyData.name,
                };
                result.push(data);
            }
        });

        return result;
    }

    getLobbyData (id) {
        return this.lobbies.get(id);
    }

    removeLobby (id) {
        this.lobbies.delete(id);
    }
}

export const LobbyManager = new _LobbyManager();
