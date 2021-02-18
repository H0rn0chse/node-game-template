const { registerMessageHandler, send } = require("./socket.js");

function startGame () {
    registerMessageHandler("joinGame", (ws, data) => {
        console.log(data.name)
        ws.subscribe(data.name);
    });

    registerMessageHandler("gamePosition", (ws, data) => {
        send(data.name, "gamePosition", data);
    });
}

module.exports = {
    startGame,
};