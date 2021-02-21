const uws = require("../libs/uWebSockets.js");

const app = uws.App();
const port = process.env.PORT || 3000;
const host =  process.env.PORT ? "0.0.0.0" : "localhost";
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
    app
    .ws("/ws", {
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
    /*.get("/*", (res, req) => {
        res.write("<html><body>")
        res.write("<h2>Hello, your headers are:</h2><ul>");

        req.forEach((k, v) => {
            res.write("<li>");
            res.write(k);
            res.write(" = ");
            res.write(v);
            res.write("</li>");
        });

        res.end("</ul></body></html>")

    })*/
    .listen(host, port, (token) => {
        if (token) {
            console.log(`Listening to ${host}:${port}`);
        } else {
            console.log(`Failed to listen to ${host}:${port}`);
        }
    });
}

module.exports = {
    startSocketServer,
    registerMessageHandler,
    send,
};