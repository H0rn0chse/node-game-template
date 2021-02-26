import { Deferred } from "./Deferred.js";
import { logoff } from "./logoff.js";

"use strict";

let ws = null;
const deferred = new Deferred();
const handler = new Map();
let playerId = null;

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

export function openSocket () {
    addEventListener("playerId", (data) => {
        playerId = data.id;
    });
    const host = location.origin.replace(/^http/, "ws")
    ws = new WebSocket(`${host}/ws`);
    ws.onmessage = handleMessage;
    ws.onopen = deferred.resolve;
    ws.onclose = logoff;
    ws.onerror = logoff;
    return ready();
}

export function addEventListener (channel, callback, scope) {
    let handlerMap = handler.get(channel);
    if (handlerMap === undefined) {
        handlerMap = new Map()
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
    ws.send(JSON.stringify({
        channel,
        data,
    }));
}

export function getId () {
    return playerId;
}
