/// Enemy object
/// used for the enemy

class Enemy {
    constructor(x, y, health, enemyImage) {
        this.x = x;
        this.y = y;
        this.speed = 0.5;
        this.size = 75;
        this.collision = true;
        this.angle = 0;  // Angle the enemy is traveling
        this.health = health;
		this.currencyValue = 5;							// Currency value of the enemy
        this.playerimage = enemyImage;
		this.string;
    }

    drawEnemy() {
        fill(255, 0, 0);
        imageMode(CENTER);  //sets the image to be drawn ontop of the enemy x, y
        //tint('green');
        image(enemyImage, this.x, this.y, this.size, this.size);
        imageMode(CORNER);  //returns draw mode to default
        tint('none');
		    console.log("Enemy health: " + this.health);

		// fill(255, 0, 0); // Set the fill color to red
        // ellipseMode(CENTER); // Set the ellipse mode to center
        // ellipse(this.x, this.y, this.size, this.size); // Draw a red circle
        // console.log("Enemy health: " + this.health);

    }

    drawMinion() {
        fill(255, 0, 0);
        imageMode(CENTER);  //sets the image to be drawn ontop of the enemy x, y
        //tint('green');
        image(minionImage, this.x, this.y, this.size, this.size);
        imageMode(CORNER);  //returns draw mode to default
        tint('none');
		    console.log("Enemy health: " + this.health);

		// fill(255, 0, 0); // Set the fill color to red
        // ellipseMode(CENTER); // Set the ellipse mode to center
        // ellipse(this.x, this.y, this.size, this.size); // Draw a red circle
        // console.log("Enemy health: " + this.health);

    }

    moveEnemy(player) {
        // Calculate the distance between the enemy and the player
        let distanceX = player.x - this.x;
        let distanceY = player.y - this.y;

        // Calculate the angle in radians (atan2 handles cases where distanceX is 0)
        this.angle = Math.atan2(distanceY, distanceX);

        // Calculate the movement in the x and y direction based on the angle
        let moveX = this.speed * Math.cos(this.angle);
        let moveY = this.speed * Math.sin(this.angle);

        // Update the enemy's position
        this.x += moveX;
        this.y += moveY;
    }

    checkCollisionProjectiles(projectiles, player) {
        projectiles.forEach((projectile, index) => {
            // Calculate the distance between the enemy and the projectile using the distance formula
            let distance = Math.sqrt((projectile.x - this.x) * (projectile.x - this.x) +
                (projectile.y - this.y) * (projectile.y - this.y));

            // Check if there is a collision
            if (distance < projectile.size / 2 + this.size / 2) {
                this.health -= player.cannonDamage;
				console.log("Enemy hit! Health: " + this.health);
                projectiles.splice(index, 1);
				
            }
        });
    }
}

module.exports = Enemy;
