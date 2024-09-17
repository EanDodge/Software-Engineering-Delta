let player = new Player(250, 250);

function setup() {
  createCanvas(500, 500);
}

function draw() {
  background("lightblue");
  player.drawPlayer();
  player.movePlayer();
}
