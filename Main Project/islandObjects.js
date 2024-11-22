//this class is used for the colliders for the upgrade island

class islandObject {
    constructor(x, y, w, h, over) {
        this.x = x;
        this.y = y;
        this.sizeW = w;
        this.sizeH = h;
        this.overlay = over;
    }

    //for debuging only
    draw() {
        rect(this.x, this.y, this.sizeW, this.sizeH);
    }
}

window.islandObject = islandObject;