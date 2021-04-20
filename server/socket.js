import { Adapter } from "./socketAdapter/ws.js";

const adapter = new Adapter();

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
