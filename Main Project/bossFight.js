
//  import Enemy from './enemy.js';
//  import Boss from './boss.js';
//  import Player from './player.js';

// const boss = new Boss(300, 300, 200, 'bossImage');
// let minions = [];
// let inkProjectiles = [];
// let tentacles = [];

// const mapXSize = 500;
// const mapYSize = 500;

// let player = new Player(mapXSize/2, mapYSize/2);

// let enemies = [];

// let gameObjects = [];

// let projectiles = [];

// let frameCount = 0;

// let projectileFrameCount = 0;

//  //let playerImage; made playerimage part of the player object

//  let backgroundImage;
//  let bossImage; 


//  function preload() {
//      player.playerImage = loadImage('./assets/shiplvl1Top.png');

// 	 //backgroundImage = loadImage('./assets/sea.png');
// 	 enemyImage = loadImage('./assets/krakenDelozier.png');
//  }
 
// function setup() {
// 	//createCanvas(mapXSize, mapYSize, WEBGL);
// 	//makes canvas size dependent on display size (- values because full display size was to big)
// 	createCanvas(displayWidth / 1.5, displayHeight / 1.5, WEBGL);

// 	clearStorageButton = createButton("Clear Storage");
// 	clearStorageButton.position(0, 0);
// 	clearStorageButton.mousePressed(() => { localStorage.clear(); location.reload(); });
	
// 	console.log("Display h x w = " + displayHeight + ", " + displayWidth);

	
// 	//camera to follow player
// 	cam = createCamera();

// 	//sets the standard frame rate to 45fps
// 	frameRate(45);



// }

// function draw() {
// 	background(0, 0, 0, 0);
// 	//image(backgroundImage, mapXSize / 2 - mapXSize, mapYSize / 2 - mapYSize, mapXSize * 2, mapYSize * 2);

// 	//border lines
// 	stroke(255, 255, 255);
// 	line(0, mapXSize, 0, 0);
// 	line(mapXSize, mapXSize, 0, mapYSize);
// 	line(mapXSize, 0, mapYSize, mapYSize);
// 	line(0, 0, mapYSize, 0);
// 	stroke(0, 0, 0);

	
// 	controllerInput();

	

// 	player.drawPlayer();
// 	player.movePlayer();
// 	player.checkCollisionEnemies(enemies);


// 	if (projectileFrameCount % 30 === 0) {
// 		extraMove = player.getMovementOfPlayer();
// 		extraXMove = extraMove[0];
//         extraYMove = extraMove[1];
// 		let tmpProjectile1 = new Projectile(player.x, player.y, player.angle, -1, extraXMove, extraYMove);
// 		projectiles.push(tmpProjectile1);
// 		let tmpProjectile2 = new Projectile(player.x, player.y, player.angle, 1, extraXMove, extraYMove);
// 		projectiles.push(tmpProjectile2);

// 		projectileFrameCount = 0;
// 	}

// 	projectiles.forEach((projectile, index) => {
// 		projectile.drawProjectile();
// 		projectile.moveProjectile();
// 		if (projectile.outOfRange())
// 			projectiles.splice(index, 1);

// 	});

// 	boss.drawBoss();

//     // Handle boss attacks
//     const attack = boss.attack(player, 'minionImage');
//     if (attack) {
//         if (Array.isArray(attack)) {
//             minions = minions.concat(attack);
//         } else if (attack.move) {
//             inkProjectiles.push(attack);
//         } else if (attack.draw) {
//             tentacles.push(attack);
//         }
//     }

//     // Draw and move minions
//     minions.forEach(minion => {
//         minion.drawEnemy();
//         minion.moveEnemy(player);
//     });

//     // Draw and move ink projectiles
//     inkProjectiles.forEach(ink => {
//         ink.move();
//         ink.draw();
//     });

//     // Draw tentacles
//     tentacles.forEach(tentacle => {
//         tentacle.draw();
//         tentacle.hitPlayer();
//     });


	

// 	//moves cam to centered on player, z=800 default
// 	//MUST BE 801 FOR 2d LINES TO RENDER ABOVE IMAGES
// 	cam.setPosition(player.x, player.y, 801);

// 	frameCount++;
// 	projectileFrameCount++;

// }

// //debuging function currently
// function mousePressed() {
// 	console.log("mouse: " + mouseX + ", " + mouseY);
// 	console.log("player: " + player.x + ", " + player.y);
// }

 
const mapXSize = 1000;
const mapYSize = 1000;

