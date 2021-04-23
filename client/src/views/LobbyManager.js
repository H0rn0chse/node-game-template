import { addEventListener, removeEventListener, ready, send, getId, getName, setName } from "../socket.js";
import { ViewManager } from "../ViewManager.js";

class _LobbyManager {
    constructor () {
        this.container = document.querySelector("#lobby");
        this.title = document.querySelector("#lobbyName");
        this.list = document.querySelector("#lobbyList");

        this.startButton = document.querySelector("#lobbyStart");
        this.startButton.addEventListener("click", (evt) => {
            this.startLobby();
        });

        this.usernameInput = document.querySelector("#lobbyUsername");
        this.usernameInput.addEventListener("change", (evt) => {
            if (this.usernameInput.value) {
                setName(this.usernameInput.value);
                send("userNameUpdate", { name: this.usernameInput.value });
            }
        });

        // initial state
        this.usernameInput.value = getName();
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

    resetLobby () {
        this.title.innerText = "";
        this.list.innerHTML = "";
    }

    onPlayerAdded (playerData, isHost = false) {
        const row = document.createElement("div");
        row.classList.add("flexRow", "lobbyRow");
        row.setAttribute("data-id", playerData.id);

        const name = document.createElement("div");
        name.innerText = playerData.name;
        row.appendChild(name);

        if (isHost) {
            const hostText = document.createElement("div");
            hostText.innerText = "Host";
            row.appendChild(hostText);
        }

        if (playerData.id === getId()) {
            const youText = document.createElement("div");
            youText.innerText = "(You)";
            row.appendChild(youText);
        }

        this.list.appendChild(row);
    }

    onPlayerRemoved (playerData) {
        const row = this.list.querySelector(`div[data-id="${playerData.id}"]`);
        if (row) {
            row.remove();
        }
    }

    onPlayerUpdated (playerData) {
        const rowText = this.list.querySelector(`div[data-id="${playerData.id}"] > div`);
        if (rowText) {
            rowText.innerText = playerData.name;
        }
    }

    onCloseLobby () {
        ViewManager.showOverview();
    }

    onJoinLobby (data) {
        this.title.innerText = data.name;
        if (getId() !== data.host) {
            this.startButton.disabled = true;
        }
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
