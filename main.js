const { startServer } = require("./server/socket.js");
const { startLobby } = require("./server/lobby.js");
const { startGame } = require("./server/game.js");

startServer();
startLobby();
startGame();
