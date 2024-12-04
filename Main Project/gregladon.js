//import Enemy from './enemy.js';
class Boss {
    constructor(x, y, health, healthBarContainer, healthBar, defeatMessage) {
       this.x = x;
	   this.y = y;
        this.size = 500; // Boss size
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
		this.speed = .5;
		this.angle;
		this.closestPoint = { x: this.x, y: this.y };
		this.collided = false;
		this.gregladonImage;
		this.fadeAmount = 0; // Initialize fade amount
        this.fading = false; // Initialize fading state
    }

    /*drawBoss() {
        fill(255, 0, 0);
        if (this.isDead) {
            tint(128, 128, 128); // Apply grey tint if the boss is dead
        }
        imageMode(CENTER);  //sets the image to be drawn ontop of the enemy x, y
        image(bossImage, this.x, this.y, this.size, this.size / 2);
        imageMode(CORNER);  //returns draw mode to default
        tint('none');	
    }*/
		drawBoss() {
			fill(255, 0, 0);
			if (this.isDead) {
				tint(128, 128, 128); // Apply grey tint if the boss is dead
			}
			push(); // Save the current drawing state
			translate(this.x, this.y); // Move the origin to the enemy's position
			rotate(this.angle); // Rotate the canvas by the angle toward the player
			imageMode(CENTER); // Set the image mode to CENTER
			if (this.collided) {
				if (this.fadeAmount < 255) {
					this.fadeAmount += 5; 
				}
				tint(255, 255 - this.fadeAmount);
				image(bossImage, 0, 0, this.size, this.size / 2); // Draw the image at the new origin
				tint(255, this.fadeAmount);
				rotate(radians(270));
				image(this.gregladonImage, 0, 150, this.size, this.size / 2); // Draw the image at the new origin
				pop();
			} else {
				image(bossImage, 0, 0, this.size, this.size / 2); // Draw the image at the new origin
			}
			
			pop(); // Restore the original drawing state
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

   /* shootInk(player, projectilesArray, projectileImage) {
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
	}*/

	moveProjectile(projectile) {
		
	}

	shootInk(player, projectilesArray, projectileImage) {
		if (this.isDead) return;
        let sharkWidth = this.size;
		let sharkHeight = this.size / 2;
		let projectileCount = 1;
		let projectileSpacing = sharkWidth / (projectileCount + 1);
		for (let i = 1; i <= projectileCount; i++) {
			let offsetY = sharkWidth / 2; // Start from the furthest right side of the boss
			let offsetX = -sharkWidth / 2 + i * projectileSpacing; // Center the projectiles on the boss
            let startX = 120 + this.x + offsetY * cos(this.angle) - sharkHeight / 2 * sin(this.angle);
			console.log("StartX: " + startX);
            let startY = this.y + offsetY * sin(this.angle) + sharkHeight / 2 * cos(this.angle);
			console.log("StartY: " + startY);
			console.log("closestPoint: " + this.closestPoint.x + ", " + this.closestPoint.y);
            let inkProjectile = {
                x: startX,
                y: startY,
                speed: 5,
                size: 40,
                damage: 2,
                angle: this.angle,
                image: projectileImage,
                move: function() {
					//console.log("Moving ink projectile");
                    this.x += this.speed * cos(this.angle);
					this.y += this.speed * sin(this.angle);
                },
                draw: function() {
					//console.log("Drawing ink projectile");
                    push();
                    translate(this.x, this.y);
                    rotate(this.angle + 180);
                    imageMode(CENTER);
                    image(this.image, 0, 0, this.size, this.size);
                    pop();
                }
            };
            projectilesArray.push(inkProjectile);
        }
    }
	
	


	moveBoss(player, gregladonImage) {
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

		this.updateClosestPoint(player);

		return this.checkCollisionWithPlayer(player, gregladonImage);
    }
	checkCollisionWithPlayer(player, gregladonImage) {
        // Calculate the distance between the boss and the player
        let distance = dist(this.x, this.y, player.x, player.y + 50);

        // Check if the distance is less than the sum of their radii (collision detection)
        if (distance < this.size / 2 + player.size / 2) {
            player.health = 0; // Instantly kill the player
			this.collided = true;
        }
    }

	updateClosestPoint(player) {
        // Calculate the closest point on the boss's bounding box to the player
        let halfWidth = this.size / 2;
        let halfHeight = this.size / 4;

        // Calculate the rotated corners of the bounding box
        let corners = [
            { x: -halfWidth, y: -halfHeight },
            { x: halfWidth, y: -halfHeight },
            { x: halfWidth, y: halfHeight },
            { x: -halfWidth, y: halfHeight }
        ];

        // Rotate the corners by the boss's angle
        corners = corners.map(corner => {
            let x = corner.x * cos(this.angle) - corner.y * sin(this.angle);
            let y = corner.x * sin(this.angle) + corner.y * cos(this.angle);
            return { x: this.x + x, y: this.y + y };
        });

        // Find the closest point on the bounding box to the player
        let closestPoint = corners[0];
        let minDistance = dist(player.x, player.y, closestPoint.x, closestPoint.y);
        for (let i = 1; i < corners.length; i++) {
            let distance = dist(player.x, player.y, corners[i].x, corners[i].y);
            if (distance < minDistance) {
                closestPoint = corners[i];
                minDistance = distance;
            }
        }

        // Update the closest point variable
        this.closestPoint = closestPoint;
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

		harpoonAttack(player, harpoonImage, harpoonArray) {
			if (this.isDead) return;
			// Harpoon attack
			
				let harpoon = {
					x: this.x,
					y: this.y,
					length: 300,
					width: 20,
					angle: Math.atan2(player.y - this.y, player.x - this.x),
					creationTime: millis(),
					hasHit: false,
					duration: 1000, // Harpoon duration in milliseconds
					// Set up a timer to remove the tentacle after the specified duration
					draw: function() {
						push();
						translate(this.x, this.y); // Move origin to the harpoon's coordinates
						rotate(this.angle); // Rotate by the harpoon's angle
						imageMode(CENTER); // Set image mode to CENTER
						image(harpoonImage, this.length / 2 + 30, -this.width / 2, this.length, this.width); // Draw the harpoon image
						pop();
					},				
					dragPlayer: function(player) {
						// Apply a force to drag the player closer to the boss
						let forceX = (this.x - player.x) * 0.25;
						let forceY = (this.y - player.y) * 0.25;
						player.x += forceX;
						player.y += forceY;
					}
					
				};
			
			harpoonArray.push(harpoon);
			console.log("harpoon array size in function: " + harpoonArray.length);
		}

    attack(player, minionImage, tentacleImage, projectilesArray, projectileImage, harpoonArray) {
		const currentTime = millis();
        if (currentTime - this.lastAttackTime >= 5000) {
			this.lastAttackTime = currentTime;
            let attackType = Math.floor(Math.random() * 2);
			//let attackType = 1;
            switch (attackType) {
                case 0:
					console.log("minions assemble");
                    return this.spawnMinions(minionImage);					
                case 1:					
                    this.shootInk(player, projectilesArray);
					console.log("cannon attack");
					break;
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