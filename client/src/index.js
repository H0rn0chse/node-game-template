import "../styles/main.css";

import { openSocket } from "./socket.js";
import { LobbyManager } from "./LobbyManager.js";

openSocket().then(() => {
    LobbyManager.joinLobby();
});

const acknowledgements = document.querySelector("#acknowledgements");
acknowledgements.innerHTML = globalThis.feather.icons.award.toSvg({ color: "#e2b007" });
acknowledgements.addEventListener("click", (evt) => {
    window.open("./acknowledgements/third-party-licenses.html", "_blank");
}, { passive: true });
