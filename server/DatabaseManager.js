import dotenv from "dotenv";
import mongoose from "mongoose";
import { Deferred } from "../client/src/Deferred.js";

const { Schema } = mongoose;

// local .env setup
if (process.env.DB_URL === undefined) {
    dotenv.config();
}

class _DatabaseManager {
    constructor () {
        this.deferred = new Deferred();
    }

    connect () {
        mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(() => {
                globalThis.console.log("Database connected");
                this.loadModel();
                this.deferred.resolve();
            })
            .catch(() => {
                globalThis.console.log("Error: Database was not able to connect!");
                this.deferred.reject();
            });
    }

    loadModel () {
        const Highscore = new Schema({
            placement: Number,
            name: String,
            points: Number,
            date: Number,
        });
        this.highscore = mongoose.model("Highscore", Highscore);
    }

    deleteAllHighscores () {
        this.highscore.deleteMany({}).then(() => {
            globalThis.console.log("Highscores deleted");
        });
    }

    updateHighscore (list) {
        if (!this.highscore) {
            return Promise.reject();
        }

        // eslint-disable-next-line arrow-body-style
        const promises = list.map((entry) => {
            return this.highscore.updateOne({ placement: entry.placement }, entry, { upsert: true });
        });
        return Promise.all(promises);
    }

    getHighscores () {
        if (!this.highscore) {
            return Promise.resolve([]);
        }
        return this.highscore.find({});
    }
}

export const DatabaseManager = new _DatabaseManager();
