


 
const mapXSize = 1000;
const mapYSize = 1000;

let player = new Player(mapXSize/2, mapYSize/2);

let enemies = [];

let gameObjects = [];

let projectiles = [];

let frameCount = 0;

let windVane

let circles = [];
let totalCircles = 5;
let circlesHit = 0;
//let boss;



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
 let windVaneImage;

 let inkEffectDuration = 0;



 function preload() {
     player.playerImage = loadImage('./assets/shiplvl1Base.png');
	 player.sailImage = loadImage('./assets/shiplvl1FrontSail.png');
	 islandImage = loadImage('./assets/island.png');
	 //backgroundImage = loadImage('./assets/sea.png');
	 enemyImage = loadImage('./assets/shiplvl2Top.png');
	 bossImage = loadImage('./assets/krakenDelozier.png');
	 minionImage = loadImage('./assets/kraken.png');
	 tentacleImage = loadImage('./assets/tentacle.png');	
	 backgroundMusic = loadSound('./music/PirateLoop.wav');
	 windVaneImage = loadImage('./assets/weathervane.png');

 }

 function loadMusic() {
	userStartAudio(); //music starts playing when user interacts with browser
    backgroundMusic.setVolume(0);
	backgroundMusic.play();
    backgroundMusic.loop();

    // Fade in to target volume of 1 over 3 seconds
    backgroundMusic.setVolume(1, 3, 0.25);
} 
function setup() {
	//initalize windVane
	windVane = new WindVane;
	windVane.img = windVaneImage;
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

	//camera to follow player
	cam = createCamera();

	//sets the standard frame rate to 45fps
	frameRate(45);


	loadMusic();

	let boundaryPadding = 50; // Adjust this value as needed
    for (let i = 0; i < totalCircles; i++) {
        let x = random(boundaryPadding, (width - boundaryPadding) % mapXSize);
        let y = random(boundaryPadding, (height - boundaryPadding) % mapYSize);
        circles.push(new GameObject(x, y));
    }

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

	gameObjects.forEach(gameObject => {
        gameObject.drawObject();
    });

	
	//draw windVane
	windVane.update();
	windVane.show();


	controllerInput();

	

	player.drawPlayer();
	player.movePlayer(windVane.windAngle);
	//player.checkCollisionEnemies(minions);
	//player.checkCollisionProjectiles(inkProjectiles);
	player.drawRudderAndSails();
	player.checkCollisionTreasureIslands(gameObjects);


	// Overlay semi-transparent black rectangle if ink effect is active
    if (player.inked) {
        fill(0, 0, 0, 200); // Semi-transparent black
        rect(0, 0, mapXSize, mapYSize);
	}
	if (inkEffectDuration <= 0) {
		player.inked = false;
	}
	inkEffectDuration -= deltaTime; // Decrease the duration

	
	cam.setPosition(player.x, player.y, 801);

	player.checkPlayerDeath();

	frameCount++;
	projectileFrameCount++;
	enemyFrameCount++;

	console.log("Player currency: " + player.currency);

	// Draw circles and check for collisions
    circles.forEach(circle => {
        if (circle.hit) {
            fill(0, 255, 0); // Green if hit
        } else {
            fill(255, 0, 0); // Red if not hit
        }
        ellipse(circle.x, circle.y, 20, 20);

        if (dist(player.x, player.y, circle.x, circle.y) < 20) {
            if (!circle.hit) {
                circle.hit = true;
                circlesHit++;
                console.log(`Circle hit! Total circles hit: ${circlesHit}`);
            }
        }
    });

    // Check if all circles are hit
    if (circlesHit === totalCircles) {
        showModal(); // Show the modal
        noLoop(); // Stop the draw loop
        console.log("Tutorial complete");
    }
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