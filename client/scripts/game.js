import { getId, send, addEventListener } from "./socket.js";

const currentPos = {
    x: 0,
    y: 0
};

let lobbyName = "";

function handleKeydown (evt) {
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

    currentPos.x += delta.x * 5;
    currentPos.y += delta.y * 5;

    const cursor = document.querySelector("#cursor");
    cursor.style.top = `${currentPos.y}px`;
    cursor.style.left = `${currentPos.x}px`;

    send("gamePosition", { name: lobbyName, playerId: getId() , pos: currentPos});
}

function handleGamePosition (data) {
    if (data.playerId !== getId()) {
        let cursor = document.querySelector(`.cursor[data-id="${data.playerId}"]`);
        if (!cursor) {
            const gameArea = document.querySelector("#gameArea");
            cursor = document.createElement("div");
            cursor.classList.add("cursor");
            cursor.setAttribute("data-id", data.playerId);
            gameArea.appendChild(cursor);
        }
        cursor.style.top = `${data.pos.y}px`;
        cursor.style.left = `${data.pos.x}px`;
    }
}

function joinGame (name) {
    lobbyName = name;
    send("joinGame", { name: name });
    document.querySelector("#lobby").style.display = "none";
    document.querySelector("#game").style.display = "";

    document.addEventListener("keydown", (evt) => {
        handleKeydown(evt);
    });

    addEventListener("gamePosition", handleGamePosition);
    send("gamePosition", { name: lobbyName, playerId: getId() , pos: currentPos});
}

export { joinGame };
