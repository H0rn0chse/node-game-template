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
    .missingServerName((hostname) => {
        console.log("Hello! We are missing server name <" + hostname + ">");
        app.addServerName("localhost", {});
    })
    .ws("/*", {
        open: ws => {
            console.log('WebSocket opens');
            ws.send(JSON.stringify({
                channel: "playerId",
                data: {
                    id: idCount++
                }
            }))
        },
        upgrade: (res, req, context) => {
            console.log('An Http connection wants to become WebSocket, URL: ' + req.getUrl() + '!');

            /* This immediately calls open handler, you must not use res after this call */
            res.upgrade({
                url: req.getUrl()
              },
              /* Spell these correctly */
              req.getHeader('sec-websocket-key'),
              req.getHeader('sec-websocket-protocol'),
              req.getHeader('sec-websocket-extensions'),
              context);

          },
        message: handleMessage,
        close: (ws, code, message) => {
            console.log('WebSocket closed');
        }
    })
    .get('/*', (res, req) => {
        res.write("<html><body>")
        res.write('<h2>Hello, your headers are:</h2><ul>');

        req.forEach((k, v) => {
            res.write('<li>');
            res.write(k);
            res.write(' = ');
            res.write(v);
            res.write('</li>');
        });

        res.end("</ul></body></html>")

    })
    .any('/*', (res, req) => {
        console.log("unhandled request sent")
        res.end('Nothing to see here!');
    })
    .listen(host, port, (token) => {
        if (token) {
            console.log(`Listening to port ${port}`);
        } else {
            console.log(`Failed to listen to port ${port}`);
        }
    });
}

module.exports = {
    startSocketServer,
    registerMessageHandler,
    send,
};