let player = new Player(mapXSize/2, mapYSize/2);

let enemies = [];

let gameObjects = [];

let projectiles = [];

let frameCount = 0;


let minions = [];
let inkProjectiles = [];
let tentacles = [];
let boss;



let enemySpawnNumber = parseInt(localStorage.getItem("enemySpawnNumber")) || 0;
let enemyHealth = parseInt(localStorage.getItem("enemyHealth")) || 1;

// frame counts for each use case because if not reset 
// % can return true because frame count isnt back to 0
let enemyFrameCount = 0;
let projectileFrameCount = 0;

 //let playerImage; made playerimage part of the player object
 let islandImage;
 let backgroundImage;
 let enemyImage; 
 let bossImage;
 let minionImage;

 let inkEffectDuration = 0;


 function preload() {
     player.playerImage = loadImage('./assets/shiplvl1Top.png');
	 islandImage = loadImage('./assets/islandDock.png');
	 //backgroundImage = loadImage('./assets/sea.png');
	 enemyImage = loadImage('./assets/shiplvl2Top.png');
	 bossImage = loadImage('./assets/krakenDelozier.png');
	 minionImage = loadImage('./assets/kraken.png');
	 tentacleImage = loadImage('./assets/tentacle.png');	
 }
 
function setup() {
	//createCanvas(mapXSize, mapYSize, WEBGL);
	//makes canvas size dependent on display size (- values because full display size was to big)
	createCanvas(displayWidth, displayHeight, WEBGL);

	clearStorageButton = createButton("Clear Storage");
	clearStorageButton.position(0, 0);
	clearStorageButton.mousePressed(() => { localStorage.clear(); location.reload(); });
	
	console.log("Display h x w = " + displayHeight + ", " + displayWidth);

	const healthBarContainer = document.getElementById('boss-health-bar-container');
    const healthBar = document.getElementById('boss-health-bar');
    const defeatMessage = document.getElementById('defeat-message');

    // Initialize the boss with the new constructor
    boss = new Boss(300, 300, 10, healthBarContainer, healthBar, defeatMessage); // Example position and health
	boss.bossImage = bossImage;
	
	 setInterval(() => {
        const attack = boss.attack(player, minionImage, tentacleImage);
        if (attack) {
            if (Array.isArray(attack)) {
				// for (let i = 0; i < attack.length; i++) {
				// 	attack[i].playerImage = minionImage;
				// 	attack[i].string = "minion";
				// }
                minions = minions.concat(attack);
            } else if (attack.move) {
                inkProjectiles.push(attack);
            } else if (attack.draw) {
                tentacles.push(attack);
            }
        }
    }, 5000); // 5000 milliseconds = 5 seconds

	// Draw and move minions
    
	//camera to follow player
	cam = createCamera();

	//sets the standard frame rate to 45fps
	frameRate(45);

	//random object to show screen move
	let island = new GameObject(100, 100);
	//island.collision = true;
	gameObjects.push(island);

	//random object to show screen move
	island = new GameObject(250, 100);
	//island.collision = true;
	gameObjects.push(island);

}

