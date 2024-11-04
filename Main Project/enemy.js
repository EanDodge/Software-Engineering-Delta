/// Enemy object
/// used for the enemy



class Enemy {
    constructor(x, y, health, enemyImage) {
        this.x = x;
        this.y = y;
        this.speed = 2;
        this.size = 75;
        this.collision = true;
        this.health = health;
		this.currencyValue = 5;							// Currency value of the enemy
        this.playerimage = enemyImage;
		this.string;
    }

    drawEnemy() {
        fill(255, 0, 0);
        imageMode(CENTER);  //sets the image to be drawn ontop of the enemy x, y
        //tint('green');
        image(this.playerimage, this.x, this.y, this.size, this.size);
        imageMode(CORNER);  //returns draw mode to default
        tint('none');
		    console.log("Enemy health: " + this.health);

		// fill(255, 0, 0); // Set the fill color to red
        // ellipseMode(CENTER); // Set the ellipse mode to center
        // ellipse(this.x, this.y, this.size, this.size); // Draw a red circle
        // console.log("Enemy health: " + this.health);

    }

    moveEnemy(player) {
        let distanceX = player.x - this.x;
        let distanceY = player.y - this.y;
        let angle = 90;
        if (distanceX !== 0) {
            angle = Math.atan(distanceY / distanceX);
        }


        let moveX = this.speed * Math.cos(angle);
        let moveY = this.speed * Math.sin(angle);

        //multiply by sign of distance x because trig or something
        this.x += moveX * Math.sign(distanceX);
        this.y += moveY * Math.sign(distanceX);
    }

    checkCollisionProjectiles(projectiles, player) {
        projectiles.forEach((projectile, index) => {
            //distance formuala between enemy and projectile midpoints
            let distance = Math.sqrt((projectile.x - this.x) * (projectile.x - this.x)
                + (projectile.y - this.y) * (projectile.y - this.y));

            if (distance < projectile.size / 2 + this.size / 2) {
                this.health -= player.cannonDamage;
				console.log("Enemy hit! Health: " + this.health);
                projectiles.splice(index, 1);
				
            }
        });
    }
}

module.exports = Enemy;