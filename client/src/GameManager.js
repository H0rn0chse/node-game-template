import { LobbyManager } from "./LobbyManager.js";
import { getId, send, addEventListener, removeEventListener } from "./socket.js";

class _GameManager {
    constructor () {
        this.currentPos = {
            x: 0,
            y: 0
        };

        this.lobbyName = "";
        this.ingame = false;

        this.game = document.querySelector("#game");
        this.gameArea = document.querySelector("#gameArea");
        this.cursor = document.querySelector("#cursor");

        this.game.style.display = "none";

        document.addEventListener("keydown", (evt) => {
            if (this.ingame) {
                this.handleKeydown(evt);
            }
        });

        const backButton = document.querySelector("#back")
        backButton.addEventListener("click", (evt) => {
            if (this.ingame) {
                this.leave();
                LobbyManager.joinLobby();
            }
        });
    }

    resetGame () {
        this.game.style.display = "none";
        const cursorList = this.gameArea.querySelectorAll(".cursor:not(#cursor)");
        cursorList.forEach((cursor) => {
            cursor.remove();
        });
        this.currentPos = {
            x: 0,
            y: 0
        };
        this.cursor.style.top = `${this.currentPos.y}px`;
        this.cursor.style.left = `${this.currentPos.x}px`;
    }

    join (name) {
        this.lobbyName = name;
        this.ingame = true;
        this.game.style.display = "";

        send("joinGame", { name: name });

        addEventListener("gamePosition", this.onGamePosition, this);
        addEventListener("gameLeave", this.onGameLeave, this);
        addEventListener("gameInit", this.onGameInit, this);
        send("gamePosition", { pos: this.currentPos });
    }

    leave () {
        this.ingame = false;
        this.resetGame();
        removeEventListener("gamePosition", this.onGamePosition);
        removeEventListener("gameLeave", this.onGameLeave);
        removeEventListener("gameInit", this.onGameInit);
        send("gameLeave", {});
    }

    handleKeydown (evt) {
        const delta = {
            x: 0,
            y: 0
        };

        if (evt.key === "ArrowLeft") {
            delta.x = -1
        } else if (evt.key === "ArrowRight") {
            delta.x = 1
        }

        if (evt.key === "ArrowDown") {
            delta.y = 1
        } else if (evt.key === "ArrowUp") {
            delta.y = -1
        }

        this.currentPos.x += delta.x * 5;
        this.currentPos.y += delta.y * 5;

        this.cursor.style.top = `${this.currentPos.y}px`;
        this.cursor.style.left = `${this.currentPos.x}px`;

        send("gamePosition", { pos: this.currentPos});
    }

    onGamePosition (data) {
        if (data.id !== getId()) {
            let cursor = document.querySelector(`.cursor[data-id="${data.id}"]`);
            if (!cursor) {
                cursor = document.createElement("div");
                cursor.classList.add("cursor");
                cursor.setAttribute("data-id", data.id);
                this.gameArea.appendChild(cursor);
            }
            cursor.style.top = `${data.pos.y}px`;
            cursor.style.left = `${data.pos.x}px`;
        }
    }

    onGameLeave (data) {
        let cursor = document.querySelector(`.cursor[data-id="${data.id}"]`);
        if (cursor) {
            cursor.remove();
        }
    }

    onGameInit (lobbyData) {
        lobbyData.forEach(playerData => {
            this.onGamePosition(playerData);
        });
    }
}

export  const GameManager = new _GameManager();