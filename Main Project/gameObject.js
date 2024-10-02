/// GameObject
/// used for the game objects



class GameObject {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 100;
        this.collision = false;
    }

    drawObject(islandImage) {
        fill(0, 255, 0);
        image(islandImage, this.x, this.y, this.size, this.size);
    }
}