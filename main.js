import { startServer } from "./server/socket.js";
import { startLobby } from "./server/lobby.js";
import { startGame } from "./server/game.js";

startServer();
startLobby();
startGame();
