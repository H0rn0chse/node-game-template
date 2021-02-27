import { startServer } from "./server/socket.js";
import { LobbyManager } from "./server/LobbyManager.js";
import { GameManager } from "./server/GameManager.js";
import { DatabaseManager } from "./server/DatabaseManager.js";
import { HighscoreManager } from "./server/HighscoreManager.js";
import { PlayerManager } from "./server/PlayerManager.js";

startServer();
DatabaseManager.connect();
LobbyManager.init();
GameManager.init();
PlayerManager.init();
HighscoreManager.init();
