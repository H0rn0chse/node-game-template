const path = require("path");
const { App } = require('@sifrr/server');

const app = new App();
const port = process.env.PORT || 80;
const host =  process.env.PORT ? "0.0.0.0" : "localhost";
const publicPath = path.join(__dirname, "../client");

const messageHandler = new Map();
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
        const handlerList = messageHandler.get(message.channel) || [];
        handlerList.forEach((callback) => {
            callback(ws, message.data);
        });
    }
}

function registerMessageHandler (channel, callback) {
    const handlerList = messageHandler.get(channel);
    if (Array.isArray(handlerList)) {
        handlerList.push(callback);
    } else {
        messageHandler.set(channel, [callback]);
    }
}

function send (topic, channel, data) {
    app.publish(topic, JSON.stringify({
        channel,
        data
    }));
}

function startServer () {
    app.ws("/ws", {
        open: ws => {
            console.log('WebSocket opens');
            ws.send(JSON.stringify({
                channel: "playerId",
                data: {
                    id: idCount++
                }
            }))
        },
        message: handleMessage,
        close: (ws, code, message) => {
            console.log('WebSocket closed');
        }
    })
    .file("/", path.join(publicPath, "index.html"), { lastModified : false })
    .folder("/", publicPath, { lastModified : false })
    .listen(host, port, (token) => {
        if (token) {
            console.log(`Listening to http://${host}:${port}`);
        } else {
            console.log(`Failed to listen to http://${host}:${port}`);
        }
    });
}

module.exports = {
    startServer,
    registerMessageHandler,
    send,
};