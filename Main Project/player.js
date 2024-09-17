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
}

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