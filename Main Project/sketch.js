let highestLevelBeat = parseInt(localStorage.getItem("highestLevelBeat")) || 0;
//change once get bosses in
let selectedLevel = parseInt(localStorage.getItem("selectedLevel")) || 1;


//game classes containers array
let enemies = [];
let dockIslands = [];
let obstacleIslands = [];
let bombs = [];


let mapXSize;
let mapYSize;
if (selectedLevel == 1 || selectedLevel == 2) {
	mapXSize = 750;
	mapYSize = 2000;
}
if (selectedLevel == 3 || selectedLevel == 4) {
	mapYSize = 600;
	mapXSize = 2000;
}
if (selectedLevel == 5) {
	mapXSize = 500;
	mapYSize = 4000;
}


let player;
if (selectedLevel == 1 || selectedLevel == 2) {
	player = new Player(mapXSize / 2, 100);
}
if (selectedLevel == 3) {
	player = new Player(100, mapYSize / 2)
}
if (selectedLevel == 4) {
	player = new Player(mapXSize - 100, mapYSize / 2);
}
if (selectedLevel == 5) {
	player = new Player(mapXSize / 2, mapYSize - 100);
}


let goal;
let projectiles = [];

let frameCount = 0;
let enemyHealth = 3;

let windAngle = Math.PI;

let cameraDistance = 801

// frame counts for each use case because if not reset 
// % can return true because frame count isnt back to 0
let enemyFrameCount = 1;
let projectileFrameCount = 0;
let projectileOffset = 0;


//let playerImage; made playerimage part of the player object
let islandImage;
let backgroundImage;
let enemyImage;
let stormImage;
let minionImage;
let bombImage;


function preload() {
	player.playerImage = loadImage('./assets/shiplvl1Base.png');
	player.sailImage = loadImage('./assets/shiplvl1FrontSail.png')
	islandImage = loadImage('./assets/islandDock.png');
	//backgroundImage = loadImage('./assets/sea.png');
	enemyImage = loadImage('./assets/shark.gif');
	stormImage = loadImage('./assets/stormWater.png')
	minionImage = loadImage('./assets/kraken.png');
	backgroundMusic = loadSound('./music/sweetchild.mp4');
	bombImage = loadImage('./assets/crag2.png');
}


