class Projectile {
    constructor(x, y, angle, sign) {
        this.x = x;
        this.y = y;
        this.size = 5;
        this.collision = true;
        this.speed = 10;
        this.angle = angle;
        this.sign = sign;
    }

    drawProjectile() {
        fill(255, 255, 255);
        ellipse(this.x, this.y, this.size, this.size);
    }

    outOfRange() {
        //check if move is out of bounds accounting for size
        if (this.x > mapXSize - this.size / 2 || this.x < 0 + this.size / 2
            || this.y > mapYSize - this.size / 2 || this.y < 0 + this.size / 2)
            return true;
        return false;
    }

    moveProjectile() {
        let moveX = this.speed * Math.cos(this.angle);
        let moveY = this.speed * Math.sin(this.angle);

        //multiply by sign of distance x because trig or something
        this.x += moveX * this.sign;
        this.y += moveY * this.sign;
    }
}