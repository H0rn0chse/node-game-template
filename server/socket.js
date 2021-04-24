import path from "path";
import { __root } from "./globals.js";

import { Adapter } from "./socketAdapter/ws.js";

const port = parseInt(process.env.PORT, 10) || 8080;
const host = process.env.PORT ? "0.0.0.0" : "localhost";
const local = !!process.env.npm_config_debug;

const publicPath = path.join(__root, "/client");
const indexHtml = !local ? "/dist/index.html" : "index-local.html";

const adapter = new Adapter(port, host, local, publicPath, indexHtml);

export function registerMessageHandler (channel, callback, scope) {
    return adapter.registerMessageHandler(channel, callback, scope);
}

export function publish (topic, channel, data) {
    return adapter.publish(topic, channel, data);
}

export function send (ws, channel, data) {
    return adapter.send(ws, channel, data);
}

export function subscribe (ws, topic) {
    return adapter.subscribe(ws, topic);
}

export function unsubscribe (ws, topic) {
    return adapter.unsubscribe(ws, topic);
}

export function startServer () {
    return adapter.startServer();
}
