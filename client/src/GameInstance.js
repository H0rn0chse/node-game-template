import { PlayerPuppet } from "./gameObjects/PlayerPuppet.js";

export class GameInstance {
    constructor (container, controller) {
        this.container = container;
        this.area = container.querySelector("#gameArea");
        this.controller = controller;

        this.currentPos = {
            x: 0,
            y: 0,
        };

        this.playerPuppets = new Map();

        this.player = document.querySelector("#cursor");
        this.setPlayerPosition(0, 0);

        this.keyDownHandler = this.handleKeydown.bind(this);
        document.addEventListener("keydown", this.keyDownHandler);
    }

    handleKeydown (evt) {
        const delta = {
            x: 0,
            y: 0,
        };

        if (evt.key === "ArrowLeft") {
            delta.x = -1;
        } else if (evt.key === "ArrowRight") {
            delta.x = 1;
        }

        if (evt.key === "ArrowDown") {
            delta.y = 1;
        } else if (evt.key === "ArrowUp") {
            delta.y = -1;
        }

        const tempX = this.currentPos.x + delta.x * 5;
        const tempY = this.currentPos.y + delta.y * 5;

        // check boundaries
        if (tempX < 0 || tempY < 0 || tempX > (520 - 30) || tempY > (520 - 30)) {
            return;
        }

        this.currentPos.x = tempX;
        this.currentPos.y = tempY;

        this.setPlayerPosition(this.currentPos.x, this.currentPos.y);

        this.controller.updatePlayer(this.currentPos);
    }

    setPlayerPosition (x, y) {
        this.player.style.top = `${y}px`;
        this.player.style.left = `${x}px`;
    }

    updatePlayer (playerId, data) {
        let puppet = this.playerPuppets.get(playerId);

        if (!puppet) {
            puppet = new PlayerPuppet();
            puppet.update(data.name, data.pos);
            puppet.setParent(this.area);
            this.playerPuppets.set(playerId, puppet);
        } else {
            puppet.update(data.name, data.pos);
        }
    }

    removePlayer (playerId) {
        const puppet = this.playerPuppets.get(playerId);
        if (puppet) {
            puppet.destroy();
        }
        this.playerPuppets.delete(playerId);
    }

    destroy () {
        document.removeEventListener("keydown", this.keyDownHandler);
        this.playerPuppets.forEach((puppet) => {
            puppet.destroy();
        });
    }
}
