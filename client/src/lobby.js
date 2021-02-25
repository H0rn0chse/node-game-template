import { joinGame } from "./game.js";
import { addEventListener, removeEventListener, send } from "./socket.js";

"use strict";

function joinLobby (name) {
    stopLobby();
    joinGame(name)
}

function addLobby (lobby) {
    const lobbyList = document.querySelector("#lobbyList");
    const row = document.createElement("div");
    row.classList.add("flexRow");
    row.setAttribute("data-name", lobby.name);

    const name = document.createElement("div")
    name.innerText = lobby.name;
    row.appendChild(name);

    const button = document.createElement("button")
    button.innerText = "Join Lobby";
    button.onclick = joinLobby.bind(null, lobby.name);
    row.appendChild(button);

    lobbyList.appendChild(row);
}

function removeLobby (lobby) {
    const lobbyList = document.querySelector("#lobbyList");
    const row = lobbyList.querySelector(`div[data-name=${lobby.name}]`);
    if (row) {
        row.remove();
    }
}

function handleInitialLobby (data) {
    if (Array.isArray(data)) {

        data.forEach((entry) => {
            addLobby(entry);
        });
    }
    removeEventListener("lobbyList", handleInitialLobby);
}

function createLobby () {
    const input = document.querySelector("#lobbyName");
    if (input && input.value) {
        send("createLobby", { name: input.value });
        joinLobby(input.value);
    }
}

function stopLobby () {
    removeEventListener("lobbyAdded", addLobby);
    removeEventListener("lobbyRemoved", removeLobby);
}

function startLobby () {
    const createButton = document.querySelector("#createLobby");
    createButton.addEventListener("click", (evt) => {
        createLobby();
    });
    addEventListener("lobbyList", handleInitialLobby);
    addEventListener("lobbyAdded", addLobby);
    addEventListener("lobbyRemoved", removeLobby);
    send("subscribeLobby");
}

export { startLobby, stopLobby };
