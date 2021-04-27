import { LobbyBus } from "../EventBus.js";

export class Avatar {
    constructor (imageData) {
        this.id = imageData.filename;

        this.node = document.createElement("div");
        this.node.classList.add("avatar");

        this.image = document.createElement("div");
        this.image.classList.add("avatarImage");
        this.node.appendChild(this.image);

        this.image.style.width = `${imageData.frame.w}px`;
        this.image.style.height = `${imageData.frame.h}px`;
        this.image.style.backgroundPosition = `-${imageData.frame.x}px -${imageData.frame.y}px`;

        this.image.addEventListener("click", (evt) => {
            LobbyBus.emit("selectAvatar", this.id);
        });

        this.selected = document.createElement("div");
        this.selected.classList.add("selected");
        this.selected.style.display = "none";
        this.node.appendChild(this.selected);
    }

    setParent (domRef) {
        domRef.appendChild(this.node);
    }

    select (shouldSelect = true) {
        if (shouldSelect) {
            this.selected.style.display = "";
        } else {
            this.selected.style.display = "none";
        }
    }

    reset () {
        this.select(false);
    }

    destroy () {
        this.node.remove();
    }
}
