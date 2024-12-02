/// GameObject
/// used for the game objects like the upgrade island and the non upgrade islands

class GameObject {
    constructor(x, y, W = 100, H = 100) {
        this.x = x;
        this.y = y;
        this.size = 100;    //dont use
        // this.collision = true;  //what does this do?
        this.islandImage = null;
        this.sizeW = W;
        this.sizeH = H;
    }

    //Why are we adding 40 to size???
    drawObject() {
        if (this.islandImage) {
        //imageMode(CENTER);     
        image(this.islandImage, this.x, this.y, this.sizeW, this.sizeH);
        //imageMode(CORNER);      //returns the image draw mode to default
        } else {
            rect(this.x, this.y, 50, 50);
        }
        // rect(this.x, this.y, this.sizeW, this.sizeH);
    }

    drawBomb(islandImg) {
        imageMode(CORNER);      //returns the image draw mode to default
        image(islandImg, this.x, this.y, this.sizeW, this.sizeH);
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
            // Generate a random number between 0 and 1
            let randomNum = Math.floor(Math.random() * 2);

            // Use a switch statement to handle the different cases
            switch (randomNum) {
                case 0:
                    window.location.href = 'bossFight.html';
                    break;
                case 1:
                    window.location.href = 'cortanaFight.html';
                    break;
                default:
                    console.error('Unexpected random number:', randomNum);
            }
        }
    }
}

//module.exports = GameObject;