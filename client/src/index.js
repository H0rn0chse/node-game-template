import "../styles/main.css";

import { openSocket } from "./socket.js";
import { LobbyManager } from "./LobbyManager.js";

openSocket().then(() => {
    LobbyManager.joinLobby();
});
