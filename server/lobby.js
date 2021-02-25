import { registerMessageHandler, send } from "./socket.js";

const activeLobbies = [];

function startLobby () {
    registerMessageHandler("subscribeLobby", (ws, data) => {
        ws.send(JSON.stringify({
            channel: "lobbyList",
            data: activeLobbies
        }));
        ws.subscribe("lobby");
    });

    registerMessageHandler("createLobby", (ws, data) => {
        if (data.name && activeLobbies.indexOf(data.name) === -1) {
            activeLobbies.push({ name: data.name });
        }
        send("lobby", "lobbyAdded", { name: data.name });
    });

    registerMessageHandler("joinGame", (ws, data) => {
        ws.unsubscribe("lobby");
    });
}

export {
    startLobby,
};
