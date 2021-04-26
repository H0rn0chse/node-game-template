import { LobbyManager } from "../views/LobbyManager.js";

export class LobbyEntry {
    constructor (id, isHost, isYou) {
        this.id = id;
        this.isHost = isHost;
        this.isYou = isYou;

        this._createNodes();
    }

    _createNodes () {
        this.row = document.createElement("div");
        this.row.classList.add("flexRow", "lobbyRow");

        this.name = document.createElement("div");
        this.name.innerText = "-";
        this.row.appendChild(this.name);

        if (this.isHost) {
            const hostText = document.createElement("div");
            hostText.innerText = "Host";
            this.row.appendChild(hostText);
        }

        if (this.isYou) {
            const youText = document.createElement("div");
            youText.innerText = "(You)";
            this.row.appendChild(youText);
        }

        if (LobbyManager.isHost && !this.isYou) {
            const kickBtn = document.createElement("button");
            kickBtn.innerText = "Kick";
            kickBtn.addEventListener("click", (evt) => {
                LobbyManager.kickPlayer(this.id);
            });
            this.row.appendChild(kickBtn);
        }
    }

    update (name) {
        this.name.innerText = name;
    }
}
