import { Deferred } from "./Deferred.js";
import { logoff, shouldCloseConnection } from "./logoff.js";
import { Timer } from "./Timer.js";

let ws = null;
const deferred = new Deferred();

const PING_TIMEOUT = 30;
// eslint-disable-next-line no-use-before-define
const timer = new Timer(PING_TIMEOUT, ping);

const handler = new Map();
let playerId = null;
let playerName = "";

function handleMessage (evt) {
    const message = JSON.parse(evt.data);

    if (message.channel) {
        const handlerList = handler.get(message.channel) || new Map();
        handlerList.forEach((scope, callback) => {
            callback.call(scope, message.data);
        });
    }
}

export function ready () {
    return deferred.promise;
}

export function addEventListener (channel, callback, scope) {
    let handlerMap = handler.get(channel);
    if (handlerMap === undefined) {
        handlerMap = new Map();
        handler.set(channel, handlerMap);
    }
    handlerMap.set(callback, scope);
}

export function removeEventListener (channel, callback) {
    const handlerMap = handler.get(channel);
    if (handlerMap !== undefined) {
        handlerMap.delete(callback);
    }
}

export function send (channel, data) {
    if (channel !== "ping") {
        timer.reset();
    }

    ws.send(JSON.stringify({
        channel,
        data,
    }));
}

export function getId () {
    return playerId;
}

export function getName () {
    return playerName;
}

export function setName (name) {
    playerName = name;
}

export function ping (wasReset) {
    if (!shouldCloseConnection()) {
        send("ping", {});
        if (!wasReset) {
            timer.start();
        }
    } else {
        timer.clear();
    }
}

export function openSocket () {
    addEventListener("playerId", (data) => {
        playerId = data.id;
    });
    const host = globalThis.location.origin.replace(/^http/, "ws");
    ws = new WebSocket(`${host}/ws`);
    ws.onmessage = handleMessage;
    ws.onopen = deferred.resolve;
    ws.onclose = logoff;
    ws.onerror = logoff;

    deferred.promise.then(() => {
        timer.start();
    });

    return ready();
}
