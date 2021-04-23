import { registerMessageHandler, send, publish, unsubscribe, subscribe } from "../socket.js";
import { LobbyManager } from "../LobbyManager.js";

class _OverviewHandler {
    init () {
        registerMessageHandler("subscribeOverview", this.onSubscribeOverview, this);
        registerMessageHandler("unsubscribeOverview", this.onUnsubscribeOverview, this);
    }

    onSubscribeOverview (ws, data, playerId) {
        send(ws, "lobbyList", LobbyManager.getLobbyNames());
        subscribe(ws, "overview");
    }

    onUnsubscribeOverview (ws, data, playerId) {
        unsubscribe(ws, "overview");
    }

    // ================= not bound to events ==================================================

    onLobbyAdded (lobbyData) {
        publish("overview", "lobbyAdded", lobbyData);
    }

    onLobbyRemove (lobbyData) {
        publish("overview", "lobbyRemoved", lobbyData);
    }
}

export const OverviewHandler = new _OverviewHandler();
