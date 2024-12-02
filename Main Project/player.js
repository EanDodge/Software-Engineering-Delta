// Player object
// used for the player

//used for key inputs
let xMove = 0;
let yMove = 0;
let turn = 0;
let sailTurn = 0;
let vel = 0;
let anchor = false;
let delozierMode = false;

class Player {

    constructor(x, y) {
        this.x = x;                 //current x
        this.y = y;                 //current y
        this.speed = parseInt(localStorage.getItem('speed')) || 3;  //speed of the boat in pixels (how many pixels it moves in one tic)
        this.sizeH = 40;          //height of the test rectangle
        this.sizeW = 20;          //width of the test rectangle
        this.size = 45;
        this.turningSpeed = 0.075;  //how fast the boat will turn (radians per sec?)
        this.timer = 0;
        this.angle = Math.PI * 2;             //angle of the boat in radians
        this.currency = parseInt(localStorage.getItem('playerCurrency')) || 100; // Retrieve from localStorage or default to 100
        this.hitEnemy = false;

        // this.hitIsland = false;
        this.hitIsland = false;
        this.playerImage;
        this.sailImage = './assets/shiplvl1BackSail.png';
        this.health = parseInt(localStorage.getItem('playerHealth')) || 10;
        this.lastCollisionTime = 0; //Tracks the time of last collision
        this.cannonDamage = parseInt(localStorage.getItem('cannons')) || 1;
        this.inked = false;
        this.rudderAngle = 0;
        this.sailAngle = Math.PI;
        this.isAlive = true;


    }

    //runs all test for the Player Class
    // runTestsPlayer() {
    //     this.testConstructor();
    //     this.testMovePlayer();
    //     this.testCheckCollision();
    //     this.testCheckCollisionEnemies();
    //     //return("passed")
    // }

    testConstructor() {
        //Test framework
        {
            let testMapX = 500;
            let testMapY = 400;
            let testPlayer = new Player(testMapX / 2, testMapY / 2);
            if (testPlayer.x != testMapX / 2) {
                return "failed";
            }
            if (testPlayer.y != testMapY / 2) {
                return "failed";
            }
            if (!(testPlayer.speed != 0)) {
                return "failed";
            }
            if (!(testPlayer.size != 0)) {
                return "failed";
            }
            if (!(testPlayer.turningSpeed != 0)) {
                return "failed";
            }
        }
        return "passed";
    }

    drawPlayer() {
        push();
        translate(this.x, this.y);
        rotate(-this.angle);
        //fill(186,184,80);
        
        //rect(0, 0, this.sizeW, this.sizeH);
        imageMode(CENTER);
        if (this.hitEnemy) {
            //image(playerHitImage, 0, 0, this.size, this.size)
            tint('red');
            image(this.playerImage, 0, 0, this.size, this.size);
        }
        else {
            image(this.playerImage, 0, 0, this.size, this.size);
        }

        //this rec is the hitbox
        // rectMode(CENTER);
        // rect(0, 0, this.sizeW, this.sizeH);
        rotate(this.angle);
        pop();      


    }

    // movePlayer(bumpBack = false) {
    drawRudderAndSails() {
        push();
        fill(255, 128, 13);
        translate(this.x - 350, this.y - 250);
        rotate(-this.rudderAngle);
        imageMode(CENTER)
        //image(this.sailImage, 0, 0, this.size, this.size);
        //imageMode(CORNER)
        pop();

        push();
        imageMode(CENTER)
        //fill(255, 255, 255);
        translate(this.x, this.y);
        rotate(-(this.sailAngle));
        image(this.sailImage, 0, 0, this.size+30, this.size+30);

        pop();
    }

