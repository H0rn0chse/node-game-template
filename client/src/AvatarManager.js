import { Deferred } from "./Deferred.js";
import { Avatar } from "./domElements/Avatar.js";

class _AvatarManager {
    constructor () {
        this.deferred = new Deferred();

        this._fetchJson()
            .then(() => {
                this.deferred.resolve();
            });
    }

    async _fetchJson () {
        const result = await fetch("../../assets/atlas/animals_round.json");
        const obj = await result.json();

        this.avatarList = obj.textures[0].frames.reduce((obj, avatar) => {
            obj[avatar.filename] = avatar;
            return obj;
        }, {});
    }

    getAllAvatars () {
        return Object.values(this.avatarList).map((imageData) => {
            return new Avatar(imageData);
        });
    }

    getDefault () {
        return Object.keys(this.avatarList)[0];
    }

    getAvatarImage (avatarId) {
        const imageData = this.avatarList[avatarId];
        if (!imageData) {
            return;
        }
        const avatar = new Avatar(imageData);
        const image = avatar.image.cloneNode(true);
        avatar.destroy();

        return image;
    }

    ready () {
        return this.deferred.promise;
    }
}
export const AvatarManager = new _AvatarManager();
globalThis.AvatarManager = AvatarManager;
