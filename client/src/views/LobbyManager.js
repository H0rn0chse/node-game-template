import { LobbyEntry } from "../domElements/LobbyEntry.js";
import { addEventListener, removeEventListener, ready, send, getId, getName, setName } from "../socket.js";
import { ViewManager } from "../ViewManager.js";

class _LobbyManager {
    constructor () {
        this.container = document.querySelector("#lobby");
        this.title = document.querySelector("#lobbyName");
        this.listNode = document.querySelector("#lobbyList");

        this.startBtn = document.querySelector("#lobbyStart");
        this.startBtn.addEventListener("click", (evt) => {
            this.startLobby();
        });

        const leaveBtn = document.querySelector("#lobbyLeave");
        leaveBtn.addEventListener("click", (evt) => {
            this.leaveLobby();
        });

        this.usernameInput = document.querySelector("#lobbyUsername");
        this.usernameInput.addEventListener("change", (evt) => {
            if (this.usernameInput.value) {
                setName(this.usernameInput.value);
                send("userNameUpdate", { name: this.usernameInput.value });
            }
        });

        this.isHost = false;
        this.usernameInput.value = getName();
        this.playerList = {};

        // initial state
        ready().then(() => {
            addEventListener("joinLobby", this.onJoinLobby, this);
        });
    }

    show () {
        this.startListen();
        this.container.style.display = "";
        this.usernameInput.value = getName();
    }

    hide () {
        this.resetLobby();
        this.stopListen();
        this.container.style.display = "none";
    }

    startLobby () {
        send("startLobby", {});
    }

    kickPlayer (playerId) {
        send("kickPlayer", { id: playerId });
    }

    leaveLobby () {
        send("leaveLobby", {});
        ViewManager.showOverview();
    }

    resetLobby () {
        this.title.innerText = "";
        this.playerList = {};
        this.listNode.innerHTML = "";
    }

    onPlayerAdded (playerData, isHost = false) {
        const playerId = playerData.id;

        if (this.playerList[playerId]) {
            return;
        }

        const entry = new LobbyEntry(playerId, isHost, playerId === getId());
        entry.update(playerData.name);

        this.playerList[playerId] = entry;
        this.listNode.appendChild(entry.row);
    }

    onPlayerRemoved (playerData) {
        const playerId = playerData.id;

        if (playerId === getId()) {
            console.log("player got kicked");
            ViewManager.showOverview();
        }

        const entry = this.playerList[playerId];
        if (entry) {
            entry.row.remove();
            delete this.playerList[playerId];
        }
    }

    onPlayerUpdated (playerData) {
        const entry = this.playerList[playerData.id];
        if (entry) {
            entry.update(playerData.name);
        }
    }

    onCloseLobby () {
        ViewManager.showOverview();
    }

    onJoinLobby (data) {
        this.isHost = getId() === data.host;
        this.title.innerText = data.name;
        this.startBtn.disabled = !this.isHost;

        Object.values(data.player).forEach((playerData) => {
            const isHost = playerData.id === data.host;
            this.onPlayerAdded(playerData, isHost);
        });
        ViewManager.showLobby();
    }

    stopListen () {
        addEventListener("joinLobby", this.onJoinLobby, this);

        removeEventListener("playerAdded", this.onPlayerAdded, this);
        removeEventListener("playerRemoved", this.onPlayerRemoved, this);
        removeEventListener("closeLobby", this.onCloseLobby, this);
    }

    startListen () {
        removeEventListener("joinLobby", this.onJoinLobby, this);

        addEventListener("playerUpdated", this.onPlayerUpdated, this);
        addEventListener("playerAdded", this.onPlayerAdded, this);
        addEventListener("playerRemoved", this.onPlayerRemoved, this);
        addEventListener("closeLobby", this.onCloseLobby, this);
    }
}

export const LobbyManager = new _LobbyManager();
globalThis.LobbyManager = LobbyManager;
