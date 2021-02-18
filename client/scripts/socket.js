import Deferred from "./Deferred.js";

let ws = null;
const deferred = new Deferred();
const handler = new Map();
let playerId = null;

function handleMessage (evt) {
    const message = JSON.parse(evt.data);

    if (message.channel) {
        const handlerList = handler.get(message.channel) || [];
        handlerList.forEach((callback) => {
            callback(message.data);
        });
    }
}

function ready () {
    return deferred.promise;
}

function start () {
    addEventListener("playerId", (data) => {
        playerId = data.id;
    });
    ws = new WebSocket(`ws:${globalThis.location.host}:3000`);
    ws.onmessage = handleMessage;
    ws.onopen = deferred.resolve;
    return ready();
}

function addEventListener (channel, callback) {
    const handlerList = handler.get(channel);
    if (Array.isArray(handlerList)) {
        if (handlerList.indexOf(callback) === -1) {
            handlerList.push(callback);
        }
    } else {
        handler.set(channel, [callback]);
    }
}

function removeEventListener (channel, callback) {
    const handlerList = handler.get(channel);
    if (Array.isArray(handlerList) && handlerList.indexOf(callback) > -1) {
        const index = handlerList.indexOf(callback);
        handlerList.splice(index, 1);
    }
}

function send (channel, data) {
    ws.send(JSON.stringify({
        channel,
        data,
    }));
}

function getId () {
    return playerId;
}

export {
    start,
    ready,
    addEventListener,
    removeEventListener,
    send,
    getId
};
