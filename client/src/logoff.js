import { ping } from "./socket.js";
import { Timer } from "./Timer.js";

const LOGOFF_TIMEOUT = 60 * 5; // keep websockets atleast 5 mins alive
let shouldLogoff = false;
let logoffDone = false;
// eslint-disable-next-line no-use-before-define
const timer = new Timer(LOGOFF_TIMEOUT, doTimeout);
const eventList = ["mousemove", "click", "keydown"];

eventList.forEach((event) => {
    document.body.addEventListener(event, (evt) => {
        if (logoffDone) {
            return;
        }
        if (shouldLogoff) {
            shouldLogoff = false;
            ping();
            timer.start();
        } else {
            timer.reset();
        }
    });
});
timer.start();

function doTimeout (wasReset) {
    if (wasReset) {
        return;
    }
    timer.clear();
    shouldLogoff = true;
}

export function logoff () {
    logoffDone = true;
    const element = document.querySelector("#logoff");
    element.style.display = "flex";
}

export function shouldCloseConnection () {
    return shouldLogoff;
}
