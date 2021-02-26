import "../styles/main.css";

import { openSocket } from "./socket.js";
import { LobbyManager } from "./LobbyManager.js";

"use strict";

openSocket().then(() => {
    LobbyManager.joinLobby();
});