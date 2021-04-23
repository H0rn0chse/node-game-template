class _LobbyManager {
    constructor () {
        this.lobbies = new Map();
    }

    createLobby (name) {
        if (this.lobbies.has(name)) {
            return;
        }
        const lobbyData = {
            name,
            running: false,
            player: {},
        };

        this.lobbies.set(name, lobbyData);
        return lobbyData;
    }

    getLobbyNames () {
        const result = [];
        this.lobbies.forEach((lobbyData, lobbyName) => {
            if (!lobbyData.running) {
                result.push(lobbyName);
            }
        });

        return result;
    }

    getLobbyData (name) {
        return this.lobbies.get(name);
    }

    removeLobby (name) {
        this.lobbies.delete(name);
    }
}

export const LobbyManager = new _LobbyManager();
