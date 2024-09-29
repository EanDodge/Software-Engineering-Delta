class Projectile {
    constructor(x, y, angle, sign, playerXMove, playerYMove) {
        this.x = x;
        this.y = y;
        this.size = 5;
        this.collision = true;
        this.speed = 10;
        this.angle = angle;
        this.sign = sign;
        this.extraXMove = playerXMove;
        this.extraYMove = playerYMove;
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
        //this works, dont know how
        this.y += this.speed * sin(-this.angle) * this.sign + this.extraYMove;
        this.x += this.speed * cos(-this.angle) * this.sign + this.extraXMove;
    }
}