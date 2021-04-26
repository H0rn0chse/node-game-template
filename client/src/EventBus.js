class EventBus {
    constructor (description = "") {
        this.description = description;

        this.eventHandler = new Map();
    }

    on (eventName, callback, scope) {
        if (!this.has(eventName, callback, scope)) {
            const key = {
                eventName,
                callback,
                scope,
            };

            const value = {
                once: false,
                eventName,
            };

            this.eventHandler.set(key, value);
        }
    }

    once (eventName, callback, scope) {
        if (!this.has(eventName, callback, scope)) {
            const key = {
                eventName,
                callback,
                scope,
            };

            const value = {
                once: true,
                eventName,
            };

            this.eventHandler.set(key, value);
        }
    }

    has (eventName, callback, scope) {
        const key = {
            eventName,
            callback,
            scope,
        };
        const value = this.eventHandler.get(key);
        return !!value;
    }

    off (eventName, callback, scope) {
        const key = {
            eventName,
            callback,
            scope,
        };
        this.eventHandler.delete(key);
    }

    emit (eventName, ...args) {
        this.eventHandler.forEach((value, key, map) => {
            if (value.eventName !== eventName) {
                return;
            }

            const boundHandler = key.scope ? key.callback.bind(key.scope) : key.callback;

            if (value.once) {
                map.delete(key);
            }

            try {
                boundHandler(...args);
            } catch (err) {
                console.error(err);
            }
        });
    }
}

export const GameBus = new EventBus("GameBus");

export const PhaseBus = new EventBus("PhaseBus");
