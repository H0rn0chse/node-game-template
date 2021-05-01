export class HighscoreEntry {
    constructor (placement, name, score) {
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

        this.score = document.createElement("div");
        this.score.classList.add("highscorePoints");
        this.container.appendChild(this.score);
        this.setScore(score);

        this.setVisible(false);
    }

    setPlacement (placement) {
        this.placement.innerText = placement;
    }

    setName (name) {
        this.name.innerText = name;
    }

    setScore (score) {
        this.score.innerText = score;
    }

    setVisible (isVisible) {
        this.container.style.display = isVisible ? "inherit" : "none";
    }
}
