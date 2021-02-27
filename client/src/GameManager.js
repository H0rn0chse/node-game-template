// eslint-disable-next-line import/no-cycle
import { LobbyManager } from "./LobbyManager.js";
import { getId, send, addEventListener, removeEventListener } from "./socket.js";
import { Timer } from "./Timer.js";

class _GameManager {
    constructor () {
        this.currentPos = {
            x: 0,
            y: 0,
        };

        this.currentPoints = 0;

        this.lobbyName = "";
        this.ingame = false;

        this.game = document.querySelector("#game");
        this.gameArea = document.querySelector("#gameArea");
        this.cursor = document.querySelector("#cursor");
        this.points = document.querySelector("#gamePoints");

        this.game.style.display = "none";

        document.addEventListener("keydown", (evt) => {
            if (this.ingame) {
                this.handleKeydown(evt);
            }
        });

        const backButton = document.querySelector("#back");
        backButton.addEventListener("click", (evt) => {
            if (this.ingame) {
                this.leave();
                LobbyManager.joinLobby();
            }
        });

        this.pointTimer = new Timer(1, this.setPoints.bind(this));
    }

    resetGame () {
        this.game.style.display = "none";
        const cursorList = this.gameArea.querySelectorAll(".cursor:not(#cursor)");
        cursorList.forEach((cursor) => {
            cursor.remove();
        });
        this.currentPos = {
            x: 0,
            y: 0,
        };
        this.cursor.style.top = `${this.currentPos.y}px`;
        this.cursor.style.left = `${this.currentPos.x}px`;

        this.pointTimer.clear();
        this.currentPoints = 0;
        this.points.innerText = "0";
    }

    join (name) {
        this.lobbyName = name;
        this.ingame = true;
        this.game.style.display = "";

        send("joinGame", { name });

        addEventListener("gamePosition", this.onGamePosition, this);
        addEventListener("gameLeave", this.onGameLeave, this);
        addEventListener("gameInit", this.onGameInit, this);
        send("gamePosition", { pos: this.currentPos });

        this.pointTimer.start();
    }

    leave () {
        send("gamePoints", { points: this.currentPoints });
        this.ingame = false;
        this.resetGame();
        removeEventListener("gamePosition", this.onGamePosition);
        removeEventListener("gameLeave", this.onGameLeave);
        removeEventListener("gameInit", this.onGameInit);
        send("gameLeave", {});
    }

    setPoints () {
        this.currentPoints += 1;
        this.points.innerText = this.currentPoints;
        this.pointTimer.start();
    }

    handleKeydown (evt) {
        const delta = {
            x: 0,
            y: 0,
        };

        if (evt.key === "ArrowLeft") {
            delta.x = -1;
        } else if (evt.key === "ArrowRight") {
            delta.x = 1;
        }

        if (evt.key === "ArrowDown") {
            delta.y = 1;
        } else if (evt.key === "ArrowUp") {
            delta.y = -1;
        }

        const tempX = this.currentPos.x + delta.x * 5;
        const tempY = this.currentPos.y + delta.y * 5;

        // check boundaries
        if (tempX < 0 || tempY < 0 || tempX > (520 - 30) || tempY > (520 - 30)) {
            return;
        }

        this.currentPos.x = tempX;
        this.currentPos.y = tempY;

        this.cursor.style.top = `${this.currentPos.y}px`;
        this.cursor.style.left = `${this.currentPos.x}px`;

        send("gamePosition", { pos: this.currentPos });
    }

    onGamePosition (data) {
        if (data.id !== getId()) {
            let cursor = document.querySelector(`.cursor[data-id="${data.id}"]`);
            if (!cursor) {
                cursor = document.createElement("div");
                cursor.classList.add("cursor");
                cursor.setAttribute("data-id", data.id);

                const name = document.createElement("div");
                name.classList.add("cursorName", "flexColumn");
                const inner = document.createElement("div");
                inner.innerText = data.name;
                name.appendChild(inner);
                cursor.appendChild(name);

                this.gameArea.appendChild(cursor);
            }
            cursor.style.top = `${data.pos.y}px`;
            cursor.style.left = `${data.pos.x}px`;
        }
    }

    onGameLeave (data) {
        const cursor = document.querySelector(`.cursor[data-id="${data.id}"]`);
        if (cursor) {
            cursor.remove();
        }
    }

    onGameInit (lobbyData) {
        lobbyData.forEach((playerData) => {
            this.onGamePosition(playerData);
        });
    }
}

export const GameManager = new _GameManager();
