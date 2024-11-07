const mapXSize = 500;
const mapYSize = 500;

let player = new Pirate(355,383);

function preload()  {
    islandImg = loadImage('./assets/upgradeislandAlt.png');
    player.img = loadImage('./assets/pirate.png');
    seaImg = loadImage('./assets/sea.png');
}

function setup() {
    createCanvas(displayWidth, displayHeight, WEBGL);
    cam = createCamera(mapXSize/2, mapYSize/2, 801);
    cam.setPosition(250, 250, 801); //sets the camera to look at the center of the map
}

function draw() {
    imageMode(CENTER);
    image(seaImg, 0, 0);
    image(islandImg, 230, 250); //draws island image

    //draws island collision boxes

    player.draw();
    player.move();
    cam.setPosition(player.x, player.y, 801);
}

function mousePressed() {
	console.log("mouse: " + (mouseX -518) + ", " + (mouseY -182));
}