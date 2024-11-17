

class Pirate {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 50;
        this.img;
        this.speed = 5;
        this.direction = 'left';
    }

    draw() {
        
        push();
        translate(this.x, this.y);
        if(this.direction === 'right'){
        }

        imageMode(CENTER);
        image(this.img, 0, 0, this.size, this.size);
        pop();
        
    }

    move() {
        let futureX;
        let futureY;
        let yMove = 0;
        let xMove = 0;

        if (keyIsDown(87)) { yMove = -1; }  //W
        if (keyIsDown(83)) { yMove = 1; }   //s
        if (keyIsDown(65)) {
             xMove = -1;
             this.setDirection("left");
             }  //a
        if (keyIsDown(68)) {
             xMove = 1;
             this.setDirection("right");
             }   //d

        if (xMove != 0 && yMove != 0) {
            futureX = this.x + xMove * this.speed * .7071;
            futureY = this.y + yMove * this.speed * .7071;
        }
        else {
            futureX = this.x + xMove * this.speed;
            futureY = this.y + yMove * this.speed;
        }

        if(futureX > 0 && futureX < mapXSize && futureY > 0 && futureY < mapYSize) {
            this.x = futureX;
            this.y = futureY;
        }
    }

    setDirection(direction){
        this.direction = direction;
    }

    isColliding(islandObj) {
        //returns bool, true if colliding with passed game islandObject
                                //(rx, ry, rw, rh, cx, cy, diameter)
        return collideRectCircle(islandObj.x, islandObj.y, islandObj.sizeW, islandObj.sizeH, this.x, this.y)
    }

}


//make pirate class available globally
// window.Pirate = Pirate;
