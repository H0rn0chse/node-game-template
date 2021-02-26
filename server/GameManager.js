import { LobbyManager } from "./LobbyManager.js";
import { PlayerManager } from "./PlayerManager.js";
import { publish, registerMessageHandler, send } from "./socket.js";

class _GameManager {
    init () {
        registerMessageHandler("joinGame", this.onJoinGame, this);
        registerMessageHandler("gamePosition", this.onGamePosition, this);
        registerMessageHandler("close", this.onClose, this);
    }

    onGamePosition (ws, data, playerId) {
        const lobbyName = PlayerManager.getProperty(playerId, "game");
        const lobbyData = LobbyManager.getLobbyData(lobbyName);
        lobbyData.player[playerId].pos = data.pos;
        data.id = ws.id;
        publish(lobbyName, "gamePosition", data);
    }

    onJoinGame (ws, data, playerId) {
        const lobbyName = data.name;
        ws.subscribe(lobbyName);
        PlayerManager.setProperty(playerId, "game", lobbyName)
        const lobbyData = LobbyManager.getLobbyData(lobbyName);

        if (lobbyData.player === undefined) {
            lobbyData.player = {};
        }
        lobbyData.player[playerId] = {
            id: playerId,
            pos: {
                x:0,
                y:0
            }
        };

        send(ws, "gameInit", Object.values(lobbyData.player));
    }

    onClose (ws, data, playerId) {
        const lobbyName = PlayerManager.getProperty(playerId, "game");
        if (lobbyName) {
            const lobbyData = LobbyManager.getLobbyData(lobbyName);
            delete lobbyData.player[playerId];
            if (Object.keys(lobbyData.player).length === 0) {
                LobbyManager.removeLobby(lobbyName);
            }
            publish(lobbyName, "gameLeave", { id: playerId });
        }
    }
}

export const GameManager = new _GameManager();
