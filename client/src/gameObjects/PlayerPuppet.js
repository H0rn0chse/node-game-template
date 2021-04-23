export class PlayerPuppet {
    constructor () {
        this._createElement();
    }

    _createElement () {
        this.container = document.createElement("div");
        this.container.classList.add("cursor");

        this.inner = document.createElement("div");
        this.inner.classList.add("cursorName", "flexColumn");

        this.name = document.createElement("div");
        this.name.innerText = "";

        this.inner.appendChild(this.name);
        this.container.appendChild(this.inner);
    }

    setParent (parent) {
        parent.appendChild(this.container);
    }

    update (name, pos) {
        this.name.innerText = name;
        this.container.style.top = `${pos.y}px`;
        this.container.style.left = `${pos.x}px`;
    }

    destroy () {
        this.container.remove();
    }
}
