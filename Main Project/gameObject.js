/// GameObject
/// used for the game objects



class GameObject {
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.collision = true;
    }

    drawObject(islandImage) {
        fill(0, 255, 0);
        imageMode(CENTER);      //Sets the image to be drawn in the middle on the x, y
        image(islandImage, this.x, this.y, this.size, this.size);
        imageMode(CORNER);      //returns the image draw mode to default
    }


    checkGoalCollision(player, currentLevel) {
        let distance = Math.sqrt((player.x - this.x) * (player.x - this.x)
            + (player.y - this.y) * (player.y - this.y));

        if (distance < player.size / 2 + this.size / 2) {
            let highestLevel = parseInt(localStorage.getItem("highestLevelBeat")) || 0;
            if (currentLevel > highestLevel) {
                localStorage.setItem("highestLevelBeat", currentLevel.toString());
            }
            //do this last!!!
            window.location.href = 'bossFight.html';
        }
    }
}

module.exports = GameObject;