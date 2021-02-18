const uws = require("../libs/uWebSockets.js");

const app = uws.App();
const handler = new Map();
let idCount = 1;

function parseArrayBuffer (data) {
    const buffer = new Uint8Array(data);
    const string = String.fromCharCode.apply(null, buffer);
    return JSON.parse(string);
}

function handleMessage (ws, ab) {
    const message = parseArrayBuffer(ab);

    if (message.channel) {
        const handlerList = handler.get(message.channel) || [];
        handlerList.forEach((callback) => {
            callback(ws, message.data);
        });
    }
}

function registerMessageHandler (channel, callback) {
    const handlerList = handler.get(channel);
    if (Array.isArray(handlerList)) {
        handlerList.push(callback);
    } else {
        handler.set(channel, [callback]);
    }
}

function send (topic, channel, data) {
    app.publish(topic, JSON.stringify({
        channel,
        data
    }));
}

function startSocketServer () {
    app.ws("/", {
        open: ws => {
            ws.send(JSON.stringify({
                channel: "playerId",
                data: {
                    id: idCount++
                }
            }))
        },
        message: handleMessage,
    }).listen(3000, () => {});
}

module.exports = {
    startSocketServer,
    registerMessageHandler,
    send,
};