function draw() {
	background(0, 0, 0, 0);
	//image(backgroundImage, mapXSize / 2 - mapXSize, mapYSize / 2 - mapYSize, mapXSize * 2, mapYSize * 2);

	//border lines
	stroke(255, 255, 255);
	line(0, mapXSize, 0, 0);
	line(mapXSize, mapXSize, 0, mapYSize);
	line(mapXSize, 0, mapYSize, mapYSize);
	line(0, 0, mapYSize, 0);
	stroke(0, 0, 0);

	//enemy generation
	// enemyFrameCount = 200 - (enemySpawnNumber/2)^1.5
	// y = 200 - (x/2)^1.5 if want to graph
	//let enemySpawnTimer = 200 - Math.ceil(Math.pow(enemySpawnNumber, 2));
	// if (enemyFrameCount % enemySpawnTimer === 0) {
	// 	let generateXFirst = Math.random() > 0.5;
	// 	let rand1;
	// 	let rand2;
	// 	if (generateXFirst) {
	// 		rand1 = Math.random() * mapXSize;
	// 		rand2 = Math.random() > 0.5 ? mapYSize + 20 : -20;
	// 	}
	// 	else {
	// 		rand2 = Math.random() * mapYSize;
	// 		rand1 = Math.random() > 0.5 ? mapXSize + 20 : -20;
	// 	}
	// 	let enemy = new Enemy(rand1, rand2, enemyHealth, enemyImage);
	// 	enemies.push(enemy);

	// 	// parabolic generation
	// 	// cap of spawn every 100 frames (can be generated into less)
	// 	if (enemySpawnTimer > 100) {
	// 		enemySpawnNumber++;
	// 	} else {
	// 		enemyHealth++;
	// 		enemySpawnNumber = 0;
	// 	}

	// 	localStorage.setItem("enemySpawnNumber", enemySpawnNumber);
	// 	localStorage.setItem("enemyHealth", enemyHealth);

	// 	enemyFrameCount = 0;
	//}

	

	controllerInput();

	

	player.drawPlayer();
	player.movePlayer();
	player.checkCollisionEnemies(minions);
	player.checkCollisionProjectiles(inkProjectiles);
	player.drawRudderAndSails();

	boss.drawBoss();
	boss.checkCollisionProjectiles(projectiles);

	minions.forEach((minion, index) => {
		minion.drawMinion();
		minion.moveEnemy(player);
		minion.checkCollisionProjectiles(projectiles, player);
		if (minion.health <= 0) {
			minions.splice(index, 1);
			player.gainCurrency(minion.currencyValue);
		}
	});

	// Draw and move ink projectiles
		inkProjectiles.forEach((ink, index) => {
			ink.move();
			ink.draw();
			if (checkCollision(ink, player)) {
				player.inked = true;
				inkEffectDuration = 3000; // 3 seconds
				inkProjectiles.splice(index, 1); // Remove the ink projectile after collision
				player.takeDamage(ink.damage);
				console.log("I've been hit! Health: " + player.health);
			}
		});

		// Draw tentacles and remove them after 1 second
		tentacles.forEach((tentacle, index) => {
			if (tentacle.isExpired()) {
				tentacles.splice(index, 1); // Remove the tentacle after 1 second
			} else {
				tentacle.draw();
				tentacle.hitPlayer();
			}
		});


	if (projectileFrameCount % 30 === 0) {
		extraMove = player.getMovementOfPlayer();
		extraXMove = extraMove[0];
        extraYMove = extraMove[1];
		let tmpProjectile1 = new Projectile(player.x, player.y, player.angle, -1, extraXMove, extraYMove);
		projectiles.push(tmpProjectile1);
		let tmpProjectile2 = new Projectile(player.x, player.y, player.angle, 1, extraXMove, extraYMove);
		projectiles.push(tmpProjectile2);

		projectileFrameCount = 0;
	}

	projectiles.forEach((projectile, index) => {
		projectile.drawProjectile();
		projectile.moveProjectile();
		if (projectile.outOfRange())
			projectiles.splice(index, 1);

	});


	// gameObjects.forEach((gameObject) => {
	// 	gameObject.drawObject(islandImage);
	// });

	// Overlay semi-transparent black rectangle if ink effect is active
    if (player.inked) {
        fill(0, 0, 0, 200); // Semi-transparent black
        rect(0, 0, mapXSize, mapYSize);
	}
	if (inkEffectDuration <= 0) {
		player.inked = false;
	}
	inkEffectDuration -= deltaTime; // Decrease the duration

	// Award the player with the boss's currency value and change background
	if (boss.isDead && !boss.awardReceived)
	{	
		changeBackgroundToSea();
		player.gainCurrency(boss.currencyValue);
		console.log("Player received " + boss.currencyValue + " currency. Total: " + player.currency);
		boss.awardReceived = true;
	}
	//moves cam to centered on player, z=800 default
	//MUST BE 801 FOR 2d LINES TO RENDER ABOVE IMAGES
	cam.setPosition(player.x, player.y, 801);

	player.checkPlayerDeath();

	frameCount++;
	projectileFrameCount++;
	enemyFrameCount++;

	
}
// Function to check collision between ink projectile and player
function checkCollision(ink, player) {
    let distance = dist(ink.x, ink.y, player.x, player.y);
    return distance < (ink.size / 2 + player.size / 2);
}

//debuging function currently
function mousePressed() {
	console.log("mouse: " + mouseX + ", " + mouseY);
	console.log("player: " + player.x + ", " + player.y);
}

// Function to change the background to sea.png
function changeBackgroundToSea() {
    document.body.style.backgroundImage = "url('./assets/sea.png')";
}