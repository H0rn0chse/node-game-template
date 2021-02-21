const { startFileServer } = require("./server/files.js");
const { startSocketServer } = require("./server/socket.js");
const { startLobby } = require("./server/lobby.js");
const { startGame } = require("./server/game.js");

startSocketServer();
//startFileServer();
startLobby();
startGame();
