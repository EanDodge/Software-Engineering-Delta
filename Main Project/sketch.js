function setup() {
  createCanvas(1200, 600);
}

function draw() {
  background(220);

  for (var x = 0; x <= width; x += width / 20) {
		for (var y = 0; y <= height; y += height / 10) {
			stroke(0);
			strokeWeight(1);
			line(x, 0, x, height);
			line(0, y, width, y);
		}
	}
}
