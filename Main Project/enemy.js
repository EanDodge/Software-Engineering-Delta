/// Enemy object
/// used for the enemy



class Enemy {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.speed = 2;
        this.size = 40;
        this.collision = true;
        this.health = 3;
    }

    drawEnemy() {
        fill(255, 0, 0);
        ellipse(this.x, this.y, this.size, this.size);
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

    checkCollisionProjectiles(projectiles) {
        projectiles.forEach((projectile, index) => {
            //distance formuala between enemy and projectile midpoints
            let distance = Math.sqrt((projectile.x - this.x) * (projectile.x - this.x)
                + (projectile.y - this.y) * (projectile.y - this.y));

            if (distance < projectile.size / 2 + this.size / 2) {
                this.health--;
                projectiles.splice(index, 1);
            }
        });
    }
}