import { addEventListener, removeEventListener, send, ready, getName, setName } from "../socket.js";
import { HighscoreManager } from "../HighscoreManager.js";

class _OverviewManager {
    constructor () {
        this.container = document.querySelector("#overview");
        this.list = document.querySelector("#overviewList");
        this.name = document.querySelector("#overviewName");

        const createButton = document.querySelector("#createOverview");
        createButton.addEventListener("click", (evt) => {
            this.createLobby();
        });

        this.usernameInput = document.querySelector("#overviewUsername");
        this.usernameInput.addEventListener("change", (evt) => {
            if (this.usernameInput.value) {
                setName(this.usernameInput.value);
                send("userNameUpdate", { name: this.usernameInput.value });
            }
        });

        // initial state
        this.usernameInput.value = getName();
        ready().then(() => {
            this.startListen();
            HighscoreManager.startListen();
        });
    }

    show () {
        this.startListen();
        this.container.style.display = "";
        this.usernameInput.value = getName();
    }

    hide () {
        this.resetList();
        this.stopListen();
        this.container.style.display = "none";
    }

    createLobby () {
        if (this.name.value) {
            send("createLobby", { name: this.name.value });
        }
    }

    resetList () {
        this.list.innerHTML = "";
        this.name.value = "";
    }

    onLobbyAdded (lobby) {
        const row = document.createElement("div");
        row.classList.add("flexRow", "overviewRow");
        row.setAttribute("data-name", lobby.name);

        const name = document.createElement("div");
        name.innerText = lobby.name;
        row.appendChild(name);

        const button = document.createElement("button");
        button.innerText = "Join Game";
        button.addEventListener("click", (evt) => {
            send("joinLobby", { name: lobby.name });
        });
        row.appendChild(button);

        this.list.appendChild(row);
    }

    onLobbyRemoved (lobby) {
        const row = this.list.querySelector(`div[data-name=${lobby.name}]`);
        if (row) {
            row.remove();
        }
    }

    onLobbyList (data) {
        if (Array.isArray(data)) {
            data.forEach((entry) => {
                this.onLobbyAdded({ name: entry });
            });
        }
        removeEventListener("lobbyList", this.onLobbyList);
    }

    stopListen () {
        removeEventListener("lobbyAdded", this.onLobbyAdded, this);
        removeEventListener("lobbyRemoved", this.onLobbyRemoved, this);
        send("unsubscribeOverview");
    }

    startListen () {
        addEventListener("lobbyList", this.onLobbyList, this);
        addEventListener("lobbyAdded", this.onLobbyAdded, this);
        addEventListener("lobbyRemoved", this.onLobbyRemoved, this);
        send("subscribeOverview");
    }
}

export const OverviewManager = new _OverviewManager();
globalThis.OverviewManager = OverviewManager;