    movePlayer() {
        //used to see if this upcoming move is out of bounds
        let futureX;
        let futureY;

        if ((yMove + vel) < 1 && (yMove + vel) > -1) {// change these numbers for speed
            yMove += vel;
        }
        else {
            if (yMove < 0) yMove = -1;
            if (yMove > 0) yMove = 1;
        }
        if (anchor) {
            yMove = 0;
        }

        //make sure angle is calculated first!
        this.angle += this.turningSpeed * turn;
        if (this.angle > Math.PI * 2) {
            this.angle = this.angle - Math.PI * 2;
        }
        if (this.angle < 0) {
            this.angle = this.angle + Math.PI * 2;
        }



        this.rudderAngle = Math.min(Math.max(this.rudderAngle + this.turningSpeed * turn / 2, -Math.PI / 4), Math.PI / 4);
        //this.sailAngle = Math.min(Math.max(this.sailAngle + this.turningSpeed * sailTurn, this.angle + Math.PI / 2), this.angle + Math.PI * 3 / 2);
        // this is what sets the sail angle. It does not allow the sail to go past the front of the boat
        // Normalize the sailAngle to be within [0, 2 * Math.PI)
        this.sailAngle = (this.sailAngle + Math.PI * 2) % (Math.PI * 2);
        let newSailAngle = this.sailAngle + this.turningSpeed * sailTurn;
        newSailAngle = (newSailAngle + Math.PI * 2) % (Math.PI * 2);

        //if (this.validSailAnglePortside() && this.validSailAngleStarboard()) {
            this.sailAngle = newSailAngle;

        /*} else if (!this.validSailAnglePortside()) {
            this.sailAngle += 0.01;
        } else if (!this.validSailAngleStarboard()) {
            this.sailAngle -= 0.01;
        }*/
        let a = this.sailAngle;
        let b = this.angle;
        let c = (a - b) - Math.PI / 2;
        let theta = (Math.PI / 2 - c);

        let windCurrent = 1;
        // if (this.sailAngle <= Math.PI) {
        //     //console.log("1");
        //     windCurrent = (Math.PI - this.sailAngle) / (Math.PI / 2);
        // } else if (this.sailAngle <= Math.PI * 3 / 2) {
        //     //console.log("2");
        //     windCurrent = (this.sailAngle - Math.PI) / (Math.PI / 2);
        // } else if (this.sailAngle <= Math.PI * 2) {
        //     //console.log("3");
        //     windCurrent = (Math.PI * 2 - this.sailAngle) / (Math.PI / 2);
        // } else if (this.sailAngle <= Math.PI * 5 / 2) {
        //     //console.log("4");
        //     windCurrent = (this.sailAngle - Math.PI * 2) / (Math.PI / 2);
        // } else if (this.sailAngle <= Math.PI * 3) {
        //     //console.log("5");
        //     windCurrent = (Math.PI * 3 - this.sailAngle) / (Math.PI / 2);
        // } else if (this.sailAngle <= Math.PI * 7 / 2) {
        //    // console.log("6");
        //     windCurrent = (this.sailAngle - Math.PI * 3) / (Math.PI / 2);
        // }

        let relativeWindAngle = Math.abs(this.sailAngle - this.angle) % (Math.PI * 2);

        // Determine the windCurrent based on the point of sail
        if (relativeWindAngle <= Math.PI / 4 || relativeWindAngle >= Math.PI * 7 / 4) {
            // Close Haul (within 45 degrees of the wind direction)
            windCurrent = 0.5; // Slowest speed
        } else if (relativeWindAngle >= Math.PI * 3 / 4 && relativeWindAngle <= Math.PI * 5 / 4) {
            // Run (within 45 degrees of directly downwind)
            windCurrent = 0.8; // Second fastest speed
        } else if (relativeWindAngle >= Math.PI / 4 && relativeWindAngle <= Math.PI * 3 / 4) {
            // Beam Reach (perpendicular to the wind)
            windCurrent = 1.0; // Fastest speed
        } else if (relativeWindAngle >= Math.PI * 5 / 4 && relativeWindAngle <= Math.PI * 7 / 4) {
            // Beam Reach (perpendicular to the wind)
            windCurrent = 1.0; // Fastest speed
        }

        //console.log(windCurrent);


        let magnitude = windCurrent * Math.sin(theta);
        let x = magnitude * Math.sin(b);
        let y = magnitude * Math.cos(b);


        /*
        console.log("a: " + a);
        console.log("b: " + b);
        console.log("c: " + c);
        console.log("theta: " + theta);
        console.log("magnitude: " + magnitude);
        console.log("x: " + x);
        console.log("y: " + y);*/



        //futureX = this.x + this.speed * sin(this.angle) * yMove;
        //futureY = this.y + this.speed * cos(this.angle) * yMove;

        //(Math.abs((this.sailAngle - windAngle))) maybe for straight sail
        if (this.sailAngle <= Math.PI) {
            futureX = this.x + this.speed * x;
            futureY = this.y + this.speed * y;
        } else if (this.sailAngle <= Math.PI * 3 / 2) {
            futureX = this.x - this.speed * x;
            futureY = this.y - this.speed * y;
        } else if (this.sailAngle <= Math.PI * 2) {
            futureX = this.x - this.speed * x;
            futureY = this.y - this.speed * y;
        } else if (this.sailAngle <= Math.PI * 5 / 2) {
            futureX = this.x + this.speed * x;
            futureY = this.y + this.speed * y;
        } else if (this.sailAngle <= Math.PI * 3) {
            futureX = this.x + this.speed * x;
            futureY = this.y + this.speed * y;
        } else if (this.sailAngle <= Math.PI * 7 / 2) {
            futureX = this.x - this.speed * x;
            futureY = this.y - this.speed * y;
        }
        /*
        futureX = this.x + this.speed * x;
        futureY = this.y + this.speed * y;//*/



        //check if move is in bounds accounting for size
        if (futureX <= mapXSize - this.size / 2 && futureX >= 0 + this.size / 2)
            this.x = futureX;
        if (futureY <= mapYSize - this.size / 2 && futureY >= 0 + this.size / 2)
            this.y = futureY;

        //this.updateAnglesDisplay();
    }

