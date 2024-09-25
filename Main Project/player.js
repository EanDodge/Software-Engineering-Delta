/// Player object
/// used for the player

// //let playerImage;
// let xMove = 0;
// let yMove = 0;
//used for key inputs
let xMove = 0;
let yMove = 0;
let turn = 0;

// function preload() {
//       	backgroundImage = loadImage("./assets/sea.png");
//         playerImage = loadImage("./assets/shiplvl1Top.png");
//     }

class Player {
    // constructor(x, y) {
    //     this.x = x;
    //     this.y = y;
    //     this.speed = 3;
    //     this.size = 50;
    //     this.color = "white";
    //     this.timer = 0;
    // }
    constructor(x, y) {
        this.x = x;                 //current x
        this.y = y;                 //current y
        this.speed = 3;             //speed of the boat in pixels (how many pixels it moves in one tic)
        //this.sizeH = 40;            //height of the test rectangle
        //this.sizeW = 20;            //width of the test rectangle
        this.size = 45;
        this.color = "white";
        this.turningSpeed = 0.075;  //multiplyer for how fast the boat will turn
        this.timer = 0;
        this.angle = 0              //current angle of boat in radians
    }

    // drawPlayer(playerImage) {
    //     //fill(this.color);
    //     image(playerImage, this.x, this.y, this.size, this.size);
    // }
    drawPlayer() {
        push();
        translate(this.x,this.y);
        rotate(-this.angle);
        //fill(186,184,80);
        //rectMode(CENTER);
        //rect(0, 0, this.sizeW, this.sizeH);
        imageMode(CENTER);
        image(playerImage, 0, 0, this.size, this.size)
        rotate(this.angle);
        pop();
    }

    // movePlayer() {
    //     //used to see if this upcoming move is out of bounds
    //     let futureX;
    //     let futureY;

    //     //normalize movement if diagonal
    //     if (yMove !== 0 && xMove !== 0) {
    //         futureX = this.x + xMove * this.speed * 0.7;
    //         futureY = this.y + yMove * this.speed * 0.7;
    //     }
    //     else {
    //         futureX = this.x + xMove * this.speed;
    //         futureY = this.y + yMove * this.speed;
    //     }

    //     //check if move is in bounds accounting for size
    //     if (futureX <= mapXSize - this.size / 2 && futureX >= 0 + this.size / 2)
    //         this.x = futureX;
    //     if (futureY <= mapYSize - this.size / 2 && futureY >= 0 + this.size / 2)
    //         this.y = futureY;
    // }
    movePlayer() {
        //used to see if this upcoming move is out of bounds
        let futureX;
        let futureY;

        this.angle += this.turningSpeed * turn;

        futureX = this.x + this.speed * sin(this.angle) * yMove;
        futureY = this.y + this.speed * cos(this.angle) * yMove;

        

        //check if move is in bounds accounting for size
        if (futureX <= mapXSize - this.size / 2 && futureX >= 0 + this.size / 2)
            this.x = futureX;
        if (futureY <= mapYSize - this.size / 2 && futureY >= 0 + this.size / 2)
            this.y = futureY;
    }

    // testCollision(gameObject) {
    //     //distance formuala between player and game object midpoints
    //     let distance = Math.sqrt((gameObject.x - this.x) * (gameObject.x - this.x)
    //         + (gameObject.y - this.y) * (gameObject.y - this.y));

    //     if (gameObject.collision === true && distance < gameObject.size / 2 + this.size / 2) {
    //         //uncomment to see if colliding
    //         //console.log("collision");
    //         return true;
    //     }
    //     return false;
    // }
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

    // checkCollisionEnemies(enemies) {
    //     let hit = false;
    //     enemies.forEach((enemy, index) => {
    //         //distance formuala between enemy and projectile midpoints
    //         let distance = Math.sqrt((enemy.x - this.x) * (enemy.x - this.x)
    //             + (enemy.y - this.y) * (enemy.y - this.y));

    //         if (distance < enemy.size / 2 + this.size / 2) {
    //             hit = true;
    //         }
    //     });

    //     if (hit && this.timer === 0) {
    //         this.color = "red";
    //         this.timer = 60;
    //     }
    //     else {
    //         if (this.timer <= 50)
    //             this.color = "white";
    //         if (this.timer > 0)
    //             this.timer--;
    //     }
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

// //p5 built in function
// function keyPressed() {
//     if (key == 'w') {
//         yMove -= 1;
//     }
//     if (key == 'a') {
//         xMove -= 1;
//     }
//     if (key == 's') {
//         yMove += 1;
//     }
//     if (key == 'd') {
//         xMove += 1;
//     }
// }

// //p5 built in function
// function keyReleased() {
//     if (key == 'w') {
//         yMove += 1;
//     }
//     if (key == 'a') {
//         xMove += 1;
//     }
//     if (key == 's') {
//         yMove -= 1;
//     }
//     if (key == 'd') {
//         xMove -= 1;
//     }
// }

//p5 built in function
function keyPressed() {
    if (key == 'w') {
        yMove -= 1;
    }
    if (key == 'a') {
        turn += 1;
    }
    if (key == 's') {
        yMove += 1;
    }
    if (key == 'd') {
        turn -= 1;

    }
}

//p5 built in function
function keyReleased() {
    if (key == 'w') {
        yMove += 1;
    }
    if (key == 'a') {
        turn -= 1;
    }
    if (key == 's') {
        yMove -= 1;
    }
    if (key == 'd') {
        turn += 1;
    }
}