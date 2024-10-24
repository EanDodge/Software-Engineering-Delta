/// Enemy object
/// used for the enemy

class Enemy {
    constructor(x, y, health, enemyImage) {
        this.x = x;
        this.y = y;
        this.speed = 2;
        this.size = 75;
        this.collision = true;
        this.angle = 0;  // Angle the enemy is traveling
        this.health = health;
        this.currencyValue = 5;  // Currency value of the enemy
        this.enemyImage = enemyImage;
    }

    drawEnemy() {
        fill(255, 0, 0);
        imageMode(CENTER);  // Sets the image to be drawn at the enemy's center

        // Push and pop to isolate transformations
        push();
        translate(this.x, this.y);  // Move the origin to the enemy's position
        rotate(this.angle + PI / 2);  // Rotate by the angle of movement + 90 degrees (PI / 2 radians)

        tint('green');
        image(this.enemyImage, 0, 0, this.size, this.size);  // Draw image at the new origin (0, 0 after translation)
        pop();  // Restore original transformation state

        //imageMode(CORNER);  // Return draw mode to default
        tint('none');
        console.log("Enemy health: " + this.health);
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

    checkCollisionProjectiles(projectiles) {
        projectiles.forEach((projectile, index) => {
            // Calculate the distance between the enemy and the projectile using the distance formula
            let distance = Math.sqrt((projectile.x - this.x) * (projectile.x - this.x) +
                (projectile.y - this.y) * (projectile.y - this.y));

            // Check if there is a collision
            if (distance < projectile.size / 2 + this.size / 2) {
                this.health--;
                console.log("Enemy hit! Health: " + this.health);
                projectiles.splice(index, 1);  // Remove the projectile from the array
            }
        });
    }
}

module.exports = Enemy;
