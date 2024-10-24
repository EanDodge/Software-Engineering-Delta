// Player object
// used for the player

//used for key inputs
let xMove = 0;
let yMove = 0;
let turn = 0;
let vel = 0;
let anchor = false;

class Player {

    constructor(x, y) {
        this.x = x;                 //current x
        this.y = y;                 //current y
        this.speed = parseInt(localStorage.getItem('speed')) || 2;  //speed of the boat in pixels (how many pixels it moves in one tic)
        //this.sizeH = 40;          //height of the test rectangle
        //this.sizeW = 20;          //width of the test rectangle
        this.size = 45;
        this.turningSpeed = 0.075;  //how fast the boat will turn (radians per sec?)
        this.timer = 0;
        this.angle = 0;             //angle of the boat in radians
		    this.currency = parseInt(localStorage.getItem('playerCurrency')) || 100; // Retrieve from localStorage or default to 100
        this.hitEnemy = false;
        this.hitIsland = false;
        this.playerImage;
		    this.health = 10;
		    this.lastCollisionTime = 0; //Tracks the time of last collision
        
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
            let testPlayer = new Player  (testMapX/2, testMapY/2);
            if(testPlayer.x != testMapX/2) {
                return "failed";
            }
            if(testPlayer.y != testMapY/2) {
                return "failed";
            }
            if(!(testPlayer.speed != 0)) {
                return "failed";
            }
            if(!(testPlayer.size != 0)) {
                return "failed";
            }
            if(!(testPlayer.turningSpeed != 0)) {
                return "failed";
            }
        }
        return "passed";
    }

    drawPlayer() {
        push();
        translate(this.x,this.y);
        rotate(-this.angle);
        //fill(186,184,80);
        //rectMode(CENTER);
        //rect(0, 0, this.sizeW, this.sizeH);
        imageMode(CENTER);
        if (this.hitEnemy) {
            //image(playerHitImage, 0, 0, this.size, this.size)
            tint('red');
            image(this.playerImage, 0, 0, this.size, this.size)
        }
        else {
            image(this.playerImage, 0, 0, this.size, this.size)
        }
        rotate(this.angle);
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
            if ( yMove < 0) yMove = -1;
            if ( yMove > 0) yMove = 1;
        }
        if(anchor){
            yMove = 0;
        }

        //make sure angle is calculated first!
        this.angle += this.turningSpeed * turn;
        //print(yMove);
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
        let testMapX = 500;
        let testMapY = 400;
        //Test Framework
        {
            //puts player into middle of map
            let testPlayer = new Player (testMapX/2, testMapY/2);

            //make sure player starts where it should start
            if(!(testPlayer.x == testMapX/2)) {
                return "failed";
            }
            if(!(testPlayer.y == testMapY/2)) {
                return "failed";
            }
        }
        //Tests that player moves forward, and coordinates are calculated correctly
        {
            //puts player into middle of map
            let testPlayer = new Player (testMapX/2, testMapY/2);

            //make player move forward (yes -1 is forward dont ask)
            yMove = -1;
            testPlayer.movePlayer();

            if(!(testPlayer.x == testMapX/2)) {
                return "failed";
            }
            if(!(testPlayer.y == testMapY/2 - testPlayer.speed)) {
                return "failed";
            }


            //reset yMove after done
            yMove = 0;
        }
        //Tests that player moves backwards, and coordinates are calculated correctly
        {
            //puts player into middle of map
            let testPlayer = new Player (testMapX/2, testMapY/2);

            //make player move backward
            yMove = 1;
            testPlayer.movePlayer();

            if(!(testPlayer.x == testMapX/2)) {
                return "failed";
            }
            if(!(testPlayer.y == testMapY/2 + testPlayer.speed)) {
                return "failed";
            }

            //reset yMove after done
            yMove = 0;
        }
        //Tests that player turns clockwise
        {
            //puts player into middle of map
            let testPlayer = new Player (testMapX/2, testMapY/2);

            //make player turn clockwise
            turn = -1;
            testPlayer.movePlayer();

            if(!(testPlayer.x == testMapX/2)) {
                return "failed";
            }
            if(!(testPlayer.y == testMapY/2)) {
                return "failed";
            }
            if(!(testPlayer.angle == -1 * testPlayer.turningSpeed)) {
                return "failed";
            }


            //reset turn after done
            turn = 0;
        }
        //tests that player turns counter-clockwise
        {
            //puts player into middle of map
            let testPlayer = new Player (testMapX/2, testMapY/2);

            //make player turn counter-clockwise (yes turn is counter intuitave)
            turn = 1;
            testPlayer.movePlayer();

            if(!(testPlayer.x == testMapX/2)) {
                return "failed";
            }
            if(!(testPlayer.y == testMapY/2)) {
                return "failed";
            }
            if(!(testPlayer.angle == testPlayer.turningSpeed)) {
                return "failed";
            }

            //reset turn after done
            turn = 0;
        }
        //Tests that coordinate calculation with a turning input is working (cw - F)
        {
            //puts player into middle of map
            let testPlayer = new Player (testMapX/2, testMapY/2);

            //make player turn clockwise and move forward  
            turn = 1;
            yMove = -1;
            testPlayer.movePlayer();

            if(!(testPlayer.x ==  (testMapX/2) + 
                                            testPlayer.speed * sin(testPlayer.angle) * yMove)) {
                                                return "failed";
                                            }
            if(!(testPlayer.y ==  (testMapY/2) + 
                                            testPlayer.speed * cos(testPlayer.angle) * yMove)) {
                                                return "failed";
                                            }
            if(!(testPlayer.angle == testPlayer.turningSpeed)) {
                return "failed";
            }
            //reset turn after done
            turn = 0;
            yMove = 0;
        }
        //Tests that coordinate calculation with a turning input is working (ccw - F)
        {
            //puts player into middle of map
            let testPlayer = new Player (testMapX/2, testMapY/2);

            //make player turn counter-clockwise and move forward  
            turn = -1;
            yMove = -1;
            testPlayer.movePlayer();

            if(!(testPlayer.x ==  (testMapX/2) + 
                                            testPlayer.speed * sin(testPlayer.angle) * yMove)) {
                                                return "failed";
                                            }
            if(!(testPlayer.y ==  (testMapY/2) + 
                                            testPlayer.speed * cos(testPlayer.angle) * yMove)) {
                                                return "failed";
                                            }
            if(!(testPlayer.angle == -1 * testPlayer.turningSpeed)) {
                return "failed";
            }
            

            //reset turn after done
            turn = 0;
            yMove = 0;
        }
        //Tests that coordinate calculation with a turning input is working (cw - R)
        {
            //puts player into middle of map
            let testPlayer = new Player (testMapX/2, testMapY/2);

            //make player turn clockwise and move forward  
            turn = 1;
            yMove = 1;
            testPlayer.movePlayer();

            if(!(testPlayer.x ==  (testMapX/2) + 
                                            testPlayer.speed * sin(testPlayer.angle) * yMove)) {
                                                return "failed";
                                            }
            if(!(testPlayer.y ==  (testMapY/2) + 
                                            testPlayer.speed * cos(testPlayer.angle) * yMove)) {
                                                return "failed";
                                            }
            if(!(testPlayer.angle == testPlayer.turningSpeed)) {
                return "failed";
            }
            

            //reset turn after done
            turn = 0;
            yMove = 0;
        }
        //Tests that coordinate calculation with a turning input is working (ccw - R)
        {
            //puts player into middle of map
            let testPlayer = new Player (testMapX/2, testMapY/2);

            //make player turn counter-clockwise and move forward  
            turn = -1;
            yMove = 1;
            testPlayer.movePlayer();

            if(!(testPlayer.x ==  (testMapX/2) + 
                                            testPlayer.speed * sin(testPlayer.angle) * yMove)) {
                                                return "failed";
                                            }
            if(!(testPlayer.y ==  (testMapY/2) + 
                                            testPlayer.speed * cos(testPlayer.angle) * yMove)) {
                                                return "failed";
                                            }
            if(!(testPlayer.angle == -1 * testPlayer.turningSpeed)) {
                return "failed";
            }
            

            //reset turn after done
            turn = 0;
            yMove = 0;
        }

        return "passed";
    }   //testMovePlayer() end

    //a usless function
    checkCollision(gameObject) {
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

    //usless test of usless function
    //assuming that a new game object is not large enough to hit ship when at 0,0 and ship is in middle of map
    testCheckCollision() {
        {
            let testMapX = 500;
            let testMapY = 400;

            let testPlayer = new Player(testMapX/2, testMapY/2);
            let nonInterfearingObj = new GameObject(0,0);
            let interfearingObj = new GameObject(testMapX/2, testMapY/2);
            
            //test collision with no other objects return false
            if(!(testPlayer.checkCollision(nonInterfearingObj) === false)) {
                return "failed";
            }
            //tests that collision with a game object returns true
            if(!(testPlayer.checkCollision(interfearingObj) === true)) {
                return "failed";
            }
        }
        return "passed";
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
        const currentTime = Date.now();
        const collisionCooldown = 1000; // Cooldown period in milliseconds (e.g., 1000ms = 1 second)

        enemies.forEach((enemy) => {
            // Distance formula between enemy and player midpoints
            let distance = Math.sqrt((enemy.x - this.x) * (enemy.x - this.x)
                + (enemy.y - this.y) * (enemy.y - this.y));

            if (distance < enemy.size / 2 + this.size / 2) {
                hit = true;
            }

            if (hit && (currentTime - this.lastCollisionTime) > collisionCooldown) {
                this.takeDamage(1); // Decrease player health by 1
                // console.log(`Player health: ${this.health}`);
                this.lastCollisionTime = currentTime; // Update the last collision time
                if (this.health <= 0) {
                    window.location.href = 'gameover.html'; // Navigate to gameover.html
                }
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

    //assuming enemy is larger than 10
    testCheckCollisionEnemies() {
        {
            let testMapX = 500;
            let testMapY = 400;

            
            let testEnemyNoHit = [new Enemy(0,0)];
            let testEnemyHit = [new Enemy(testMapX/2, testMapY/2)];
            let testEnemyHit2 = [new Enemy(testMapX/2 + 5, testMapY/2 + 5)];


            {
                let testPlayer = new Player(testMapX/2, testMapY/2);
                testPlayer.checkCollisionEnemies(testEnemyHit);
                if(testPlayer.hitEnemy === false) {
                    return "failed";
                }
            }
            {
                let testPlayer = new Player(testMapX/2, testMapY/2);
                testPlayer.checkCollisionEnemies(testEnemyNoHit);
                if(testPlayer.hitEnemy === true) {
                    return "failed";
                }
            }
            {
                let testPlayer = new Player(testMapX/2, testMapY/2);
                testPlayer.checkCollisionEnemies(testEnemyHit2);
                if(testPlayer.hitEnemy === false) {
                    return "failed";
                }
            }
        }
        return "passed";
    }


    checkCollisionIslands(islands) {
        let hit = false;
        islands.forEach((island, index) => {
            //distance formuala between enemy and midpoints
            let distance = Math.sqrt((island.x - this.x) * (island.x - this.x)
                + (island.y - this.y) * (island.y - this.y));

            if (distance < island.size / 2 + this.size / 2) {
                hit = true;
            }
        });

        if (hit) {
            //this.color = "blue";
            this.hitIsland = true;
            if(typeof document !== 'undefined') {   //allows tests to ignore this line
            window.location.href = 'upgrade.html'; // Navigate to upgrades.html
            }
        }
    }

    testCheckCollisionIsland() {
        {
            let testMapX = 500;
            let testMapY = 400;

            let nonInterfearingObj = [new GameObject(0,0)];
            let interfearingObj = [new GameObject(testMapX/2, testMapY/2)];
            
            {
                let testPlayer = new Player(testMapX/2, testMapY/2);
                testPlayer.checkCollisionIslands(nonInterfearingObj);
                if(testPlayer.hitIsland === true) {
                    return "failed";
                }
            }
            {
                let testPlayer = new Player(testMapX/2, testMapY/2);
                testPlayer.checkCollisionIslands(interfearingObj);
                if(testPlayer.hitIsland === false) {
                    return "failed";
                }
            }

        }
        return "passed";
    }

	updateCoinCount() {
        document.getElementById('coinCount').innerText = this.currency;
        localStorage.setItem('playerCurrency', this.currency); // Store in localStorage
		// console.log(player.currency);
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
        this.updateHealthBar();
    }
}

function keyPressed() {
    if (key == 'w') {
        vel = -.05;
        anchor = false;
    }
    if (key == 'a') {
        turn += 1;
    }
    if (key == 's') {
        vel = .05;
        anchor = false;
    }
    if (key == 'd') {
        turn -= 1;
    }
    if (key == 'r'){
        anchor = true;
    }
}

//p5 built in function
function keyReleased() {
    if (key == 'w') {
        //gear += .05;
    }
    if (key == 'a') {
        turn -= 1;
    }
    if (key == 's') {
        //gear -= .05;
    }
    if (key == 'd') {
        turn += 1;
    }
}

//Gamepad basic 4-direction control




// Initial update to display the starting currency
//typeof is requred for the player test to run through nodejs and not have to set up browser testing shit
if(typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', function() {
        player.updateCoinCount();
    });
}

//module.exports = Player;

