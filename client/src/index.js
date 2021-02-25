import "../styles/main.css";

import { start } from "./socket.js";
import { startLobby } from "./lobby.js";

"use strict";

document.querySelector("#lobby").style.display = "";
document.querySelector("#game").style.display = "none";
start().then(() => {
    startLobby();
});