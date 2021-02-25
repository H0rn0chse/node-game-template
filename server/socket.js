import path from "path";
import { App } from "@sifrr/server";
import { __root } from "./globals.js";
import { PlayerManager } from "./PlayerManager.js";

const app = new App();
const port = parseInt(process.env.PORT, 10) || 80;
const host =  process.env.PORT ? "0.0.0.0" : "localhost";

const local = !!process.env.npm_config_debug;
const publicPath = path.join(__root, "/client");
const indexHtml = path.join(publicPath, !local ? "dist/index.html" : "index-local.html");

const messageHandler = new Map();

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
    let message = ab;
    if (ab instanceof ArrayBuffer) {
        message = parseArrayBuffer(ab);
    }

    if (message.channel) {
        const handlerList = messageHandler.get(message.channel) || [];
        handlerList.forEach((callback) => {
            callback(ws, message.data, ws.id);
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

function publish (topic, channel, data) {
    app.publish(topic, JSON.stringify({
        channel,
        data
    }));
}

function send (ws, channel, data) {
    ws.send(JSON.stringify({
        channel,
        data
    }));
}

function startServer () {
    app.ws("/ws", {
        open: ws => {
            console.log("WebSocket opens");
            ws.id = PlayerManager.addPlayer();
            send(ws, "playerId", {
                id: ws.id
            });
        },
        message: handleMessage,
        close: (ws, code, message) => {
            handleMessage(ws, {
                channel: "close",
                data: {}
            });
            PlayerManager.removePlayer(ws.id);
            console.log("WebSocket closed");
        }
    })
    .file("/", indexHtml, { lastModified : false })
    .folder("/", publicPath, { lastModified : false })
    .get("/*", (res, req) => {
        res.writeStatus("404 Not Found").end("");
    })
    .listen(host, port, (token) => {
        if (token) {
            console.log(`Listening to http://${host}:${port}`);
        } else {
            console.log(`Failed to listen to http://${host}:${port}`);
        }
    });
}

export {
    startServer,
    registerMessageHandler,
    publish,
    send
};