import { LobbyManager } from "../LobbyManager.js";
import { PlayerManager } from "../PlayerManager.js";
import { publish, registerMessageHandler, send, unsubscribe } from "../socket.js";

class _GameHandler {
    init () {
        registerMessageHandler("close", this.onLeaveGame, this);
        registerMessageHandler("playerUpdate", this.onPlayerUpdate, this);
        /*
            Here comes game logic listener...
        */
    }

    _getLobbyData (playerId) {
        const name = PlayerManager.getProperty(playerId, "lobby");
        const data = LobbyManager.getLobbyData(name);

        // lobby was already closed
        if (!data) {
            return;
        }

        // only handle running lobbies
        if (!data?.running) {
            return;
        }
        return {
            name,
            data,
            topic: `lobby-${name}`,
            isHost: data.host === playerId,
        };
    }

    onLeaveGame (ws, data, playerId) {
        const lobby = this._getLobbyData(playerId);

        if (!lobby) {
            return;
        }

        // remove reference player/ lobby
        PlayerManager.removeProperty("lobby");
        delete lobby.data.player[playerId];

        // unsubscribe from lobby
        unsubscribe(ws, lobby.topic);

        if (!lobby.isHost) {
            publish(lobby.topic, "playerRemoved", { id: playerId });
        } else {
            publish(lobby.topic, "closeGame", { name: lobby.name });
            LobbyManager.removeLobby(lobby.name);
        }
    }

    onPlayerUpdate (ws, data, playerId) {
        const lobby = this._getLobbyData(playerId);

        if (!lobby) {
            return;
        }

        const playerData = lobby.data.player[playerId];
        playerData.pos = data.pos;

        publish(lobby.topic, "playerUpdate", playerData);
    }

    /*
        Here comes game logic...
    */

    // ================= not bound to events ==================================================

    onJoinGame (ws, data, playerId) {
        const lobbyName = PlayerManager.getProperty(playerId, "lobby");
        const lobbyData = LobbyManager.getLobbyData(lobbyName);

        // intialize position
        Object.values(lobbyData.player).forEach((playerData) => {
            playerData.pos = {
                x: 0,
                y: 0,
            };
        });

        const topic = `lobby-${lobbyName}`;
        publish(topic, "joinGame", lobbyData);
    }
}

export const GameHandler = new _GameHandler();
