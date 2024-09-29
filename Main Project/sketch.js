const mapXSize = 500;
const mapYSize = 500;

let player = new Player(mapXSize/2, mapYSize/2);

let enemies = [];

let gameObjects = [];

let projectiles = [];

let frameCount = 0;

 let playerImage;
 let islandImage;
 let backgroundImage

 function preload() {
     playerImage = loadImage('./assets/shiplvl1Top.png');
	 islandImage = loadImage('./assets/islandDock.png');
	 backgroundImage = loadImage('./assets/sea.png');
 }
 
function setup() {
	//createCanvas(mapXSize, mapYSize, WEBGL);
	//makes canvas size dependent on display size (- values because full display size was to big)
	createCanvas(displayWidth - 100, displayHeight - 180, WEBGL);
	
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
	image(backgroundImage, 250 - mapXSize, 250 - mapYSize, mapXSize * 2, mapYSize * 2);

	//border lines
	stroke(255, 255, 255);
	line(0, mapXSize, 0, 0);
	line(mapXSize, mapXSize, 0, mapYSize);
	line(mapXSize, 0, mapYSize, mapYSize);
	line(0, 0, mapYSize, 0);
	stroke(0, 0, 0);

	if (frameCount % 150 === 0) {
		let rand1 = Math.random() * 500;
		let rand2 = Math.random() * 500;
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

	player.drawPlayer(playerImage);
	player.movePlayer();
	player.checkCollisionEnemies(enemies);


	if (frameCount % 30 === 0) {
		//mouseX and mouseY use camera positioning so need to use center of map
			//allows for larger displaying to work with mouse aim
		let lengthX = mouseX - (displayWidth - 100) / 2;
		let lengthY = mouseY - (displayHeight - 180) / 2;
		// let lengthX = mouseX - mapXSize / 2; //old functions
		// let lengthY = mouseY - mapYSize / 2;
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
