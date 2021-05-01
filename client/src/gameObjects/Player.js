import { GameManager } from "../views/GameManager.js";
import { PhaseManager } from "../PhaseManager.js";
import { DYNAMIC, Phaser, PHASES, PLAYER_STATUS } from "../globals.js";

export class Player extends Phaser.Physics.Arcade.Image {
    constructor (scene, name, x, y) {
        const { world } = scene.physics;
        super(scene, x, y, "animals", name);

        world.enable([this], DYNAMIC);

        this.setBounce(0.2);
        this.setCollideWorldBounds(true);

        this.setScale(0.25);

        this.sounds = {
            die: scene.sound.add("loose"),
            jump: scene.sound.add("jump"),
            walk0: scene.sound.add("walk_0"),
            walk1: scene.sound.add("walk_1"),
            walk2: scene.sound.add("walk_2"),
            walk3: scene.sound.add("walk_3"),
        };
        Object.values((sound) => {
            scene.volume.addSound(sound);
        });
        this.walkSound = null;

        this.isDead = false;
        this.isJumping = false;
    }

    _getRandomWalkSound () {
        const index = Math.floor(Math.random() * 4);
        return this.sounds[`walk${index}`];
    }

    update (time, delta) {
        const pos = {
            x: this.x,
            y: this.y,
        };

        GameManager.updatePlayer(pos);

        if (this.isDead || !PhaseManager.isPhase(PHASES.Run) || GameManager.runEnded) {
            if (!this.isDead) {
                this.setVelocityX(0);
            }
            return;
        }

        const cursor = this.scene.input.keyboard.createCursorKeys();

        if (cursor.left.isDown) {
            this.body.setVelocityX(-180);
        } else if (cursor.right.isDown) {
            this.body.setVelocityX(180);
        } else {
            this.body.setVelocityX(0);
        }

        if (cursor.up.isDown && this.body.onFloor()) {
            this.sounds.jump.play();
            this.body.setVelocityY(-500);
        }

        if (this.isJumping && this.body.onFloor()) {
            this.isJumping = false;
            this.walkSound = this._getRandomWalkSound();
            this.walkSound.play();
        } else if (this.body.onFloor() && this.body.velocity.x !== 0 && (this.walkSound === null || !this.walkSound.isPlaying)) {
            this.walkSound = this._getRandomWalkSound();
            this.walkSound.play();
        }

        if (!this.body.onFloor()) {
            this.isJumping = true;
        }
    }

    die () {
        if (this.isDead) {
            return;
        }

        this.isDead = true;
        this.sounds.die.play();
        GameManager.endRun(PLAYER_STATUS.Dead);
    }

    resetPlayer (point) {
        this.isDead = false;
        this.setVelocity(0);
        this.setPosition(point.x, point.y);
    }
}
