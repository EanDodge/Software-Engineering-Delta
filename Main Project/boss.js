//import Enemy from './enemy.js';
class Boss {
    constructor(x, y) {
       this.x = x;
	   this.y = y;
        this.size = 150; // Boss size
        this.currencyValue = 50; // Boss currency value
        this.attackCooldown = 0; // Cooldown for attacks
		this.lastAttackTime = 0;
		this.bossImage;
    }

    drawBoss() {
        fill(255, 0, 0);
        imageMode(CENTER);  //sets the image to be drawn ontop of the enemy x, y
        image(bossImage, this.x, this.y, this.size, this.size);
        imageMode(CORNER);  //returns draw mode to default
        tint('none');
		
    }

    spawnMinions() {
        // Spawn smaller enemies
        let minions = [];
        for (let i = 0; i < 5; i++) {
            let minion = new Enemy(this.x + random(-50, 50), this.y + random(-50, 50), 1);
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
		// Set ink effect duration
        inkEffectDuration = 3000; // 3 seconds
        return inkProjectile;
    }

    tentacleSmash(player) {
        // Tentacle smash attack
        let tentacle = {
            x: this.x,
            y: this.y,
            length: 300,
            width: 20,
            angle: Math.atan2(player.y - this.y, player.x - this.x),
			creationTime: millis(),
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
            },
			isExpired: function() {
				return millis() - this.creationTime >= 1000;
			}
        };
        return tentacle;
    }

    attack(player, minionImage) {
		const currentTime = millis();
        if (currentTime - this.lastAttackTime >= 5000) {
			this.lastAttackTime = currentTime;
            let attackType = Math.floor(Math.random() * 3);
            switch (attackType) {
                case 0:
					console.log("Spawning minions");
                    return this.spawnMinions(minionImage);
                case 1:
					console.log("Shooting ink");
                    return this.shootInk(player);
                case 2:
					console.log("Tentacle smash");
                    return this.tentacleSmash(player);
            }
            
        }
    }
}

//export default Boss;