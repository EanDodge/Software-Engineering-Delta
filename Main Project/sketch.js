let player = new Player(250, 250);

let enemy = new Enemy(0, 0);

let gameObjects = [];

const mapXSize = 500;
const mapYSize = 500;

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
	background("lightblue");

	//border lines
	stroke(255, 255, 255);
	line(0, mapXSize, 0, 0);
	line(mapXSize, mapXSize, 0, mapYSize);
	line(mapXSize, 0, mapYSize, mapYSize);
	line(0, 0, mapYSize, 0);
	stroke(0, 0, 0);

	enemy.drawEnemy();
	enemy.moveEnemy(player);

	player.drawPlayer();
	player.movePlayer();

	gameObjects.forEach((gameObject) => {
		gameObject.drawObject();
		player.testCollision(gameObject);
	})

	//moves cam to centered on player, z=800 default
	cam.setPosition(player.x, player.y, 800);

}
