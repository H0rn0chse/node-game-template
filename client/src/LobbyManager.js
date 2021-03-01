// eslint-disable-next-line import/no-cycle
import { GameManager } from "./GameManager.js";
import { HighscoreManager } from "./HighscoreManager.js";
import { addEventListener, removeEventListener, send } from "./socket.js";

class _LobbyManager {
    constructor () {
        this.lobby = document.querySelector("#lobby");
        this.lobbyList = document.querySelector("#lobbyList");
        this.lobbyName = document.querySelector("#lobbyName");

        const createButton = document.querySelector("#createLobby");
        createButton.addEventListener("click", (evt) => {
            this.createLobby();
        });
    }

    createLobby () {
        if (this.lobbyName.value) {
            send("createLobby", { name: this.lobbyName.value });
            this.joinGame(this.lobbyName.value);
        }
    }

    joinGame (name) {
        this.stopListen();
        GameManager.join(name);

        this.lobby.style.display = "none";
    }

    joinLobby () {
        this.startListen();
        this.lobby.style.display = "";
    }

    resetLobbyList () {
        this.lobbyList.innerHTML = "";
        this.lobbyName.value = "";
    }

    onLobbyAdded (lobby) {
        const row = document.createElement("div");
        row.classList.add("flexRow", "lobbyRow");
        row.setAttribute("data-name", lobby.name);

        const name = document.createElement("div");
        name.innerText = lobby.name;
        row.appendChild(name);

        const button = document.createElement("button");
        button.innerText = "Join Game";
        button.onclick = this.joinGame.bind(this, lobby.name);
        row.appendChild(button);

        this.lobbyList.appendChild(row);
    }

    onLobbyRemoved (lobby) {
        const row = this.lobbyList.querySelector(`div[data-name=${lobby.name}]`);
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
        HighscoreManager.stopListen();
        removeEventListener("lobbyAdded", this.onLobbyAdded, this);
        removeEventListener("lobbyRemoved", this.onLobbyRemoved, this);
    }

    startListen () {
        HighscoreManager.startListen();
        this.resetLobbyList();
        addEventListener("lobbyList", this.onLobbyList, this);
        addEventListener("lobbyAdded", this.onLobbyAdded, this);
        addEventListener("lobbyRemoved", this.onLobbyRemoved, this);
        send("subscribeLobby");
    }
}

export const LobbyManager = new _LobbyManager();
