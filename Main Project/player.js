/// Player object
/// used for the player

//let playerImage;
let xMove = 0;
let yMove = 0;

// function preload() {
//     // 	backgroundImage = loadImage("./assets/sea.png");
//         playerImage = loadImage("./assets/shiplvl1Top.png");
//      }

class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.speed = 3;
        this.size = 50;
        this.color = "white";
        this.timer = 0;
		this.currency = parseInt(localStorage.getItem('playerCurrency')) || 100; // Retrieve from localStorage or default to 100
    }

    drawPlayer(playerImage) {
        //fill(this.color);
        image(playerImage, this.x, this.y, this.size, this.size);
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

// Initial update to display the starting currency
document.addEventListener('DOMContentLoaded', function() {
    player.updateCoinCount();
});