// Player object
// used for the player

//used for key inputs
let xMove = 0;
let yMove = 0;
let turn = 0;
let sailTurn = 0;
let vel = 0;
let anchor = false;

class Player {

    constructor(x, y) {
        this.x = x;                 //current x
        this.y = y;                 //current y
        this.speed = parseInt(localStorage.getItem('speed')) || 3;  //speed of the boat in pixels (how many pixels it moves in one tic)
        //this.sizeH = 40;          //height of the test rectangle
        //this.sizeW = 20;          //width of the test rectangle
        this.size = 45;
        this.turningSpeed = 0.075;  //how fast the boat will turn (radians per sec?)
        this.timer = 0;
        this.angle = Math.PI * 2;             //angle of the boat in radians
        this.currency = parseInt(localStorage.getItem('playerCurrency')) || 100; // Retrieve from localStorage or default to 100
        this.hitEnemy = false;
        this.hitIsland = false;
        this.playerImage;
        this.health = parseInt(localStorage.getItem('playerHealth')) || 10;
        this.lastCollisionTime = 0; //Tracks the time of last collision
        this.cannonDamage = parseInt(localStorage.getItem('cannons')) || 1;
        this.inked = false;
        this.rudderAngle = 0;
        this.sailAngle = Math.PI;


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

    drawRudderAndSails() {
        push();
        fill(255, 128, 13);
        translate(this.x - 350, this.y - 250);
        rotate(-this.rudderAngle);
        rectMode(CENTER);
        rect(0, 0, 10, 50);
        rectMode(CORNER);
        pop();

        push();
        fill(255, 255, 255);
        translate(this.x, this.y);
        rotate(-(this.sailAngle));
        rect(-2.5, -47.5, 5, 50);
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

        if (this.validSailAnglePortside() && this.validSailAngleStarboard()) {
            this.sailAngle = newSailAngle;

        } else if (!this.validSailAnglePortside()) {
            this.sailAngle += 0.01;
        } else if (!this.validSailAngleStarboard()) {
            this.sailAngle -= 0.01;
        }
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

    testMovePlayer() {
        let testMapX = 500;
        let testMapY = 400;
        //Test Framework
        {
            //puts player into middle of map
            let testPlayer = new Player(testMapX / 2, testMapY / 2);

            //make sure player starts where it should start
            if (!(testPlayer.x == testMapX / 2)) {
                return "failed";
            }
            if (!(testPlayer.y == testMapY / 2)) {
                return "failed";
            }
        }
        //Tests that player moves forward, and coordinates are calculated correctly
        {
            //puts player into middle of map
            let testPlayer = new Player(testMapX / 2, testMapY / 2);

            //make player move forward (yes -1 is forward dont ask)
            yMove = -1;
            testPlayer.movePlayer();

            if (!(testPlayer.x == testMapX / 2)) {
                return "failed";
            }
            if (!(testPlayer.y == testMapY / 2 - testPlayer.speed)) {
                return "failed";
            }


            //reset yMove after done
            yMove = 0;
        }
        //Tests that player moves backwards, and coordinates are calculated correctly
        {
            //puts player into middle of map
            let testPlayer = new Player(testMapX / 2, testMapY / 2);

            //make player move backward
            yMove = 1;
            testPlayer.movePlayer();

            if (!(testPlayer.x == testMapX / 2)) {
                return "failed";
            }
            if (!(testPlayer.y == testMapY / 2 + testPlayer.speed)) {
                return "failed";
            }

            //reset yMove after done
            yMove = 0;
        }
        //Tests that player turns clockwise
        {
            //puts player into middle of map
            let testPlayer = new Player(testMapX / 2, testMapY / 2);

            //make player turn clockwise
            turn = -1;
            testPlayer.movePlayer();

            if (!(testPlayer.x == testMapX / 2)) {
                return "failed";
            }
            if (!(testPlayer.y == testMapY / 2)) {
                return "failed";
            }
            if (!(testPlayer.angle == -1 * testPlayer.turningSpeed)) {
                return "failed";
            }


            //reset turn after done
            turn = 0;
        }
        //tests that player turns counter-clockwise
        {
            //puts player into middle of map
            let testPlayer = new Player(testMapX / 2, testMapY / 2);

            //make player turn counter-clockwise (yes turn is counter intuitave)
            turn = 1;
            testPlayer.movePlayer();

            if (!(testPlayer.x == testMapX / 2)) {
                return "failed";
            }
            if (!(testPlayer.y == testMapY / 2)) {
                return "failed";
            }
            if (!(testPlayer.angle == testPlayer.turningSpeed)) {
                return "failed";
            }

            //reset turn after done
            turn = 0;
        }
        //Tests that coordinate calculation with a turning input is working (cw - F)
        {
            //puts player into middle of map
            let testPlayer = new Player(testMapX / 2, testMapY / 2);

            //make player turn clockwise and move forward  
            turn = 1;
            yMove = -1;
            testPlayer.movePlayer();

            if (!(testPlayer.x == (testMapX / 2) +
                testPlayer.speed * sin(testPlayer.angle) * yMove)) {
                return "failed";
            }
            if (!(testPlayer.y == (testMapY / 2) +
                testPlayer.speed * cos(testPlayer.angle) * yMove)) {
                return "failed";
            }
            if (!(testPlayer.angle == testPlayer.turningSpeed)) {
                return "failed";
            }
            //reset turn after done
            turn = 0;
            yMove = 0;
        }
        //Tests that coordinate calculation with a turning input is working (ccw - F)
        {
            //puts player into middle of map
            let testPlayer = new Player(testMapX / 2, testMapY / 2);

            //make player turn counter-clockwise and move forward  
            turn = -1;
            yMove = -1;
            testPlayer.movePlayer();

            if (!(testPlayer.x == (testMapX / 2) +
                testPlayer.speed * sin(testPlayer.angle) * yMove)) {
                return "failed";
            }
            if (!(testPlayer.y == (testMapY / 2) +
                testPlayer.speed * cos(testPlayer.angle) * yMove)) {
                return "failed";
            }
            if (!(testPlayer.angle == -1 * testPlayer.turningSpeed)) {
                return "failed";
            }


            //reset turn after done
            turn = 0;
            yMove = 0;
        }
        //Tests that coordinate calculation with a turning input is working (cw - R)
        {
            //puts player into middle of map
            let testPlayer = new Player(testMapX / 2, testMapY / 2);

            //make player turn clockwise and move forward  
            turn = 1;
            yMove = 1;
            testPlayer.movePlayer();

            if (!(testPlayer.x == (testMapX / 2) +
                testPlayer.speed * sin(testPlayer.angle) * yMove)) {
                return "failed";
            }
            if (!(testPlayer.y == (testMapY / 2) +
                testPlayer.speed * cos(testPlayer.angle) * yMove)) {
                return "failed";
            }
            if (!(testPlayer.angle == testPlayer.turningSpeed)) {
                return "failed";
            }


            //reset turn after done
            turn = 0;
            yMove = 0;
        }
        //Tests that coordinate calculation with a turning input is working (ccw - R)
        {
            //puts player into middle of map
            let testPlayer = new Player(testMapX / 2, testMapY / 2);

            //make player turn counter-clockwise and move forward  
            turn = -1;
            yMove = 1;
            testPlayer.movePlayer();

            if (!(testPlayer.x == (testMapX / 2) +
                testPlayer.speed * sin(testPlayer.angle) * yMove)) {
                return "failed";
            }
            if (!(testPlayer.y == (testMapY / 2) +
                testPlayer.speed * cos(testPlayer.angle) * yMove)) {
                return "failed";
            }
            if (!(testPlayer.angle == -1 * testPlayer.turningSpeed)) {
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

            let testPlayer = new Player(testMapX / 2, testMapY / 2);
            let nonInterfearingObj = new GameObject(0, 0);
            let interfearingObj = new GameObject(testMapX / 2, testMapY / 2);

            //test collision with no other objects return false
            if (!(testPlayer.checkCollision(nonInterfearingObj) === false)) {
                return "failed";
            }
            //tests that collision with a game object returns true
            if (!(testPlayer.checkCollision(interfearingObj) === true)) {
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
                console.log(`Player health: ${this.health}`);
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

    //assuming enemy is larger than 10
    testCheckCollisionEnemies() {
        {
            let testMapX = 500;
            let testMapY = 400;


            let testEnemyNoHit = [new Enemy(0, 0)];
            let testEnemyHit = [new Enemy(testMapX / 2, testMapY / 2)];
            let testEnemyHit2 = [new Enemy(testMapX / 2 + 5, testMapY / 2 + 5)];


            {
                let testPlayer = new Player(testMapX / 2, testMapY / 2);
                testPlayer.checkCollisionEnemies(testEnemyHit);
                if (testPlayer.hitEnemy === false) {
                    return "failed";
                }
            }
            {
                let testPlayer = new Player(testMapX / 2, testMapY / 2);
                testPlayer.checkCollisionEnemies(testEnemyNoHit);
                if (testPlayer.hitEnemy === true) {
                    return "failed";
                }
            }
            {
                let testPlayer = new Player(testMapX / 2, testMapY / 2);
                testPlayer.checkCollisionEnemies(testEnemyHit2);
                if (testPlayer.hitEnemy === false) {
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
            // if(typeof document !== 'undefined') {   //allows tests to ignore this line
            // window.location.href = 'islandIndex.html'; // Navigate to upgrades.html
            // }
        }
    }

    testCheckCollisionIsland() {
        {
            let testMapX = 500;
            let testMapY = 400;

            let nonInterfearingObj = [new GameObject(0, 0)];
            let interfearingObj = [new GameObject(testMapX / 2, testMapY / 2)];

            {
                let testPlayer = new Player(testMapX / 2, testMapY / 2);
                testPlayer.checkCollisionIslands(nonInterfearingObj);
                if (testPlayer.hitIsland === true) {
                    return "failed";
                }
            }
            {
                let testPlayer = new Player(testMapX / 2, testMapY / 2);
                testPlayer.checkCollisionIslands(interfearingObj);
                if (testPlayer.hitIsland === false) {
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

            if (distance < bomb.size / 2 + this.size / 2) {
                this.takeDamage(2, player);
                bombs.splice(index, 1);
            }
        });
    }

    checkPlayerDeath() {
        if (this.health <= 0) {
            window.location.href = 'gameover.html'; // Navigate to gameover.html
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

//module.exports = Player;

