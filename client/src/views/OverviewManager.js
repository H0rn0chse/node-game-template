import { addEventListener, removeEventListener, send, getName, setName } from "../socket.js";
import { OverviewEntry } from "../domElements/OverviewEntry.js";

class _OverviewManager {
    constructor () {
        this.container = document.querySelector("#overview");
        this.listNode = document.querySelector("#overviewList");
        this.name = document.querySelector("#overviewName");

        const createButton = document.querySelector("#createOverview");
        createButton.addEventListener("click", (evt) => {
            this.createLobby();
        });

        this.usernameInput = document.querySelector("#overviewUsername");
        this.usernameInput.addEventListener("change", (evt) => {
            if (this.usernameInput.value) {
                setName(this.usernameInput.value);
                send("usernameUpdate", { name: this.usernameInput.value });
            }
        });

        this.lobbyList = {};

        // initial state
        this.usernameInput.value = getName();
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
        this.listNode.innerHTML = "";
        this.name.value = "";
        this.lobbyList = {};
    }

    joinLobby (lobbyId) {
        send("joinLobby", { id: lobbyId });
    }

    onLobbyAdded (lobby) {
        const lobbyId = lobby.id;

        if (this.lobbyList[lobbyId]) {
            return;
        }

        const entry = new OverviewEntry(lobbyId);
        entry.update(lobby.name);

        this.lobbyList[lobbyId] = entry;
        this.listNode.appendChild(entry.row);
    }

    onLobbyRemoved (lobby) {
        const lobbyId = lobby.id;

        const entry = this.lobbyList[lobbyId];
        if (entry) {
            entry.row.remove();
            delete this.lobbyList[lobbyId];
        }
    }

    onLobbyList (data) {
        if (Array.isArray(data)) {
            data.forEach((entry) => {
                this.onLobbyAdded(entry);
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