    getMovementOfPlayer() {
        //this.angle += this.turningSpeed * turn;
        if (this.angle > Math.PI * 2) {
            this.angle = this.angle - Math.PI * 2;
        }
        if (this.angle < 0) {
            this.angle = this.angle + Math.PI * 2;
        }

        let futureX = this.speed * sin(this.angle) * yMove;
        let futureY = this.speed * cos(this.angle) * yMove;
        return [futureX, futureY];
    }


    //bool, returns true if player is colliding with gameObject <- must have x,y,sizeH,sizeW
    isColliding(gameObject) {
        //New Formula
        let pf = [this.sizeW / 2, -this.sizeH / 2]
        let pr = [this.sizeW / 2, this.sizeH / 2]
        let df = [-this.sizeW / 2, -this.sizeH / 2]
        let dr = [-this.sizeW / 2, this.sizeH / 2]
        let corners = [pf, pr, df, dr];
        
        corners.forEach(corner => {
            let W = corner[0];
            let H = corner[1];
            corner[0] = this.x + cos(-this.angle) * W - sin(-this.angle) * H;
            corner[1] = this.y + sin(-this.angle) * W + cos(-this.angle) * H;
            // circle(corner[0], corner[1], 10);
        });

        if (
            collideLineRect(pf[0], pf[1], pr[0], pr[1], gameObject.x, gameObject.y, gameObject.sizeW, gameObject.sizeH) || 
            collideLineRect(pr[0], pr[1], dr[0], dr[1], gameObject.x, gameObject.y, gameObject.sizeW, gameObject.sizeH) ||
            collideLineRect(dr[0], dr[1], df[0], df[1], gameObject.x, gameObject.y, gameObject.sizeW, gameObject.sizeH) ||
            collideLineRect(df[0], df[1], pf[0], pf[1], gameObject.x, gameObject.y, gameObject.sizeW, gameObject.sizeH)
            ) {
            return true
        }
        return false
    }

