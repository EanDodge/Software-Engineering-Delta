/// Enemy object
/// used for the enemy



class Enemy {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.speed = 2;
        this.size = 40;
        this.collision = true;
    }

    drawEnemy() {
        fill(255, 0, 0);
        ellipse(this.x, this.y, this.size, this.size);
    }

    moveEnemy(player) {
        let distanceX = player.x - this.x;
        let distanceY = player.y - this.y;
        let angle = 90;
        if (distanceX !== 0) {
            angle = Math.atan(distanceY / distanceX);
        }


        let moveX = this.speed * Math.cos(angle);
        let moveY = this.speed * Math.sin(angle);

        //multiply by sign of distance x because trig or something
        this.x += moveX * Math.sign(distanceX);
        this.y += moveY * Math.sign(distanceX);
    }
}