const mapXSize = 500;
const mapYSize = 1000;

let player = new Player(mapXSize/2, mapYSize - 100);

let highestLevelBeat = parseInt(localStorage.getItem("highestLevelBeat")) || 0;
//change once get bosses in
let selectedLevel = highestLevelBeat + 1;

//game classes containers array
let enemies = [];
let dockIslands = [];
let obstacleIslands = [];
let goal;
let projectiles = [];

let frameCount = 0;
let enemyHealth = 3;

// frame counts for each use case because if not reset 
// % can return true because frame count isnt back to 0
let enemyFrameCount = 0;
let projectileFrameCount = 0;

//let playerImage; made playerimage part of the player object
let dockIslandImage;
let grassIslandImage;
// let backgroundImage;
let enemyImage; 
let stormImage;
let minionImage;


function preload() {
    player.playerImage = loadImage('./assets/shiplvl1Top.png');
	dockIslandImage = loadImage('./assets/islandDock.png');
	grassIslandImage = loadImage('./assets/island.png')
	//backgroundImage = loadImage('./assets/sea.png');
	enemyImage = loadImage('./assets/shiplvl2TopCopy.png');
	stormImage = loadImage('./assets/stormWater.png')
	minionImage = loadImage('./assets/kraken.png');
}
 
function setup() {
	//createCanvas(mapXSize, mapYSize, WEBGL);
	//makes canvas size dependent on display size (- values because full display size was to big)
	createCanvas(displayWidth / 1.5, displayHeight / 1.5, WEBGL);

	let clearStorageButton = createButton("Clear Storage");
	clearStorageButton.position(0, 20);
	clearStorageButton.mousePressed(() => { localStorage.clear(); location.reload(); });

	let incrementLevelButton = createButton("Level 20");
	incrementLevelButton.position(0, 40);
	incrementLevelButton.mousePressed(() => { localStorage.setItem("highestLevelBeat", '20'); location.reload(); });
	
	console.log("Display h x w = " + displayHeight + ", " + displayWidth);

	
	//camera to follow player
	cam = createCamera();

	//sets the standard frame rate to 45fps
	frameRate(45);

	//setting up gameObjects
	goal = new GameObject(mapXSize / 2, 100, 100, 100);
	//dock islands
	dockIslands.push(new GameObject(mapXSize -200, mapYSize-300, 100, 50));
	//obstacle islands
	obstacleIslands.push(new GameObject(300, 300, 200, 50));
	
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

	//enemy generation based on level, can adjust for later
	let enemySpawnTimer = 250 - selectedLevel * 10;
	if (enemyFrameCount % enemySpawnTimer === 0) {
		let enemy = new Enemy(Math.random() * mapXSize, player.y - 350, enemyImage);
		enemies.push(enemy);
		enemyFrameCount = 0;
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
	if(player.checkCollisionIslands(obstacleIslands)) {
		player.movePlayer(true);
	}
	else {player.movePlayer()}

	//if player hits dockIsland player goes to upgrade screen
	if(player.checkCollisionIslands(dockIslands)) {
		window.location.href = './islandIndex.html'; // Navigate to upgrade island
	}

	player.checkCollisionEnemies(enemies);
	
	

	goal.drawObject(stormImage);
	goal.checkGoalCollision(player, selectedLevel);


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


	dockIslands.forEach((dIsland) => {
		dIsland.drawObject(dockIslandImage);
	});
	obstacleIslands.forEach((oIsland) => {
		oIsland.drawObject(grassIslandImage);
	});

	//moves cam to centered on player, z=800 default
	//MUST BE 801 FOR 2d LINES TO RENDER ABOVE IMAGES
	cam.setPosition(player.x, player.y, 801);
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