    checkCollisionIslands(islands) {
        let colliding = false;
        islands.forEach((island, index) => {
            if(this.isColliding(island)) {
                colliding = true;
            }
        });
        return colliding;
    }

    checkCollisionTreasureIslands(islands) {
        let colliding = false;
        islands.forEach((island, index) => {
            if(this.isColliding(island)) {
                colliding = true;
                const randomNumber = Math.floor(Math.random() * 3);

				// Use a switch statement to set window.location.href
				switch (randomNumber) {
					case 0:
						window.location.href = './nurikabe/nurikabeEasy.html';
						break;
					case 1:
						window.location.href = './Sudoku/sudoku.html';
						break;
					case 2:
						window.location.href = './tetris.html';
						break;
					default:
						console.error('Unexpected random number:', randomNumber);
				}
            }
        });
        return colliding;
    }

    isCollidingEnemy(enemy) {
        //New Formula
        let pf = [this.sizeW / 2, -this.sizeH / 2]
        let pr = [this.sizeW / 2, this.sizeH / 2]
        let df = [-this.sizeW / 2, -this.sizeH / 2]
        let dr = [-this.sizeW / 2, this.sizeH / 2]
        let corners = [pf, pr, df, dr];
        
        corners.forEach(corner => {
            let W = corner[0];
            let H = corner[1];
            corner[0] = this.x + cos(-this.angle) * W - sin(-this.angle) * H;
            corner[1] = this.y + sin(-this.angle) * W + cos(-this.angle) * H;
            // circle(corner[0], corner[1], 10);
        });

        if (
            collideLineCircle(pf[0], pf[1], pr[0], pr[1], enemy.x, enemy.y, enemy.size) || 
            collideLineCircle(pr[0], pr[1], dr[0], dr[1], enemy.x, enemy.y, enemy.size) ||
            collideLineCircle(dr[0], dr[1], df[0], df[1], enemy.x, enemy.y, enemy.size) ||
            collideLineCircle(df[0], df[1], pf[0], pf[1], enemy.x, enemy.y, enemy.size)
            ) {
            return true

        }
        return false
    }

