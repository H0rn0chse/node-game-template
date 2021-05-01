export class BaseScenePlugin {
    constructor (scene) {
        this.scene = scene;

        this.scene.events.on("destroy", this.destroy, this);
    }

    destroy () {
        // Plugins should implement this method for cleanup
    }
}
