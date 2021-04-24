import { PlayerManager } from "../PlayerManager.js";

export class AdapterBase {
    constructor (port, host, local, publicPath) {
        this.port = port;
        this.host = host;

        this.local = local;
        this.publicPath = publicPath;

        this.idleTimeout = 55;

        this.messageHandler = new Map();
    }

    registerMessageHandler (channel, callback, scope) {
        let handlerMap = this.messageHandler.get(channel);
        if (handlerMap === undefined) {
            handlerMap = new Map();
            this.messageHandler.set(channel, handlerMap);
        }
        handlerMap.set(callback, scope);
    }

    handleOpen (ws) {
        globalThis.console.log("WebSocket opens");
        ws.id = PlayerManager.addPlayer();
        this.send(ws, "playerId", {
            id: ws.id,
        });
        return ws.id;
    }

    handleClose (ws) {
        this.handleMessage(ws, {
            channel: "close",
            data: {},
        });
        PlayerManager.removePlayer(ws.id);
        globalThis.console.log("WebSocket closed");
    }

    handleMessage (ws, data) {
        const message = this.parseMessage(data);

        if (message.channel) {
            const handlerMap = this.messageHandler.get(message.channel) || new Map();

            try {
                handlerMap.forEach((scope, callback) => {
                    callback.call(scope, ws, message.data, ws.id);
                });
            } catch (err) {
                globalThis.console.error(err);
            }
        }
    }

    parseMessage (data) {
        // need to be implemented by adapter
    }

    send (ws, channel, data) {
        // need to be implemented by adapter
    }

    publish (topic, channel, data) {
        // need to be implemented by adapter
    }

    subscribe (ws, topic) {
        // need to be implemented by adapter
    }

    unsubscribe (ws, topic) {
        // need to be implemented by adapter
    }

    startServer () {
        // need to be implemented by adapter
    }
}
