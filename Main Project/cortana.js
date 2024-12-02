//import Enemy from './enemy.js';
class Boss {
    constructor(x, y, health, healthBarContainer, healthBar, defeatMessage) {
       this.x = x;
	   this.y = y;
        this.size = 750; // Boss size
        this.currencyValue = 50; // Boss currency value
        this.attackCooldown = 0; // Cooldown for attacks
		this.lastAttackTime = 0;
		this.bossImage;
        this.maxHealth = health;
        this.health = health;
        this.isDead = false;
        this.bossHealthBarContainer = healthBarContainer;
        this.bossHealthBar = healthBar;
        this.defeatMessage = defeatMessage;
        this.awardReceived = false;
		this.harpoon = null;
		this.harpoonImage = './assets/tentacle.png';
    }

    drawBoss() {
        fill(255, 0, 0);
        if (this.isDead) {
            tint(128, 128, 128); // Apply grey tint if the boss is dead
        }
        imageMode(CENTER);  //sets the image to be drawn ontop of the enemy x, y
        image(bossImage, this.x, this.y, this.size, this.size / 2);
        imageMode(CORNER);  //returns draw mode to default
        tint('none');	
    }

    spawnMinions(minionImage) {
		if (this.isDead) return;
        // Spawn smaller enemies
        let minions = [];
        for (let i = 0; i < 5; i++) {
            let minion = new Enemy(this.x + random(-50, 50), this.y + random(-50, 50), 1, minionImage);
            minions.push(minion);
        }
        return minions;
    }

    shootInk(player, projectilesArray, projectileImage) {
		if (this.isDead) return;
        let shipWidth = this.size;
		let projectileCount = 3;
		let projectileSpacing = shipWidth / (projectileCount + 1);
		for (let i = 1; i <= projectileCount; i++) {
			let startX = this.x - shipWidth / 2 + i * projectileSpacing;
			let inkProjectile = {
				x: startX,
				y: this.y + 110,
				speed: 5,
				size: 40,
				damage: 2,
				image: projectileImage,
				move: function() {
					this.y += this.speed;
				},
				draw: function() {
					image(this.image, this.x, this.y, this.size, this.size);
				}
			};
			projectilesArray.push(inkProjectile);
		}
	}

    /*tentacleSmash(player, tentacleImage) {
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
				translate(this.x, this.y); // Move origin to the tentacle's coordinates
				rotate(this.angle); // Rotate by the tentacle's angle
				imageMode(CENTER); // Set image mode to CENTER
				image(tentacleImage, this.length / 2 + 30, -this.width / 2, this.length, this.width); // Draw the tentacle image				
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
    } */

		harpoonAttack(player, harpoonImage) {
			if (this.isDead) return;
			// Harpoon attack
			if (!this.harpoon) {
				this.harpoon = {
					x: this.x,
					y: this.y,
					length: 300,
					width: 20,
					angle: Math.atan2(player.y - this.y, player.x - this.x),
					creationTime: millis(),
					hasHit: false,
					duration: 1000, // Harpoon duration in milliseconds
					// Set up a timer to remove the tentacle after the specified duration
					expireTimeout(){
						setTimeout(() => {
						this.expire();
					}, this.duration)
					},
					expire() {
						this.hasHit = false; // Reset hasHit flag
						// Remove the tentacle from the tentacles array
						tentacles = tentacles.filter(tentacle => tentacle !== this);
						clearTimeout(this.expireTimeout); // Clear the timeout
					},
					draw: function() {
						push();
						translate(this.x, this.y); // Move origin to the harpoon's coordinates
						rotate(this.angle); // Rotate by the harpoon's angle
						imageMode(CENTER); // Set image mode to CENTER
						image(harpoonImage, this.length / 2 + 30, -this.width / 2, this.length, this.width); // Draw the harpoon image
						pop();
					},
					hitPlayer(player) {
						if (!this.hasHit) {
							// Calculate the end point of the tentacle
							let endX = this.x + this.length * cos(this.angle);
							let endY = this.y + this.length * sin(this.angle);
				
							// Check if the player is within the tentacle's reach
							let distance = dist(player.x, player.y, endX, endY);
							if (distance < player.size / 2) {
								player.takeDamage(1);
								this.hasHit = true;
								return true;
							}
						}
						return false;
					},
					isExpired: function() {
						return millis() - this.creationTime >= this.duration;
					},
					dragPlayer: function(player) {
						// Apply a force to drag the player closer to the boss
						let forceX = (this.x - player.x) * 0.25;
						let forceY = (this.y - player.y) * 0.25;
						player.x += forceX;
						player.y += forceY;
					},
					resetHit: function() {
						setInterval(() => {
							this.hasHit = false;
						}, 1000);
					}
				};
			}
			// Check for collision and drag the player if hit
			/*if (this.harpoon.hitPlayer()) {
				this.draw();
				player.takeDamage(1);
				this.harpoon.dragPlayer(player);
			}*/
			return this.harpoon;
		}

