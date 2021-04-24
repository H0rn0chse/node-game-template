import path from "path";
import { App } from "@sifrr/server";

import { AdapterBase } from "./AdapterBase.js";

export class Adapter extends AdapterBase {
    constructor (port, host, local, publicPath, indexHtml) {
        super(port, host, local, publicPath);

        this.app = new App();
        this.indexHtml = path.join(this.publicPath, indexHtml);
    }

    parseMessage (data) {
        if (!(data instanceof ArrayBuffer)) {
            return data;
        }
        let oResult = {};
        try {
            const buffer = new Uint8Array(data);
            const string = String.fromCharCode.apply(null, buffer);
            oResult = JSON.parse(string);
        } catch (err) {
            globalThis.console.log(err);
        }
        return oResult;
    }

    send (ws, channel, data) {
        ws.send(JSON.stringify({
            channel,
            data,
        }));
    }

    publish (topic, channel, data) {
        this.app.publish(topic, JSON.stringify({
            channel,
            data,
        }));
    }

    subscribe (ws, topic) {
        try {
            ws.subscribe(topic);
        } catch (err) {
            globalThis.console.error(`subscribe failed: ${topic}`);
        }
    }

    unsubscribe (ws, topic) {
        try {
            ws.unsubscribe(topic);
        } catch (err) {
            globalThis.console.error(`unsubscribe failed: ${topic}`);
        }
    }

    startServer () {
        try {
            this.app.ws("/ws", {
                idleTimeout: this.idleTimeout,
                open: this.handleOpen.bind(this),

                message: this.handleMessage.bind(this),

                close: this.handleClose.bind(this),
            })
                .file("/", this.indexHtml, { lastModified: false, watch: this.local })
                .folder("/", this.publicPath, { lastModified: false, watch: this.local })
                .get("/*", (res, req) => {
                    res.writeStatus("404 Not Found").end("");
                })
                .listen(this.host, this.port, (token) => {
                    if (token) {
                        globalThis.console.log(`Listening to http://${this.host}:${this.port}`);
                    } else {
                        globalThis.console.log(`Failed to listen to http://${this.host}:${this.port}`);
                    }
                });
        } catch (err) {
            globalThis.console.error(err);
        }
    }
}
