/// GameObject
/// used for the game objects



class GameObject {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 100;
        this.collision = true;
    }

    drawObject(islandImage) {
        fill(0, 255, 0);    
        imageMode(CENTER);      //Sets the image to be drawn in the middle on the x, y
        image(islandImage, this.x, this.y, this.size, this.size);
        imageMode(CORNER);      //returns the image draw mode to default
    }
}