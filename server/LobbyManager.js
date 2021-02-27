import { registerMessageHandler, send, publish } from "./socket.js";

class _LobbyManager {
    constructor () {
        this.lobbies = new Map();
    }

    init () {
        registerMessageHandler("subscribeLobby", this.onSubscribeLobby, this);
        registerMessageHandler("createLobby", this.onCreateLobby, this);
        registerMessageHandler("joinGame", this.onJoinGame, this);
    }

    onSubscribeLobby (ws, data, playerId) {
        send(ws, "lobbyList", Array.from(this.lobbies.keys()));
        ws.subscribe("lobby");
    }

    onCreateLobby (ws, data, playerId) {
        const { name } = data;
        if (!this.lobbies.has(name)) {
            const lobbyData = {
                name,
            };

            this.lobbies.set(name, lobbyData);
            publish("lobby", "lobbyAdded", lobbyData);
        }
    }

    onJoinGame (ws, data, playerId) {
        ws.unsubscribe("lobby");
    }

    getLobbyData (name) {
        return this.lobbies.get(name);
    }

    removeLobby (name) {
        this.lobbies.delete(name);
        publish("lobby", "lobbyRemoved", {
            name,
        });
    }
}

export const LobbyManager = new _LobbyManager();