    checkCollisionEnemies(enemies) {
        let hit = false;
        const currentTime = Date.now();
        const collisionCooldown = 1000; // Cooldown period in milliseconds (e.g., 1000ms = 1 second)

        enemies.forEach((enemy) => {
            // Distance formula between enemy and player midpoints
            // let distance = Math.sqrt((enemy.x - this.x) * (enemy.x - this.x)
            //     + (enemy.y - this.y) * (enemy.y - this.y));

            // if (distance < enemy.size / 2 + this.size / 2) {
            //     hit = true;
            // }

            if(this.isCollidingEnemy(enemy)) {
                hit = true;
            }
            if (hit && (currentTime - this.lastCollisionTime) > collisionCooldown) {
                this.takeDamage(1); // Decrease player health by 1 
                // console.log(`Player health: ${this.health}`);
                this.lastCollisionTime = currentTime; // Update the last collision time
                // if (this.health <= 0) {
                //     window.location.href = 'gameover.html'; // Navigate to gameover.html
                // }
            }
        });

        if (hit && this.timer === 0) {
            this.hitEnemy = true;
            this.timer = 60;
        }
        else {
            if (this.timer <= 50) {
                this.hitEnemy = false;
            }
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
        this.currency += amount;
        this.updateCoinCount();
    }

    updateHealthBar() {
        if (typeof document !== 'undefined') {
            const healthBar = document.getElementById('health-bar');
            const healthPercentage = (this.health / 10) * 100; // Assuming max health is 10
            healthBar.style.width = healthPercentage + '%';
        }
    }

    // Call this method whenever the player's health changes
    takeDamage(amount) {
        this.health -= amount;
        if (this.health < 0) this.health = 0;
        localStorage.setItem('playerHealth', this.health);
        this.updateHealthBar();
    }

    checkCollisionProjectiles(projectiles) {
        projectiles.forEach((projectile, index) => {
            //distance formuala between enemy and projectile midpoints
            let distance = Math.sqrt((projectile.x - this.x) * (projectile.x - this.x)
                + (projectile.y - this.y) * (projectile.y - this.y));

            if (distance < projectile.size / 2 + this.size / 2) {
                this.takeDamage(projectile.damage, player);
                console.log("Enemy hit! Health: " + this.health);
                projectiles.splice(index, 1);

            }
        });
    }

    checkCollisionBomb(bombs) {
        bombs.forEach((bomb, index) => {
            //distance formuala between enemy and projectile midpoints
            let distance = Math.sqrt((bomb.x - this.x) * (bomb.x - this.x)
                + (bomb.y - this.y) * (bomb.y - this.y));

            if (distance < bomb.sizeW / 2 + this.size / 2) {
                this.takeDamage(2, player);
                bombs.splice(index, 1);

            }
        });
    }

    checkPlayerDeath() {
        if (this.health <= 0) {
            console.log("Player has died");
            const gameOverModal = document.getElementById('gameOverModal');
            if (gameOverModal) {
                gameOverModal.style.display = 'block'; // Show game over modal
                this.isAlive = false;
            } else {
                console.error("Game over modal element not found");
            }
        }
    }

    updateAnglesDisplay() {
        document.getElementById('sailAngleDisplay').innerText = `Sail Angle: ${this.sailAngle.toFixed(2)}`;
        document.getElementById('angleDisplay').innerText = `Angle: ${this.angle.toFixed(2)}`;
    }

    validSailAngle() {
        //return ((this.sailAngle <= (this.angle - Math.PI * 3/2) % Math.Pi * 2 && this.sailAngle >= ((this.angle - Math.PI / 2) % Math.Pi * 2)));
        let frontOfBoatAngleLeft = (this.angle - Math.PI * 3 / 2);
        console.log(`boat angle left: ${frontOfBoatAngleLeft}`);
        let frontOfBoatAngleRight = (this.angle - Math.PI / 2);
        console.log(`boat angle right: ${frontOfBoatAngleRight}`);
        if (this.sailAngle > frontOfBoatAngleLeft && this.sailAngle < frontOfBoatAngleRight) {
            return true;
        } else {
            return false;
        }

    }

    validSailAnglePortside() {
        let portsideAngle = (this.angle - Math.PI * 3 / 2);
        portsideAngle = (portsideAngle + Math.PI * 2) % (Math.PI * 2);
        console.log(`portside angle: ${portsideAngle}`);
        return this.sailAngle > portsideAngle;
    }

    validSailAngleStarboard() {
        let starboardAngle = (this.angle - Math.PI / 2);
        starboardAngle = (starboardAngle + Math.PI * 2) % (Math.PI * 2);
        console.log(`starboard angle: ${starboardAngle}`);
        return this.sailAngle < starboardAngle;
    }

}

function keyPressed() {
    if (key == 'w') {
        sailTurn += 1;
        //vel = -.05;
        anchor = false;
    }
    if (key == 'a') {
        turn += 1;
        sailTurn += 1;

    }
    if (key == 's') {
        //vel = .05;
        sailTurn -= 1;
        anchor = false;
    }
    if (key == 'd') {
        turn -= 1;
        sailTurn -= 1;
    }
    if (key == 'r') {
        anchor = true;
    }
    if (key == 'p') {
        delozierMode = !delozierMode;
    }
}

//p5 built in function
function keyReleased() {
    if (key == 'w') {
        sailTurn -= 1;
        //gear += .05;
    }
    if (key == 'a') {
        turn -= 1;
        sailTurn -= 1;
    }
    if (key == 's') {
        sailTurn += 1;
        //gear -= .05;
    }
    if (key == 'd') {
        turn += 1;
        sailTurn += 1;
    }
}

//Gamepad basic 4-direction control




// Initial update to display the starting currency
//typeof is requred for the player test to run through nodejs and not have to set up browser testing shit
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', function () {
        player.updateCoinCount();
    });
}

module.exports = Player;