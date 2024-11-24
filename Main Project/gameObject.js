/// GameObject
/// used for the game objects like the upgrade island and the non upgrade islands

class GameObject {
    constructor(x, y, W = 100, H = 50) {
        this.x = x;
        this.y = y;
        this.size = 100;    //dont use
        // this.collision = true;  //what does this do?
        // this.islandImage = islandImg;
        this.sizeW = W;
        this.sizeH = H;
    }

    drawObject(islandImg) {
        imageMode(CORNER);      //returns the image draw mode to default
        image(islandImg, this.x, this.y - 40, this.sizeW, this.sizeH + 40);
        // rect(this.x, this.y, this.sizeW, this.sizeH);
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

//module.exports = GameObject;