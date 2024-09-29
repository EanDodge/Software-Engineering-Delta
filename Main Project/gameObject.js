/// GameObject
/// used for the game objects



class GameObject {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 50;
        this.collision = true;  //collision is on by default
    }

    drawObject(islandImage) {
        fill(0, 255, 0);
        image(islandImage, this.x, this.y, this.size, this.size);
    }
}