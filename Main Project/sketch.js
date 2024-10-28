const mapXSize = 500;
const mapYSize = 500;

let player = new Player(mapXSize/2, mapYSize/2);

let enemies = [];

let gameObjects = [];

let projectiles = [];

let frameCount = 0;

let enemySpawnNumber = parseInt(localStorage.getItem("enemySpawnNumber")) || 0;
//let enemyHealth = parseInt(localStorage.getItem("enemyHealth")) || 3;
let enemyHealth = 3;

// frame counts for each use case because if not reset 
// % can return true because frame count isnt back to 0
let enemyFrameCount = 0;
let projectileFrameCount = 0;

 //let playerImage; made playerimage part of the player object
 let islandImage;
 let backgroundImage;
 let enemyImage; 


 function preload() {
     player.playerImage = loadImage('./assets/shiplvl1Top.png');
	 islandImage = loadImage('./assets/islandDock.png');
	 //backgroundImage = loadImage('./assets/sea.png');
	 enemyImage = loadImage('./assets/shiplvl2Top.png');
 }
 
function setup() {
	//createCanvas(mapXSize, mapYSize, WEBGL);
	//makes canvas size dependent on display size (- values because full display size was to big)
	createCanvas(displayWidth / 1.5, displayHeight / 1.5, WEBGL);

	clearStorageButton = createButton("Clear Storage");
	clearStorageButton.position(0, 0);
	clearStorageButton.mousePressed(() => { localStorage.clear(); location.reload(); });
	
	console.log("Display h x w = " + displayHeight + ", " + displayWidth);

	
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
	let enemySpawnTimer = 200 - Math.ceil(Math.pow(enemySpawnNumber, 2));
	if (enemyFrameCount % enemySpawnTimer === 0) {
		let generateXFirst = Math.random() > 0.5;
		let rand1;
		let rand2;
		if (generateXFirst) {
			rand1 = Math.random() * mapXSize;
			rand2 = Math.random() > 0.5 ? mapYSize + 20 : -20;
		}
		else {
			rand2 = Math.random() * mapYSize;
			rand1 = Math.random() > 0.5 ? mapXSize + 20 : -20;
		}
		let enemy = new Enemy(rand1, rand2, enemyHealth, enemyImage);
		enemies.push(enemy);

		// parabolic generation
		// cap of spawn every 100 frames (can be generated into less)
		if (enemySpawnTimer > 100) {
			enemySpawnNumber++;
		} else {
			enemyHealth++;
			enemySpawnNumber = 0;
		}

		localStorage.setItem("enemySpawnNumber", enemySpawnNumber);
		localStorage.setItem("enemyHealth", enemyHealth);

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
	player.movePlayer();
	player.checkCollisionEnemies(enemies);

	player.checkCollisionIslands(gameObjects);
	if (player.hitIslant) {
		window.location.href = 'upgrade.html'; // Navigate to upgrades.html
	}


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


	gameObjects.forEach((gameObject) => {
		gameObject.drawObject(islandImage);
	});

	//moves cam to centered on player, z=800 default
	//MUST BE 801 FOR 2d LINES TO RENDER ABOVE IMAGES
	cam.setPosition(player.x, player.y, 801);

	frameCount++;
	projectileFrameCount++;
	enemyFrameCount++;
}

//debuging function currently
function mousePressed() {
	console.log("mouse: " + mouseX + ", " + mouseY);
	console.log("player: " + player.x + ", " + player.y);
}