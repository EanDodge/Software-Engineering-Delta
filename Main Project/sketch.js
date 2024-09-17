let player = new Player(250, 250);
const mapXSize = 500;
const mapYSize = 500;

function setup() {
  createCanvas(mapXSize, mapYSize, WEBGL);

  //camera to follow player
  cam = createCamera();
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


  player.drawPlayer();
  player.movePlayer();

  //moves cam to centered on player, z=800 default
  cam.setPosition(player.x, player.y, 800);

  //random object to show screen move
  fill(255, 0, 0);
  ellipse(100, 100, 50, 50);
}
