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
        this.speed = parseInt(localStorage.getItem('speed')) || 3;  //speed of the boat in pixels (how many pixels it moves in one tic)
        this.sizeH = 40;          //height of the test rectangle
        this.sizeW = 20;          //width of the test rectangle
        this.size = 45;
        this.turningSpeed = 0.075;  //how fast the boat will turn (radians per sec?)
        this.timer = 0;
        this.angle = 0;             //angle of the boat in radians
		this.currency = parseInt(localStorage.getItem('playerCurrency')) || 100; // Retrieve from localStorage or default to 100
        this.hitEnemy = false;
        this.hitIsland = false;
        // this.playerImage;
		this.health = parseInt(localStorage.getItem('playerHealth')) || 10;
		this.lastCollisionTime = 0; //Tracks the time of last collision
        this.cannonDamage = parseInt(localStorage.getItem('cannons')) || 1;
        this.inked = false;
    }

    drawPlayer() {
        push();
        translate(this.x,this.y);
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
        islands.forEach((island, index) => {
            this.hitIsland = this.isColliding(island);
            // console.log(hit)
        });
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

    checkPlayerDeath() {
        if (this.health <= 0) {
            window.location.href = 'gameover.html'; // Navigate to gameover.html
        }
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

