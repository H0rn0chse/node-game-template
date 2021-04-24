export class HighscoreEntry {
    constructor (placement, name, points) {
        this.container = document.createElement("div");
        this.container.classList.add("flexRow", "highscoreEntry");

        this.placement = document.createElement("h2");
        this.placement.classList.add("highscorePlacement");
        this.container.appendChild(this.placement);
        this.setPlacement(placement);

        this.name = document.createElement("div");
        this.name.classList.add("highscoreName");
        this.container.appendChild(this.name);
        this.setName(name);

        this.points = document.createElement("div");
        this.points.classList.add("highscorePoints");
        this.container.appendChild(this.points);
        this.setPoints(points);

        this.setVisible(false);
    }

    setPlacement (placement) {
        this.placement.innerText = placement;
    }

    setName (name) {
        this.name.innerText = name;
    }

    setPoints (points) {
        this.points.innerText = points;
    }

    setVisible (isVisible) {
        this.container.style.display = isVisible ? "inherit" : "none";
    }
}