    attack(player, minionImage, tentacleImage, projectilesArray, projectileImage) {
		const currentTime = millis();
        if (currentTime - this.lastAttackTime >= 5000) {
			this.lastAttackTime = currentTime;
            let attackType = Math.floor(Math.random() * 3);
			//let attackType = 2;
            switch (attackType) {
                case 0:
					console.log("Spawning minions");
                    return this.spawnMinions(minionImage);
                case 1:
					console.log("Shooting ink");
                    return this.shootInk(player, projectilesArray);
                case 2:
					console.log("Tentacle smash");
                    return this.harpoonAttack(player, tentacleImage);
            }
            
        }
    }

    checkCollisionProjectiles(projectiles, player) {
        projectiles.forEach((projectile, index) => {
            //distance formuala between enemy and projectile midpoints
            let distance = Math.sqrt((projectile.x - this.x) * (projectile.x - this.x)
                + (projectile.y - this.y) * (projectile.y - this.y));

            if (distance < projectile.size / 2 + this.size / 2) {
                this.takeDamage(1, player);
				console.log("Enemy hit! Health: " + this.health);
                projectiles.splice(index, 1);
				
                
            }
        });
    }

	checkCollision(projectile, player) {
		projectiles.forEach((projectile, index) => {
			// Adjust the hitbox dimensions and position
			let hitboxX = this.x - this.size / 2;
			let hitboxY = this.y - this.size / 4;
			let hitboxWidth = this.size;
			let hitboxHeight = this.size / 2;
		
			
			
			// Log the projectile and hitbox coordinates
			//console.log(`Projectile: (${projectile.x}, ${projectile.y})`);
			//console.log(`Hitbox: (${hitboxX}, ${hitboxY}, ${hitboxWidth}, ${hitboxHeight})`);

			// Check if the projectile is within the hitbox
			if (projectile.x > hitboxX && projectile.x < hitboxX + hitboxWidth &&
				projectile.y > hitboxY && projectile.y < hitboxY + hitboxHeight) {
				//console.log("Enemy hit!");
				this.takeDamage(1, player);
				//console.log("Enemy hit! Health: " + this.health);
				projectiles.splice(index, 1);
			}
		});
	}

    updateHealthBar() {
        this.bossHealthBarContainer.style.display = 'block';
        const healthPercentage = (this.health / this.maxHealth) * 100;
        this.bossHealthBar.style.width = `${healthPercentage}%`;
    }

    // Call this method whenever the player's health changes
    takeDamage(amount, player) {
        this.health -= amount;
        if (this.health < 0) this.health = 0;
        this.updateHealthBar();
        if (this.health <= 0) {
            this.death(player);
        }
    }

    death(player) {

        this.isDead = true;

        // Make the boss disappear after a short delay
        setTimeout(() => {
            this.x = -9999;
            this.y = -9999;
            this.bossHealthBarContainer.style.display = 'none';
        }, 3000);

        
        
        this.defeatMessage.classList.remove('hidden');
        
        setTimeout(() => {
            this.defeatMessage.classList.add('hidden');
        }, 5000);
    }
}

module.exports = Boss;