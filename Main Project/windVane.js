class WindVane {
    constructor()
    {
        this.windAngle = Math.PI;
        this.windChangeSpeed = 0.0015
        this.windNoiseOffset = Math.random() * 1000;
        this.img = null;
    } 
    show() {
        push();
	    fill(255, 255, 255);
	    translate(player.x + 400, player.y - 200);
	    rotate(-this.windAngle);
	    fill(80,80,80);
	    ellipse(0, 0, 150, 150);
	    imageMode(CENTER);
	    image(this.img, 0, 0, 300, 200);
	    pop();
    }
    update() {
        this.windNoiseOffset += this.windChangeSpeed;
	    let noiseValue = noise(this.windNoiseOffset);
	    let normalizedNoiseValue = map(noiseValue, 0.25, 0.75, 0, 1);	
	    this.windAngle = map(normalizedNoiseValue, 0, 1, 0, Math.PI * 2);
    }
}