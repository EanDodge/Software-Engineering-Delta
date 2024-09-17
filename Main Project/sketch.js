let player = new Player(250, 250);

function setup() {
  createCanvas(500, 500, WEBGL);

  //camera to follow player
  cam = createCamera();
}

function draw() {
  background("lightblue");

  player.drawPlayer();
  player.movePlayer();

  //moves cam to centered on player, z=800 default
  cam.setPosition(player.x, player.y, 800);

  //random object to show screen move
  fill(255, 0, 0);
  ellipse(100, 100, 50, 50);
}
