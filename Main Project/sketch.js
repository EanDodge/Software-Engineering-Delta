const mapXSize = 1000;
const mapYSize = 1000;

let player = new Player(mapXSize/2, mapYSize/2);

let enemies = [];

let gameObjects = [];

let projectiles = [];

let frameCount = 0;

 //let playerImage; made playerimage part of the player object
 let islandImage;
 let backgroundImage

 function preload() {
     player.playerImage = loadImage('./assets/shiplvl1Top.png');
	 islandImage = loadImage('./assets/islandDock.png');
	 backgroundImage = loadImage('./assets/sea.png');
 }
 
function setup() {
	//createCanvas(mapXSize, mapYSize, WEBGL);
	//makes canvas size dependent on display size (- values because full display size was to big)
	createCanvas(displayWidth / 1.5, displayHeight / 1.5, WEBGL);
	
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


	runTests();

}

function draw() {
	background(0, 0, 0, 0);
	image(backgroundImage, mapXSize / 2 - mapXSize, mapYSize / 2 - mapYSize, mapXSize * 2, mapYSize * 2);

	//border lines
	stroke(255, 255, 255);
	line(0, mapXSize, 0, 0);
	line(mapXSize, mapXSize, 0, mapYSize);
	line(mapXSize, 0, mapYSize, mapYSize);
	line(0, 0, mapYSize, 0);
	stroke(0, 0, 0);

	if (frameCount % 150 === 0) {
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
		let enemy = new Enemy(rand1, rand2);
		enemies.push(enemy);
	}

	enemies.forEach((enemy, index) => {
		enemy.drawEnemy();
		enemy.moveEnemy(player);
		enemy.checkCollisionProjectiles(projectiles);
		if (enemy.health <= 0) {
			enemies.splice(index, 1);
			player.gainCurrency(enemy.currencyValue);
		}
	});

	controllerInput();

	

	player.drawPlayer();
	player.movePlayer();
	player.checkCollisionEnemies(enemies);


	if (frameCount % 30 === 0) {
		extraMove = player.getMovementOfPlayer();
		extraXMove = extraMove[0];
        extraYMove = extraMove[1];
		let tmpProjectile1 = new Projectile(player.x, player.y, player.angle, -1, extraXMove, extraYMove);
		projectiles.push(tmpProjectile1);
		let tmpProjectile2 = new Projectile(player.x, player.y, player.angle, 1, extraXMove, extraYMove);
		projectiles.push(tmpProjectile2);
	}

	projectiles.forEach((projectile, index) => {
		projectile.drawProjectile();
		projectile.moveProjectile();
		if (projectile.outOfRange())
			projectiles.splice(index, 1);

	});


	gameObjects.forEach((gameObject) => {
		gameObject.drawObject(islandImage);
		player.checkCollision(gameObject);
		player.checkCollisionIsland(gameObjects);
	});

	//moves cam to centered on player, z=800 default
	cam.setPosition(player.x, player.y, 800);

	frameCount++;
}

//debuging function currently
function mousePressed() {
	console.log("mouse: " + mouseX + ", " + mouseY);
	console.log("player: " + player.x + ", " + player.y);
}

//this is where we can put our testing functions
function runTests() {
	player.runTestsPlayer();
}
