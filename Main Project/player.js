/// Player object
/// used for the player


let xMove = 0;
let yMove = 0;


class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.speed = 2;
        this.size = 50;
    }

    drawPlayer() {
        fill(255, 255, 255);
        ellipse(this.x, this.y, this.size, this.size);
    }

    movePlayer() {
        //used to see if this upcoming move is out of bounds
        let futureX;
        let futureY;

        //normalize movement if diagonal
        if (yMove !== 0 && xMove !== 0) {
            futureX = this.x + xMove * this.speed * 0.7;
            futureY = this.y + yMove * this.speed * 0.7;
        }
        else {
            futureX = this.x + xMove * this.speed;
            futureY = this.y + yMove * this.speed;
        }

        //check if move is in bounds accounting for size
        if (futureX <= mapXSize - this.size / 2 && futureX >= 0 + this.size / 2)
            this.x = futureX;
        if (futureY <= mapYSize - this.size / 2 && futureY >= 0 + this.size / 2)
            this.y = futureY;
    }

    testCollision(gameObject) {
        //distance formuala between player and game object midpoints
        let distance = Math.sqrt((gameObject.x - this.x) * (gameObject.x - this.x)
            + (gameObject.y - this.y) * (gameObject.y - this.y));

        if (gameObject.collision === true && distance < gameObject.size / 2 + player.size / 2) {
            //uncomment to see if colliding
            //console.log("collision");
            return true;
        }
        return false;
    }
}

//p5 built in function
function keyPressed() {
    if (key == 'w') {
        yMove -= 1;
    }
    if (key == 'a') {
        xMove -= 1;
    }
    if (key == 's') {
        yMove += 1;
    }
    if (key == 'd') {
        xMove += 1;
    }
}

//p5 built in function
function keyReleased() {
    if (key == 'w') {
        yMove += 1;
    }
    if (key == 'a') {
        xMove += 1;
    }
    if (key == 's') {
        yMove -= 1;
    }
    if (key == 'd') {
        xMove -= 1;
    }
}