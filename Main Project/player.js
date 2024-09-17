/// Player object
/// used for the player


let xMove = 0;
let yMove = 0;


class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.speed = 1;
    }

    drawPlayer() {
        fill(255, 255, 255);
        ellipse(this.x, this.y, 50, 50);
    }

    movePlayer() {
        //normalize movement if diagonal
        if (yMove !== 0 && xMove !== 0) {
            this.x = this.x + xMove * this.speed * 0.7;
            this.y = this.y + yMove * this.speed * 0.7;
        }
        else {
            this.x += xMove * this.speed;
            this.y += yMove * this.speed;
        }
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