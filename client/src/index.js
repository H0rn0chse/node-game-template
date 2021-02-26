import "../styles/main.css";

import { openSocket } from "./socket.js";
import { LobbyManager } from "./LobbyManager.js";

"use strict";

document.querySelector("#game").style.display = "none";
openSocket().then(() => {
    LobbyManager.init();
    LobbyManager.startListen();
});