const mapXSize = 500;
const mapYSize = 500;

let player = new Pirate(355,383);

function preload()  {
    islandImg = loadImage('assets/upgradeislandAlt.png');
    player.img = loadImage('assets/pirate.gif');
    seaImg = loadImage('assets/sea.png');
    backgroundMusic = loadSound('music/HomeIslandVibe.wav');
}

function setup() {
    createCanvas(displayWidth, displayHeight, WEBGL);
    cam = createCamera(mapXSize/2, mapYSize/2, 700);
    cam.setPosition(250, 250, 700); //sets the camera to look at the center of the map
	loadMusic();
}

function loadMusic() {
	userStartAudio(); //music starts playing when user interacts with browser
    backgroundMusic.setVolume(0.5);
	backgroundMusic.play();
    backgroundMusic.loop();
}

function draw() {
    imageMode(CENTER);
    image(seaImg,250 , 250);
    image(islandImg, 230, 250); //draws island image

    //draws island collision boxes

    player.draw();
    player.move();
    cam.setPosition(player.x, player.y, 700);
}

function mousePressed() {
	console.log("mouse: " + (mouseX -518) + ", " + (mouseY -182));
}