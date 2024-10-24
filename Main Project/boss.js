import Enemy from './enemy.js';
class Boss extends Enemy {
    constructor(x, y, health, enemyImage) {
        super(x, y, health, enemyImage);
        this.size = 150; // Boss size
        this.currencyValue = 50; // Boss currency value
        this.attackCooldown = 0; // Cooldown for attacks
    }

    drawBoss() {
        fill(255, 0, 0);
        imageMode(CENTER);
        tint('red');
        image(this.enemyImage, this.x, this.y, this.size, this.size);
        imageMode(CORNER);
        tint('none');
        console.log("Boss health: " + this.health);
    }

    spawnMinions(minionImage) {
        // Spawn smaller enemies
        let minions = [];
        for (let i = 0; i < 5; i++) {
            let minion = new Enemy(this.x + random(-50, 50), this.y + random(-50, 50), 10, minionImage);
            minions.push(minion);
        }
        return minions;
    }

    shootInk(player) {
        // Shoot ink projectile
        let inkProjectile = {
            x: this.x,
            y: this.y,
            speed: 5,
            size: 20,
            move: function() {
                let distanceX = player.x - this.x;
                let distanceY = player.y - this.y;
                let angle = Math.atan2(distanceY, distanceX);
                this.x += this.speed * Math.cos(angle);
                this.y += this.speed * Math.sin(angle);
            },
            draw: function() {
                fill(0);
                ellipse(this.x, this.y, this.size, this.size);
            }
        };
        return inkProjectile;
    }

    tentacleSmash(player) {
        // Tentacle smash attack
        let tentacle = {
            x: this.x,
            y: this.y,
            length: 100,
            width: 20,
            angle: Math.atan2(player.y - this.y, player.x - this.x),
            draw: function() {
                push();
                translate(this.x, this.y);
                rotate(this.angle);
                fill(100, 100, 100);
                rect(0, -this.width / 2, this.length, this.width);
                pop();
            },
            hitPlayer: function() {
                let distance = dist(this.x, this.y, player.x, player.y);
                if (distance < this.length) {
                    player.takeDamage(20); // Example damage value
                }
            }
        };
        return tentacle;
    }

    attack(player, minionImage) {
        if (this.attackCooldown <= 0) {
            let attackType = Math.floor(Math.random() * 3);
            switch (attackType) {
                case 0:
                    return this.spawnMinions(minionImage);
                case 1:
                    return this.shootInk(player);
                case 2:
                    return this.tentacleSmash(player);
            }
            this.attackCooldown = 100; // Example cooldown value
        } else {
            this.attackCooldown--;
        }
    }
}

export default Boss;