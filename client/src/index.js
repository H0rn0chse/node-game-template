import "../styles/main.css";

import { openSocket } from "./socket.js";
import { ViewManager } from "./ViewManager.js";

openSocket().then(() => {
    ViewManager.showOverview();
});

const acknowledgements = document.querySelector("#acknowledgements");
acknowledgements.innerHTML = globalThis.feather.icons.award.toSvg({ color: "#e2b007" });
acknowledgements.addEventListener("click", (evt) => {
    window.open("./acknowledgements/third-party-licenses.html", "_blank");
}, { passive: true });
