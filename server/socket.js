const uws = require("../libs/uWebSockets.js");

const app = uws.App();
const port = process.env.PORT || 3000;
const handler = new Map();
let idCount = 1;

function parseArrayBuffer (data) {
    let oResult = {};
    try {
        const buffer = new Uint8Array(data);
        const string = String.fromCharCode.apply(null, buffer);
        oResult = JSON.parse(string);
    } catch (err) {
        console.log(err);
    }
    return oResult;
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
    app.ws("/*", {
        open: ws => {
            ws.send(JSON.stringify({
                channel: "playerId",
                data: {
                    id: idCount++
                }
            }))
        },
        message: handleMessage,
    })
    .listen(port, () => {
        console.log(`Server running on ws://localhost:${port}`);
    });
}

module.exports = {
    startSocketServer,
    registerMessageHandler,
    send,
};