function setup() {
	//createCanvas(mapXSize, mapYSize, WEBGL);
	//makes canvas size dependent on display size (- values because full display size was to big)
	createCanvas(displayWidth / 1.5, displayHeight / 1.5, WEBGL);

	let clearStorageButton = createButton("Clear Storage");
	clearStorageButton.position(0, 20);
	clearStorageButton.mousePressed(() => { localStorage.clear(); location.reload(); });

	// let incrementLevelButton1 = createButton("Level 1");
	// incrementLevelButton1.position(0, 40);
	// incrementLevelButton1.mousePressed(() => { localStorage.setItem("selectedLevel", '1'); location.reload(); });

	// let incrementLevelButton2 = createButton("Level 2");
	// incrementLevelButton2.position(0, 60);
	// incrementLevelButton2.mousePressed(() => { localStorage.setItem("selectedLevel", '2'); location.reload(); });

	// let incrementLevelButton3 = createButton("Level 3");
	// incrementLevelButton3.position(0, 80);
	// incrementLevelButton3.mousePressed(() => { localStorage.setItem("selectedLevel", '3'); location.reload(); });

	// let incrementLevelButton4 = createButton("Level 4");
	// incrementLevelButton4.position(0, 100);
	// incrementLevelButton4.mousePressed(() => { localStorage.setItem("selectedLevel", '4'); location.reload(); });

	// let incrementLevelButton5 = createButton("Level 5");
	// incrementLevelButton5.position(0, 120);
	// incrementLevelButton5.mousePressed(() => { localStorage.setItem("selectedLevel", '5'); location.reload(); });

	// console.log("Display h x w = " + displayHeight + ", " + displayWidth);


	//camera to follow player
	cam = createCamera();

	//sets the standard frame rate to 45fps
	frameRate(45);

	if (selectedLevel == 1 || selectedLevel == 2) {
		goal = new GameObject(mapXSize / 2, mapYSize - 100, 100, 100);
	}
	else if (selectedLevel == 3) {
		goal = new GameObject(mapXSize - 100, mapYSize / 2, 100, 100);
	}
	else if (selectedLevel == 4) {
		goal = new GameObject(100, mapYSize / 2, 100, 100);
	}
	else if (selectedLevel == 5) {
		goal = new GameObject(mapXSize / 2, 100, 100, 100);
	}

	if (selectedLevel == 2) {
		let leftOrRight = true;
		for (let i = 300; i < mapYSize * 4 / 5; i += 600) {
			for (let j = 0; j < mapXSize * 3 / 4; j += 25) {
				let bomb;
				if (leftOrRight) {
					bomb = new GameObject(j, i, 25, 25);
				} else {
					bomb = new GameObject(mapXSize - (j + 25), i, 25, 25);
				}
				bombs.push(bomb);
			}
			leftOrRight = !leftOrRight;
		}
	}

	if (selectedLevel == 3) {
		let leftOrRight = true;
		for (let i = 300; i < mapXSize * 4 / 5; i += 600) {
			for (let j = 0; j < mapYSize * 3 / 4; j += 25) {
				let bomb;
				if (leftOrRight) {
					bomb = new GameObject(i, j, 25, 25);
				} else {
					bomb = new GameObject(i, mapYSize - (j + 25), 25, 25);
				}
				bombs.push(bomb);
			}
			leftOrRight = !leftOrRight;
		}
	}

	if (selectedLevel == 4) {
		let leftOrRight = true;
		for (let i = 300; i < mapXSize * 4 / 5; i += 600) {
			for (let j = 0; j < mapYSize * 3 / 4; j += 25) {
				let bomb;
				if (leftOrRight) {
					bomb = new GameObject(mapXSize - i, j, 25, 25);
				} else {
					bomb = new GameObject(mapXSize - i, mapYSize - (j + 25), 25, 25);
				}
				bombs.push(bomb);
			}
			leftOrRight = !leftOrRight;
		}
	}

	if (selectedLevel == 5) {
		let leftOrRight = true;
		for (let i = 300; i < mapYSize * 4 / 5; i += 300) {
			for (let j = 0; j < mapXSize * 4 / 7; j += 25) {
				let bomb;
				if (leftOrRight) {
					bomb = new GameObject(j, mapYSize - i, 25, 25);
				} else {
					bomb = new GameObject(mapXSize - (j + 25), mapYSize - i, 25, 25);
				}
				bombs.push(bomb);
			}
			leftOrRight = !leftOrRight;
		}
	}


	let island = new GameObject(mapXSize, mapYSize, 100, 100);
	//gameObjects.push(island);
	loadMusic();
}

function loadMusic() {
	userStartAudio(); //music starts playing when user interacts with browser
	backgroundMusic.setVolume(0);
	backgroundMusic.play();
	backgroundMusic.loop();

	// Fade in to target volume of 1 over 3 seconds
	backgroundMusic.setVolume(1, 3, 0.25);
}

