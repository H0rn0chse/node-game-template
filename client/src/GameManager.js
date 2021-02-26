import { getId, send, addEventListener, removeEventListener } from "./socket.js";

class _GameManager {

    constructor () {
        this.currentPos = {
            x: 0,
            y: 0
        };

        this.lobbyName = "";
        this.ingame = false;

        document.addEventListener("keydown", (evt) => {
            if (this.ingame) {
                this.handleKeydown(evt);
            }
        });
    }

    resetGame () {
        const gameArea = document.querySelector("#gameArea");
        const cursorList = gameArea.querySelectorAll(".cursor:not(#cursor)");
        cursorList.forEach((cursor) => {
            cursor.remove();
        });
        this.currentPos = {
            x: 0,
            y: 0
        };
    }

    join (name) {
        this.lobbyName = name;
        this.ingame = true;
        document.querySelector("#game").style.display = "";

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

        const cursor = document.querySelector("#cursor");
        cursor.style.top = `${this.currentPos.y}px`;
        cursor.style.left = `${this.currentPos.x}px`;

        send("gamePosition", { pos: this.currentPos});
    }

    onGamePosition (data) {
        if (data.id !== getId()) {
            let cursor = document.querySelector(`.cursor[data-id="${data.id}"]`);
            if (!cursor) {
                const gameArea = document.querySelector("#gameArea");
                cursor = document.createElement("div");
                cursor.classList.add("cursor");
                cursor.setAttribute("data-id", data.id);
                gameArea.appendChild(cursor);
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