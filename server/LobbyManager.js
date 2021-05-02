import { MAXIMUM_LOBBY_SIZE } from "./globals.js";

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
            maxSize: MAXIMUM_LOBBY_SIZE,
            player: {},
            run: {},
            items: {},
            levelId: 0,
            name,
        };

        this.lobbies.set(lobbyData.id, lobbyData);
        return lobbyData;
    }

    getLobbyNames () {
        const result = [];
        this.lobbies.forEach((lobbyData, lobbyId) => {
            const lobbySize = Object.keys(lobbyData.player).length;
            const isFull = lobbyData.maxSize && lobbyData.maxSize <= lobbySize;

            if (!lobbyData.running && !isFull) {
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