function draw() {
	background(0, 0, 0, 0);
	//image(backgroundImage, mapXSize / 2 - mapXSize, mapYSize / 2 - mapYSize, mapXSize * 2, mapYSize * 2);

	//border lines
	stroke(255, 255, 255);
	line(0, mapYSize, 0, 0);
	line(mapXSize, mapYSize, 0, mapYSize);
	line(mapXSize, 0, mapXSize, mapYSize);
	line(0, 0, mapXSize, 0);
	stroke(0, 0, 0);


	push();
	fill(255, 255, 255);
	translate(player.x - 425, player.y - 250);
	rotate(-windAngle);
	triangle(-25, 25, 0, -25, 25, 25);
	pop();

	if (selectedLevel == 1 || selectedLevel == 2) {
		let enemySpawnTimer = 250;
		if (enemyFrameCount % enemySpawnTimer === 0) {
			let enemy = new Enemy(Math.random() * mapXSize, player.y + 350, enemyHealth, enemyImage);
			enemies.push(enemy);
			enemyFrameCount = 0;
		}
	}
	if (selectedLevel == 3) {
		let enemySpawnTimer = 250;
		if (enemyFrameCount % enemySpawnTimer === 0) {
			let enemy = new Enemy(player.x + 500, Math.random() * mapYSize, enemyHealth, enemyImage);
			enemies.push(enemy);
			enemyFrameCount = 0;
		}
	}
	if (selectedLevel == 4) {
		let enemySpawnTimer = 250;
		if (enemyFrameCount % enemySpawnTimer === 0) {
			let enemy = new Enemy(player.x - 500, Math.random() * mapYSize, enemyHealth, enemyImage);
			enemies.push(enemy);
			enemyFrameCount = 0;
		}
	}
	if (selectedLevel == 5) {
		let enemySpawnTimer = 250;
		if (enemyFrameCount % enemySpawnTimer === 0) {
			let enemy = new Enemy(Math.random() * mapXSize, player.y - 350, enemyHealth, enemyImage);
			enemies.push(enemy);
			enemyFrameCount = 0;
		}
	}

	if (player.isAlive == false) {
		return;
	}

	enemies.forEach((enemy, index) => {
		enemy.drawEnemy();
		enemy.moveEnemy(player);
		enemy.checkCollisionProjectiles(projectiles, player);
		if (enemy.health <= 0) {
			enemies.splice(index, 1);
			player.gainCurrency(enemy.currencyValue);
		}
	});

	controllerInput();



	player.drawPlayer();

	//if player hits obstacleIsland player is bumped opposite direction
	if (player.checkCollisionIslands(obstacleIslands)) {
		player.movePlayer(true);
	}
	else { player.movePlayer() }

	player.drawRudderAndSails();
	player.checkCollisionEnemies(enemies);
	player.checkCollisionBomb(bombs);


	//if player hits dockIsland player goes to upgrade screen
	if (player.checkCollisionIslands(dockIslands)) {
		window.location.href = './islandIndex.html'; // Navigate to upgrade island

	}

	player.checkCollisionEnemies(enemies);


	goal.islandImage = stormImage;
	goal.drawObject();
	goal.checkGoalCollision(player, selectedLevel);


	if (projectileFrameCount % 30 === 0 && !delozierMode) {
		extraMove = player.getMovementOfPlayer();
		extraXMove = extraMove[0];
		extraYMove = extraMove[1];
		let tmpProjectile1 = new Projectile(player.x, player.y, player.angle, -1, extraXMove, extraYMove);
		projectiles.push(tmpProjectile1);
		let tmpProjectile2 = new Projectile(player.x, player.y, player.angle, 1, extraXMove, extraYMove);
		projectiles.push(tmpProjectile2);

		projectileFrameCount = 0;
	}

	if (delozierMode) {
		for (let i = 0; i < Math.PI * 2; i += Math.PI / 10) {
			let tmpProjectile = new Projectile(player.x, player.y, i + projectileOffset, 1, 0, 0);
			projectiles.push(tmpProjectile);
		}
		projectileOffset += Math.PI / 25;
	}

	projectiles.forEach((projectile, index) => {
		projectile.drawProjectile();
		projectile.moveProjectile();
		if (projectile.outOfRange(mapXSize, mapYSize))
			projectiles.splice(index, 1);

	});

	bombs.forEach((bomb) => {
		bomb.drawBomb(bombImage);
	});


	dockIslands.forEach((dIsland) => {
		dIsland.drawObject(dockIslandImage);
	});
	obstacleIslands.forEach((oIsland) => {
		oIsland.drawObject(grassIslandImage);
	});

	//moves cam to centered on player, z=800 default
	//MUST BE 801 FOR 2d LINES TO RENDER ABOVE IMAGES
	cam.setPosition(player.x, player.y, cameraDistance);
	player.checkPlayerDeath();
	frameCount++;
	projectileFrameCount++;
	enemyFrameCount++;
}

//debuging function currently
function mousePressed() {
	console.log("mouse: " + mouseX + ", " + mouseY);
	console.log("player: " + player.x + ", " + player.y);
	console.log(highestLevelBeat, selectedLevel);
}