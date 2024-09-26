let player = new Player(250, 250);

let enemies = [];

let gameObjects = [];

let projectiles = [];

let frameCount = 0;

const mapXSize = 500;
const mapYSize = 500;

 let playerImage;
 let islandImage;
 let backgroundImage

 function preload() {
     playerImage = loadImage('./assets/shiplvl1Top.png');
	 islandImage = loadImage('./assets/islandDock.png');
	 backgroundImage = loadImage('./assets/sea.png');
 }
 
function setup() {
	createCanvas(mapXSize, mapYSize, WEBGL);

	//camera to follow player
	cam = createCamera();

	//random object to show screen move
	let island = new GameObject(100, 100);
	island.collision = true;
	gameObjects.push(island);

	//random object to show screen move
	island = new GameObject(250, 100);
	island.collision = true;
	gameObjects.push(island);

	
}

function draw() {
	background(0, 0, 0, 0);
	image(backgroundImage, 250 - mapXSize, 250 - mapYSize, mapXSize * 2, mapYSize * 2);

	//border lines
	stroke(255, 255, 255);
	line(0, mapXSize, 0, 0);
	line(mapXSize, mapXSize, 0, mapYSize);
	line(mapXSize, 0, mapYSize, mapYSize);
	line(0, 0, mapYSize, 0);
	stroke(0, 0, 0);

	if (frameCount % 150 === 0) {
		let enemy = new Enemy(0, 0);
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

	player.drawPlayer(playerImage);
	player.movePlayer();
	player.checkCollisionEnemies(enemies);


	if (frameCount % 30 === 0) {
		//mouseX and mouseY use camera positioning so need to use center of map
		let lengthX = mouseX - mapXSize / 2;
		let lengthY = mouseY - mapYSize / 2;
		let angle = 90;
		if (lengthX !== 0) {
			angle = Math.atan(lengthY / lengthX);
		}
		let tmpProjectile = new Projectile(player.x, player.y, angle, Math.sign(lengthX));
		projectiles.push(tmpProjectile);
	}

	projectiles.forEach((projectile, index) => {
		projectile.drawProjectile();
		projectile.moveProjectile();
		if (projectile.outOfRange())
			projectiles.splice(index, 1);

	});


	gameObjects.forEach((gameObject) => {
		gameObject.drawObject(islandImage);
		player.testCollision(gameObject);
		player.checkCollisionIsland(gameObjects);
	});

	//moves cam to centered on player, z=800 default
	cam.setPosition(player.x, player.y, 800);

	frameCount++;
}

function mousePressed() {
	console.log("mouse: " + mouseX + " " + mouseY);
	console.log("player: " + player.x + " " + player.y);
}
