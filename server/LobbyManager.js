import { registerMessageHandler, send, publish } from "./socket.js";

class _LobbyManager {
    constructor () {
        this.lobbies = new Map();
    }

    init () {
        registerMessageHandler("subscribeLobby", this.onSubscribeLobby.bind(this));

        registerMessageHandler("createLobby", this.onCreateLobby.bind(this));

        registerMessageHandler("joinGame", this.onJoinGame.bind(this));
    }

    onSubscribeLobby (ws, data, playerId) {
        send(ws, "lobbyList", Array.from(this.lobbies.keys()));
        ws.subscribe("lobby");
    }

    onCreateLobby (ws, data, playerId) {
        const name = data.name
        if (!this.lobbies.has(name)) {
            const data = {
                name: name
            };

            this.lobbies.set(name, data);
            publish("lobby", "lobbyAdded", data);
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
            name: name
        });
    }
}

export const LobbyManager = new _LobbyManager();
