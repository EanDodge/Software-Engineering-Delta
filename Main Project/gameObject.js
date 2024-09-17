/// GameObject
/// used for the game objects


class GameObject {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 50;
        this.collision = false;
    }

    drawObject() {
        fill(0, 255, 0);
        ellipse(this.x, this.y, this.size, this.size);
    }
}