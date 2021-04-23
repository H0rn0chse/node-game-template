import { startServer } from "./server/socket.js";
import { DatabaseManager } from "./server/DatabaseManager.js";
import { HighscoreManager } from "./server/HighscoreManager.js";
import { PlayerManager } from "./server/PlayerManager.js";
import { OverviewHandler } from "./server/handler/OverviewHandler.js";
import { LobbyHandler } from "./server/handler/LobbyHandler.js";
import { GameHandler } from "./server/handler/GameHandler.js";

startServer();

PlayerManager.init();
DatabaseManager.connect();
HighscoreManager.init();

OverviewHandler.init();
LobbyHandler.init();
GameHandler.init();
