import { OverviewManager } from "../views/OverviewManager.js";

export class OverviewEntry {
    constructor (lobbyId) {
        this.id = lobbyId;

        this._createNode();
    }

    _createNode () {
        this.row = document.createElement("div");
        this.row.classList.add("flexRow", "overviewRow");

        this.name = document.createElement("div");
        this.name.innerText = "-";
        this.row.appendChild(this.name);

        const joinBtn = document.createElement("button");
        joinBtn.innerText = "Join Game";
        joinBtn.addEventListener("click", (evt) => {
            OverviewManager.joinLobby(this.id);
        });
        this.row.appendChild(joinBtn);
    }

    update (name) {
        this.name.innerText = name;
    }
}
