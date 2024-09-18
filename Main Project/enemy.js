/// Enemy object
/// used for the enemy



class Enemy {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.speed = 5;
        this.size = 40;
        this.collision = true;
    }

    drawEnemy() {
        fill(255, 0, 0);
        ellipse(this.x, this.y, this.size, this.size);
    }

    moveEnemy(player) { //+ distance
        let distanceX = player.x - this.x;
        let distanceY = player.y - this.y;

        let ratioOfMoveX = Math.abs(distanceX) / (Math.abs(distanceX) + Math.abs(distanceY));
        let ratioOfMoveY = 1 - ratioOfMoveX;

        this.x += this.speed * ratioOfMoveX * Math.sign(distanceX);
        this.y += this.speed * ratioOfMoveY * Math.sign(distanceY);
    }
}