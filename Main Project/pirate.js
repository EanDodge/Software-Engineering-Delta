class Pirate {
    constructor(x, y, pirateImgSrc) {
        this.x = x;
        this.y = y;
        this.image = new Image();
        this.image.src = pirateImgSrc;
        this.direction = 'left';
    }

    draw(ctx) {
        ctx.save();
        if(this.direction ==='right'){
                ctx.translate(this.x , this.y);
                ctx.scale(-1,1);
                ctx.drawImage(this.image, 0, 0, 40, 40);
        }else{
            ctx.drawImage(this.image, this.x, this.y, 40, 40);
        }
        ctx.restore();
    }

    move(dx, dy) {
        this.x += dx;
        this.y += dy;
    }
    setDirection(direction){
        this.direction = direction;
    }

}

//make pirate class available globally
window.Pirate = Pirate;
