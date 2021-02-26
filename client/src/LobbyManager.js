import { GameManager } from "./GameManager.js";
import { addEventListener, removeEventListener, send } from "./socket.js";

class _LobbyManager {
    init () {
        document.querySelector("#lobby").style.display = "";
        const createButton = document.querySelector("#createLobby");
        createButton.addEventListener("click", (evt) => {
            this.createLobby();
        });
    }

    createLobby () {
        const input = document.querySelector("#lobbyName");
        if (input && input.value) {
            send("createLobby", { name: input.value });
            this.joinLobby(input.value)
        }
    }

    joinLobby (name) {
        this.stopListen();
        GameManager.join(name)
        document.querySelector("#lobby").style.display = "none";
    }

    resetLobbyList () {
        document.querySelector("#lobbyList").innerHTML = "";
        document.querySelector("#lobbyName").value = "";
    }

    onLobbyAdded (lobby) {
        const lobbyList = document.querySelector("#lobbyList");
        const row = document.createElement("div");
        row.classList.add("flexRow");
        row.setAttribute("data-name", lobby.name);

        const name = document.createElement("div")
        name.innerText = lobby.name;
        row.appendChild(name);

        const button = document.createElement("button")
        button.innerText = "Join Lobby";
        button.onclick = this.joinLobby.bind(this, lobby.name);
        row.appendChild(button);

        lobbyList.appendChild(row);
    }

    onLobbyRemoved (lobby) {
        const lobbyList = document.querySelector("#lobbyList");
        const row = lobbyList.querySelector(`div[data-name=${lobby.name}]`);
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
    }

    startListen () {
        this.resetLobbyList();
        addEventListener("lobbyList", this.onLobbyList, this);
        addEventListener("lobbyAdded", this.onLobbyAdded, this);
        addEventListener("lobbyRemoved", this.onLobbyRemoved, this);
        send("subscribeLobby");
    }
}

export  const LobbyManager = new _LobbyManager();