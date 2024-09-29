// Player object
// used for the player

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
		this.angle = 0;             //angle of the boat
		this.currency = parseInt(localStorage.getItem('playerCurrency')) || 100; // Retrieve from localStorage or default to 100
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

        //make sure angle is calculated first!
        this.angle += this.turningSpeed * turn;

        futureX = this.x + this.speed * sin(this.angle) * yMove;
        futureY = this.y + this.speed * cos(this.angle) * yMove;

        

        //check if move is in bounds accounting for size
        if (futureX <= mapXSize - this.size / 2 && futureX >= 0 + this.size / 2)
            this.x = futureX;
        if (futureY <= mapYSize - this.size / 2 && futureY >= 0 + this.size / 2)
            this.y = futureY;
    }

    getMovementOfPlayer() {
        this.angle += this.turningSpeed * turn;

        let futureX = this.speed * sin(this.angle) * yMove;
        let futureY = this.speed * cos(this.angle) * yMove;
        return [futureX, futureY];
    }

    testMovePlayer() {
        //Test Framework
        {
            //puts player into middle of map
            let testPlayer = new Player (mapXSize/2, mapYSize/2);

            //make sure player starts where it should start
            console.assert(testPlayer.x == mapXSize/2);
            console.assert(testPlayer.y == mapYSize/2);
        }
        //Tests that player moves forward, and coordinates are calculated correctly
        {
            //puts player into middle of map
            let testPlayer = new Player (mapXSize/2, mapYSize/2);

            //make player move forward (yes -1 is forward dont ask)
            yMove = -1;
            testPlayer.movePlayer();

            console.assert(testPlayer.x == mapXSize/2);
            console.assert(testPlayer.y == mapYSize/2 - testPlayer.speed);


            //reset yMove after done
            yMove = 0;
        }
        //Tests that player moves backwards, and coordinates are calculated correctly
        {
            //puts player into middle of map
            let testPlayer = new Player (mapXSize/2, mapYSize/2);

            //make player move backward
            yMove = 1;
            testPlayer.movePlayer();

            console.assert(testPlayer.x == mapXSize/2);
            console.assert(testPlayer.y == mapYSize/2 + testPlayer.speed);

            //reset yMove after done
            yMove = 0;
        }
        //Tests that player turns clockwise
        {
            //puts player into middle of map
            let testPlayer = new Player (mapXSize/2, mapYSize/2);

            //make player turn clockwise
            turn = -1;
            testPlayer.movePlayer();

            console.assert(testPlayer.x == mapXSize/2);
            console.assert(testPlayer.y == mapYSize/2);
            console.assert(testPlayer.angle == -1 * testPlayer.turningSpeed);


            //reset turn after done
            turn = 0;
        }
        //tests that player turns counter-clockwise
        {
            //puts player into middle of map
            let testPlayer = new Player (mapXSize/2, mapYSize/2);

            //make player turn counter-clockwise (yes turn is counter intuitave)
            turn = 1;
            testPlayer.movePlayer();

            console.assert(testPlayer.x == mapXSize/2);
            console.assert(testPlayer.y == mapYSize/2);
            console.assert(testPlayer.angle == testPlayer.turningSpeed);

            //reset turn after done
            turn = 0;
        }
        //Tests that coordinate calculation with a turning input is working (cw - F)
        {
            //puts player into middle of map
            let testPlayer = new Player (mapXSize/2, mapYSize/2);

            //make player turn clockwise and move forward  
            turn = 1;
            yMove = -1;
            testPlayer.movePlayer();

            console.assert(testPlayer.x ==  (mapXSize/2) + 
                                            testPlayer.speed * sin(testPlayer.angle) * yMove);
            console.assert(testPlayer.y ==  (mapYSize/2) + 
                                            testPlayer.speed * cos(testPlayer.angle) * yMove);
            console.assert(testPlayer.angle == testPlayer.turningSpeed);
            

            //reset turn after done
            turn = 0;
            yMove = 0;
        }
        //Tests that coordinate calculation with a turning input is working (ccw - F)
        {
            //puts player into middle of map
            let testPlayer = new Player (mapXSize/2, mapYSize/2);

            //make player turn counter-clockwise and move forward  
            turn = -1;
            yMove = -1;
            testPlayer.movePlayer();

            console.assert(testPlayer.x ==  (mapXSize/2) + 
                                            testPlayer.speed * sin(testPlayer.angle) * yMove);
            console.assert(testPlayer.y ==  (mapYSize/2) + 
                                            testPlayer.speed * cos(testPlayer.angle) * yMove);
            console.assert(testPlayer.angle == -1 * testPlayer.turningSpeed);
            

            //reset turn after done
            turn = 0;
            yMove = 0;
        }
        //Tests that coordinate calculation with a turning input is working (cw - R)
        {
            //puts player into middle of map
            let testPlayer = new Player (mapXSize/2, mapYSize/2);

            //make player turn clockwise and move forward  
            turn = 1;
            yMove = 1;
            testPlayer.movePlayer();

            console.assert(testPlayer.x ==  (mapXSize/2) + 
                                            testPlayer.speed * sin(testPlayer.angle) * yMove);
            console.assert(testPlayer.y ==  (mapYSize/2) + 
                                            testPlayer.speed * cos(testPlayer.angle) * yMove);
            console.assert(testPlayer.angle == testPlayer.turningSpeed);
            

            //reset turn after done
            turn = 0;
            yMove = 0;
        }
        //Tests that coordinate calculation with a turning input is working (ccw - R)
        {
            //puts player into middle of map
            let testPlayer = new Player (mapXSize/2, mapYSize/2);

            //make player turn counter-clockwise and move forward  
            turn = -1;
            yMove = 1;
            testPlayer.movePlayer();

            console.assert(testPlayer.x ==  (mapXSize/2) + 
                                            testPlayer.speed * sin(testPlayer.angle) * yMove);
            console.assert(testPlayer.y ==  (mapYSize/2) + 
                                            testPlayer.speed * cos(testPlayer.angle) * yMove);
            console.assert(testPlayer.angle == -1 * testPlayer.turningSpeed);
            

            //reset turn after done
            turn = 0;
            yMove = 0;
        }
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
	updateCoinCount() {
        document.getElementById('coinCount').innerText = this.currency;
        localStorage.setItem('playerCurrency', this.currency); // Store in localStorage
		console.log(player.currency);
    }

	buyUpgrade(cost) {
		if (player.currency >= cost) {
			player.currency -= cost;
			player.updateCoinCount();
			return true;
		}
		else {
			alert('Not enough coins!');
			return false;
		}
	}

	gainCurrency(amount) {
		player.currency += amount;
		player.updateCoinCount();
	}
}




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

// Initial update to display the starting currency
document.addEventListener('DOMContentLoaded', function() {
    player.updateCoinCount();
});