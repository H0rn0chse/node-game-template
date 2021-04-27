import { AvatarManager } from "../AvatarManager.js";
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

        this.avatar = document.createElement("div");
        this.avatar.classList.add("lobbyAvatar");
        this.row.appendChild(this.avatar);

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

    update (name, avatarId) {
        this.name.innerText = name;

        const avatarNode = AvatarManager.getAvatarImage(avatarId || AvatarManager.getDefault());
        this._setAvatar(avatarNode);
    }

    _setAvatar (domNode) {
        if (!domNode) {
            return;
        }
        this.avatar.innerHTML = "";
        this.avatar.appendChild(domNode);
    }
}
