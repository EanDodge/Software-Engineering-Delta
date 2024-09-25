/// Player object
/// used for the player


let xMove = 0;
let yMove = 0;


class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.speed = 3;
        this.size = 50;
        this.color = "white";
        this.timer = 0;
    }

    drawPlayer() {
        fill(this.color);
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

        if (gameObject.collision === true && distance < gameObject.size / 2 + this.size / 2) {
            //uncomment to see if colliding
            //console.log("collision");
            return true;
        }
        return false;
    }

    checkCollisionEnemies(enemies) {
        let hit = false;
        enemies.forEach((enemy, index) => {
            //distance formuala between enemy and projectile midpoints
            let distance = Math.sqrt((enemy.x - this.x) * (enemy.x - this.x)
                + (enemy.y - this.y) * (enemy.y - this.y));

            if (distance < enemy.size / 2 + this.size / 2) {
                hit = true;
            }
        });

        if (hit && this.timer === 0) {
            this.color = "red";
            this.timer = 60;
        }
        else {
            if (this.timer <= 50)
                this.color = "white";
            if (this.timer > 0)
                this.timer--;
        }
    }


    checkCollisionIsland(islands) {
        let hit = false;
        islands.forEach((island, index) => {
            //distance formuala between enemy and projectile midpoints
            let distance = Math.sqrt((island.x - this.x) * (island.x - this.x)
                + (island.y - this.y) * (island.y - this.y));

            if (distance < island.size / 2 + this.size / 2) {
                hit = true;
            }
        });

        if (hit && this.timer === 0) {
            this.color = "blue";
            this.timer = 60;
            window.location.href = 'upgrade.html'; // Navigate to upgrades.html
        }
        else {
            if (this.timer <= 50)
                this.color = "white";
            if (this.timer > 0)
                this.timer--;
        }
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