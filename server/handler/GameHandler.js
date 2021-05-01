import { LobbyManager } from "../LobbyManager.js";
import { PlayerManager } from "../PlayerManager.js";
import { publish, registerMessageHandler, send, unsubscribe } from "../socket.js";
import { SCORE_FIRST, PLAYER_STATUS } from "../../client/src/globals.js";
import { OverviewHandler } from "./OverviewHandler.js";
import { HighscoreManager } from "../HighscoreManager.js";

class _GameHandler {
    init () {
        // leave by intention
        registerMessageHandler("leaveGame", this.onLeaveGame, this);
        // leave by disconnect
        registerMessageHandler("close", this.onLeaveGame, this);
        registerMessageHandler("playerUpdate", this.onPlayerUpdate, this);
        registerMessageHandler("stopGame", this.onStopGame, this);
        /*
            Here comes game logic listener...
        */
        registerMessageHandler("setPhase", this.onSetPhase, this);
        registerMessageHandler("setCountdown", this.onSetCountdown, this);
        registerMessageHandler("resetRun", this.onResetRun, this);
        registerMessageHandler("runEnd", this.onRunEnd, this);
        registerMessageHandler("collectCoin", this.onCollectCoin, this);
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
        PlayerManager.removeProperty(playerId, "lobby");
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

    onStopGame (ws, data, playerId) {
        const lobby = this._getLobbyData(playerId);
        lobby.data.running = false;

        publish(lobby.topic, "joinLobby", lobby.data);
        OverviewHandler.onLobbyAdded(lobby.data);
    }

    /*
        Here comes game logic...
    */

    onSetPhase (ws, data, playerId) {
        const lobby = this._getLobbyData(playerId);

        if (!lobby && !lobby.isHost) {
            return;
        }

        publish(lobby.topic, "setPhase", data);
    }

    onSetCountdown (ws, data, playerId) {
        const lobby = this._getLobbyData(playerId);

        if (!lobby && !lobby.isHost) {
            return;
        }

        publish(lobby.topic, "setCountdown", data);
    }

    onResetRun (ws, data, playerId) {
        const lobby = this._getLobbyData(playerId);

        if (!lobby && !lobby.isHost) {
            return;
        }

        lobby.data.run = {};
        lobby.data.items = {};
        publish(lobby.topic, "resetRun", {});
    }

    onRunEnd (ws, data, playerId) {
        const lobby = this._getLobbyData(playerId);

        if (!lobby || !lobby.data.run) {
            return;
        }

        const count = Object.keys(lobby.data.run).length + 1;

        const alivePlayer = Object.values(lobby.data.run).map((player) => {
            return player.status !== PLAYER_STATUS.Dead;
        }).length;

        if (alivePlayer === 0 && data.status !== PLAYER_STATUS.Dead) {
            data.score += SCORE_FIRST;
            send(ws, "updateScore", { score: data.score });
        }

        lobby.data.run[playerId] = {
            status: data.status,
            score: data.score,
            playerId,
            count,
        };

        if (Object.keys(lobby.data.player).length === count) {
            // Save scores
            const entries = Object.values(lobby.data.run).map((entry) => {
                const playerData = lobby.data.player[entry.playerId];
                return {
                    name: playerData.name,
                    score: entry.score,
                };
            });
            HighscoreManager.onGameScore(entries);

            publish(lobby.topic, "runEnd", lobby.data);
        } else {
            publish(lobby.topic, "runProgress", lobby.data);
        }
    }

    onCollectCoin (ws, data, playerId) {
        const lobby = this._getLobbyData(playerId);
        if (!lobby || !lobby.data.items || !data.coinId) {
            return;
        }

        if (lobby.data.items[data.coinId]) {
            // coin was already collected and should be hidden by now
            return;
        }

        // this is the first plyer to collect the coin
        lobby.data.items[data.coinId] = playerId;
        send(ws, "coinCollected", {});

        publish(lobby.topic, "hideCoin", data);
    }

    // ================= not bound to events ==================================================

    onJoinGame (ws, data, playerId) {
        const lobby = this._getLobbyData(playerId);

        // intialize position
        Object.values(lobby.data.player).forEach((playerData) => {
            playerData.pos = {
                x: 0,
                y: 0,
            };
        });

        publish(lobby.topic, "joinGame", lobby.data);
    }
}

export const GameHandler = new _GameHandler();
