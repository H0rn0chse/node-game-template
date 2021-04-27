import { AvatarManager } from "../AvatarManager.js";

export class AvatarSelect {
    constructor (domRef) {
        this.container = domRef;

        this.images = {};

        AvatarManager.ready()
            .then(() => {
                this._addImages();
            });
    }

    _addImages () {
        const avatars = AvatarManager.getAllAvatars();
        avatars.forEach((avatar) => {
            avatar.setParent(this.container);
            this.images[avatar.id] = avatar;
        });
    }

    select (avatarId) {
        Object.values(this.images).forEach((avatar) => {
            avatar.select(avatar.id === avatarId);
        });
    }

    reset () {
        Object.values(this.images).forEach((avatar) => {
            avatar.reset();
        });
    }
}
