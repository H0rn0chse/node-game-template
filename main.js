import { startServer } from "./server/socket.js";
import { LobbyManager } from "./server/LobbyManager.js";
import { GameManager } from "./server/GameManager.js";

startServer();
LobbyManager.init()
GameManager.init();
