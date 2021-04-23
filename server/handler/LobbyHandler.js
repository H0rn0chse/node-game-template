import { registerMessageHandler, send, publish, unsubscribe, subscribe } from "../socket.js";
import { LobbyManager } from "../LobbyManager.js";
import { PlayerManager } from "../PlayerManager.js";
import { OverviewHandler } from "./OverviewHandler.js";
import { GameHandler } from "./GameHandler.js";

class _LobbyHandler {
    init () {
        registerMessageHandler("createLobby", this.onCreateLobby, this);
        registerMessageHandler("joinLobby", this.onJoinLobby, this);
        registerMessageHandler("startLobby", this.onStartLobby, this);
        // leave by intention
        registerMessageHandler("leaveLobby", this.onLeaveLobby, this);
        // leave by disconnect
        registerMessageHandler("close", this.onLeaveLobby, this);

        registerMessageHandler("userNameUpdate", this.onUserNameUpdate, this);
    }

    onCreateLobby (ws, data, playerId) {
        const lobbyName = data.name;
        const lobbyData = LobbyManager.createLobby(lobbyName);

        if (lobbyData) {
            lobbyData.host = playerId;
            OverviewHandler.onLobbyAdded(lobbyData);
        }

        this.onJoinLobby(ws, data, playerId);
    }

    onJoinLobby (ws, data, playerId) {
        const lobbyName = data.name;
        const lobbyData = LobbyManager.getLobbyData(lobbyName);

        if (!lobbyData) {
            return;
        }

        // save player to lobby
        const playerData = {
            id: playerId,
            name: PlayerManager.getProperty(playerId, "name") || "unknown",
        };
        lobbyData.player[playerId] = playerData;

        // save lobby to player
        PlayerManager.setProperty(playerId, "lobby", lobbyName);

        // subscribe and update
        const topic = `lobby-${lobbyName}`;
        publish(topic, "playerAdded", playerData);
        subscribe(ws, topic);
        send(ws, "joinLobby", lobbyData);
    }

    onLeaveLobby (ws, data, playerId) {
        const lobbyName = PlayerManager.getProperty(playerId, "lobby");
        const lobbyData = LobbyManager.getLobbyData(lobbyName);

        // lobby was already destroyed
        if (!lobbyData) {
            return;
        }

        // only handle open lobbies
        if (lobbyData.running) {
            return;
        }

        // remove reference player/ lobby
        PlayerManager.removeProperty("lobby");
        delete lobbyData.player[playerId];

        // unsubscribe from lobby
        const topic = `lobby-${lobbyName}`;
        unsubscribe(ws, topic);

        if (lobbyData.host !== playerId) {
            publish(topic, "playerRemoved", { id: playerId });
        } else {
            publish(topic, "closeLobby", { name: lobbyName });
            LobbyManager.removeLobby(lobbyName);
        }
        OverviewHandler.onLobbyRemove(lobbyData);
    }

    onStartLobby (ws, data, playerId) {
        const lobbyName = PlayerManager.getProperty(playerId, "lobby");
        const lobbyData = LobbyManager.getLobbyData(lobbyName);

        if (lobbyData.host !== playerId) {
            return;
        }
        lobbyData.running = true;
        OverviewHandler.onLobbyRemove(lobbyData);
        GameHandler.onJoinGame(ws, data, playerId);
    }

    onUserNameUpdate (ws, data, playerId) {
        const lobbyName = PlayerManager.getProperty(playerId, "lobby");
        const lobbyData = LobbyManager.getLobbyData(lobbyName);

        // lobby was already destroyed
        if (!lobbyData) {
            return;
        }

        // only handle open lobbies
        if (lobbyData.running) {
            return;
        }

        // update lobbyData
        lobbyData.player[playerId].name = data.name;

        const playerData = {
            id: playerId,
            name: data.name,
        };
        const topic = `lobby-${lobbyName}`;
        publish(topic, "playerUpdated", playerData);
    }
}

export const LobbyHandler = new _LobbyHandler();
