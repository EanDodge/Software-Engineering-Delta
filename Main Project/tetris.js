



let keyPressUp = false;
let keyPressDown = false;
let keyPressLeft = false;
let keyPressRight = false;
let score = 0;
var shapeList = [
  [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0], // I
  [0, 2, 0, 0, 2, 0, 0, 2, 2], // L
  [0, 3, 0, 0, 3, 0, 3, 3, 0], // J
  [4, 4, 0, 0, 4, 4, 0, 0, 0], // Z
  [0, 5, 5, 5, 5, 0, 0, 0, 0], // S
  [0, 0, 0, 6, 6, 6, 0, 6, 0], // T
  [7, 7, 7, 7], // O
];
var palletteMono = [];

var pallette = [
  [0, 255, 255],    // Cyan
  [255, 105, 180],  // Hot Pink
  [75, 0, 130],     // Indigo
  [173, 255, 47],   // Light Green
  [255, 165, 0],    // Orange
  [135, 206, 250],  // Light Sky Blue
  [221, 160, 221],  // Plum
];

function setup() {
  createCanvas(windowWidth - 40, windowHeight - 40);

  this.tetris = new Tetris(10, 20);
  this.timer = new Timer();
  frameRate(60);
  palletteMono = [];
  for (let i = 0; i < pallette.length; i++) {
    let rgb = pallette[i];
    let gray = rgb[0] + rgb[1] + rgb[2];
    palletteMono[i] = [];
    palletteMono[i][0] = 255 * gray;
    palletteMono[i][1] = 255 * gray;
    palletteMono[i][2] = 255 * gray;
  }
  player = new Player();
  window.player = player;
  player.updateCoinCount();
}
function draw() {
  if (this.timer.updateStep()) {
    applyInput(25);
  }
  this.tetris.update();
  this.tetris.display(this);
}

function applyInput(newDelay) {
  if (this.tetris.pause) return;
  if (keyPressUp) this.tetris.rotate = true;
  if (keyPressDown) this.tetris.ty = +1;
  if (keyPressLeft) this.tetris.tx = -1;
  if (keyPressRight) this.tetris.tx = +1;
  this.timer.reset(newDelay);
}
function keyPressed() {
  if (keyCode == 32) this.tetris.pause = !this.tetris.pause;
  if (keyCode == 13) this.tetris.restart = true;
  if (keyCode == 69) {
    this.tetris.gameOver = true;
    this.tetris.scoreAdded = false;
  }
  keyPressUp |= keyCode === UP_ARROW;
  keyPressDown |= keyCode === DOWN_ARROW;
  keyPressLeft |= keyCode === LEFT_ARROW;
  keyPressRight |= keyCode === RIGHT_ARROW;
  applyInput(200);
}
function keyReleased() {
  keyPressUp ^= keyCode === UP_ARROW;
  keyPressDown ^= keyCode === DOWN_ARROW;
  keyPressLeft ^= keyCode === LEFT_ARROW;
  keyPressRight ^= keyCode === RIGHT_ARROW;
}

function addScoreToCoins(player) {
  player.gainCurrency(score);
  player.updateCoinCount();
  console.log("Total coins: " + player.currency);
}

class Player {
  constructor() {
    this.currency = parseInt(localStorage.getItem('playerCurrency')) || 100; // Retrieve from localStorage or default to 100
  }
  gainCurrency(amount) {
    this.currency += amount;
    this.updateCoinCount();
  }

  updateCoinCount() {
    document.getElementById('coinCount').innerText = this.currency;
    localStorage.setItem('playerCurrency', this.currency); // Store in localStorage
    console.log(player.currency);
  }
}
class Tetris {
  constructor(nx, ny) {
    this.tGrid = new TGrid(nx, ny);
    this.timer = new Timer();
    this.restartGame();
    this.shapeNext = undefined;
    this.pickNextShape();
    this.scoreAdded = false; // Flag to track if score has been added
  }
  restartGame() {
    this.tGrid.clearGrid();
    this.restart = false;
    this.pause = false;
    this.gameOver = false;
    this.spawn = true;
    this.rotate = false;
    this.tx = this.ty = 0;
    this.level = 1;
    this.rowsPerLevel = 5;
    this.rowsCompleted = 0;
    this.shapesCount = 0;
    this.timer.reset(600);
  }
  pickNextShape() {
    this.shapeCurr = this.shapeNext;
    var indexNext = parseInt(random(shapeList.length));
    this.shapeNext = shapeList[indexNext].slice();
  }
  update() {
    if (this.restart) {
      this.restartGame();
    }
    if (this.pause) {
      return;
    }

    if (this.gameOver) {
      if (!this.scoreAdded) {
        addScoreToCoins(player);
        this.scoreAdded = true;
      }
      return;
    }

    // Spawn new shape
    if (this.spawn) {
      this.pickNextShape();
      this.tGrid.setShape(this.shapeCurr);
      this.shapesCount++;
      this.spawn = false;
    }

    // Update level/rows/difficulty
    this.level += floor(this.rowsCompleted / this.rowsPerLevel);
    this.rowsCompleted %= this.rowsPerLevel;
    this.timer.duration = ceil(800 / sqrt(this.level));

    // Apply user input: transforms
    if (this.rotate) this.tGrid.rotateShape();
    if (!this.tGrid.collision(this.tx, 0)) this.tGrid.sx += this.tx;
    if (!this.tGrid.collision(0, this.ty)) this.tGrid.sy += this.ty;

    // Apply game step
    if (this.timer.updateStep()) {
      if (!this.tGrid.collision(0, 1)) {
        if (this.ty == 0) {
          this.tGrid.sy++;
        }
      } else {
        this.tGrid.splatShape();
        this.rowsCompleted += this.tGrid.updateRows();
        this.spawn = true;
      }
    }

    // Reset transforms
    this.rotate = false;
    this.tx = this.ty = 0;
  }
  display(canvas) {
    var off, x, y, w, h, cell;
    var canvasW = canvas.width;
    var canvasH = canvas.height;
    off = 40;
    h = canvasH - 2 * off;
    w = canvasW - 2 * off;
    cell = ceil(Math.min(w / this.tGrid.nx, h / this.tGrid.ny));
    w = this.tGrid.nx * cell;
    h = this.tGrid.ny * cell;
    x = parseInt((canvasW - w) / 2.0);
    y = parseInt((canvasH - h) / 2.0);
    //canvas.background(255);
    canvas.strokeWeight(1);
    canvas.noStroke();
    canvas.fill(16);
    canvas.rect(x - 4, y - 4, w + 8, h + 8);
    canvas.fill(32);
    canvas.rect(x - 1, y - 1, w + 3, h + 3);
    // Game screen
    var colors = this.pause || this.gameOver ? palletteMono : pallette;
    this.displayGrid(canvas, x, y, w, h, colors);
    // Shape preview
    {
      var _w = x - 2 * off;
      var _h = canvasH - 2 * off;
      var _y = off;
      var _x = off + x + w;
      this.displayNextShape(canvas, _x, _y, _w, _h);
    }
    // Header
    {
      var ty = off + 32;
      var tx = x + w + x / 2;
      var txtTitle = "TETRIS GAME";
      canvas.textAlign(CENTER, CENTER);
      canvas.noStroke();
      canvas.textSize(30);
      canvas.fill(0);
      canvas.text(txtTitle, tx, ty);
    }
    // Came level, ...
    {
      var ty = canvasH / 2 - 150;
      var tx1 = x + w + x / 2;
      var txtLevel = "LEVEL " + this.level;
      var txtProgress = "ROW " + this.rowsCompleted + "/" + this.rowsPerLevel;
      var txtShapes = "SHAPE " + this.shapesCount;
      canvas.textAlign(CENTER, CENTER);
      canvas.noStroke();
      canvas.fill(200);
      canvas.textSize(24);
      canvas.text(txtLevel, tx1, ty);
      canvas.fill(96);
      canvas.textSize(16);
      canvas.text(txtProgress, tx1, (ty += 24));
      canvas.text(txtShapes, tx1, (ty += 16));
    }
    // Game status
    var txtGameStatus = undefined;
    if (this.gameOver) txtGameStatus = "GAME OVER";
    if (this.gameOver) txtGameStatus = "YOU EARNED " + score + " COINS!";
    if (this.pause) txtGameStatus = "PAUSE";
    if (txtGameStatus !== undefined) {
      canvas.textSize(144);
      canvas.textAlign(CENTER, CENTER);
      canvas.noStroke();
      canvas.fill(0, 0, 0);
      canvas.text(txtGameStatus, canvasW / 2 + 2, canvasH / 2 + 1);
      canvas.fill(255, 224, 0);
      canvas.text(txtGameStatus, canvasW / 2, canvasH / 2);
    }
    // Controlls
    {
      var ty = canvasH - 6 * 15 - off;
      var tx1 = x + w + 40;
      var tx2 = tx1 + 70;
      var boxPadding = 10;

      // box dimensions
      var boxWidth = tx2 + 120 - tx1;
      var boxHeight = 15 * 7 + 30;

      // Draw the box
      canvas.noStroke();
      canvas.fill(200);
      canvas.rect(tx1 - boxPadding, ty - 15 - boxPadding, boxWidth + boxPadding * 2, boxHeight + boxPadding * 2);

      canvas.textAlign(LEFT);
      canvas.noStroke();
      canvas.textSize(14);
      canvas.fill(0);
      canvas.text("UP", tx1, ty);
      canvas.text("- ROTATE", tx2, ty);
      ty += 15;
      canvas.text("LEFT", tx1, ty);
      canvas.text("- MOVE LEFT", tx2, ty);
      ty += 15;
      canvas.text("RIGHT", tx1, ty);
      canvas.text("- MOVE RIGHT", tx2, ty);
      ty += 15;
      canvas.text("DOWN", tx1, ty);
      canvas.text("- MOVE DOWN", tx2, ty);
      ty += 25;
      canvas.text("ENTER", tx1, ty);
      canvas.text("- RESTART", tx2, ty);
      ty += 15;
      canvas.text("SPACE", tx1, ty);
      canvas.text("- PAUSE", tx2, ty);
      ty += 15;
      canvas.text("E", tx1, ty);
      canvas.text("- END GAME", tx2, ty);
      ty += 15;
    }
  }
  displayGrid(pg, x, y, w, h, pallette) {
    var nx = this.tGrid.nx;
    var ny = this.tGrid.ny;
    var cw = w / nx;
    var ch = h / ny;
    // BG
    for (var gy = 0; gy < ny; gy++) {
      for (var gx = 0; gx < nx; gx++) {
        var cx = x + gx * cw;
        var cy = y + gy * ch;
        pg.stroke(44);
        if ((gx & 1) == 1) {
          pg.fill(66);
        } else {
          pg.fill(77);
        }
        pg.rect(cx, cy, cw, ch);
      }
    }
    // FG
    for (var gy = 0; gy < ny; gy++) {
      for (var gx = 0; gx < nx; gx++) {
        var cx = x + gx * cw;
        var cy = y + gy * ch;
        var valGrid = this.tGrid.getGridVal(gx, gy);
        if (valGrid > 0) {
          pg.stroke(0);
          var rgb = pallette[valGrid % pallette.length];
          pg.fill(rgb[0], rgb[1], rgb[2]);
          pg.rect(cx, cy, cw, ch);
        }
      }
    }
    // Shape
    var ks = this.tGrid.shapeSize;
    var kr = ceil(this.tGrid.shapeSize / 2.0);
    for (var ky = 0; ky < ks; ky++) {
      for (var kx = 0; kx < ks; kx++) {
        var gx = this.tGrid.sx + kx - kr;
        var gy = this.tGrid.sy + ky - kr;
        var cx = x + gx * cw;
        var cy = y + gy * ch;
        var valShape = this.tGrid.getShapeVal(kx, ky);
        if (valShape != 0) {
          pg.stroke(0);
          var rgb = pallette[valShape % pallette.length];
          pg.fill(rgb[0], rgb[1], rgb[2]);
          pg.rect(cx, cy, cw, ch);
        }
      }
    }
  }
  displayNextShape(pg, x, y, w, h) {
    var shape = this.shapeNext;
    var shapeSize = parseInt(sqrt(shape.length));
    var ks = shapeSize;
    var kr = shapeSize / 2.0;
    var cw = min(w / 5.0, h / 5.0);
    var ch = cw;
    for (var ky = 0; ky < ks; ky++) {
      for (var kx = 0; kx < ks; kx++) {
        var gx = kx - kr;
        var gy = ky - kr;
        var cx = x + gx * cw + w / 2.0;
        var cy = y + gy * ch + h / 2.0;
        cx = parseInt(cx);
        cy = parseInt(cy);
        var valShape = shape[ky * shapeSize + kx];
        if (valShape != 0) {
          pg.fill(200);
        } else {
          pg.fill(32);
        }
        pg.stroke(64);
        pg.rect(cx, cy, cw, ch);
      }
    }
  }
}

class Timer {
  constructor() {
    this.duration = 600;
    this.time = 0;
  }
  reset(duration) {
    this.setTime();
    this.duration = duration;
  }
  setTime() {
    this.time = millis();
  }
  getTime() {
    return millis() - this.time;
  }
  updateStep() {
    if (this.getTime() >= this.duration) {
      this.setTime();
      return true;
    }
    return false;
  }
}

class TGrid {
  constructor(nx, ny) {
    this.nx = nx;
    this.ny = ny;
    this.grid = [];
    this.grid.length = nx * ny;
    this.clearGrid();
    this.setShape([0]);
  }
  clearGrid() {
    for (var i = 0; i < this.grid.length; i++) {
      this.grid[i] = 0;
    }
  }
  isInsideGrid(x, y) {
    return x >= 0 && x < this.nx && y >= 0 && y < this.ny;
  }
  setShape(shape) {
    this.shape = shape;
    this.shapeSize = parseInt(sqrt(shape.length));
    this.sx = ceil(this.nx / 2);
    this.sy = ceil(this.shapeSize / 2);
  }
  getGridVal(x, y) {
    if (!this.isInsideGrid(x, y)) {
      return -1;
    } else {
      return this.grid[y * this.nx + x];
    }
  }
  setGridVal(x, y, val) {
    this.grid[y * this.nx + x] = val;
  }
  getShapeVal(x, y) {
    return this.shape[y * this.shapeSize + x];
  }
  rotateShapeDir(CW) {
    var size = this.shapeSize;
    var cpy = this.shape.slice(0);
    if (CW) {
      var ib = 0,
        ia = size * size;
      for (var y = 1; y <= size; y++, ia++) {
        for (var x = 1; x <= size; x++, ib++) {
          this.shape[ib] = cpy[ia - x * size];
        }
      }
    } else {
      var ib = 0,
        ia = -1;
      for (var y = 1; y <= size; y++, ia--) {
        for (var x = 1; x <= size; x++, ib++) {
          this.shape[ib] = cpy[ia + x * size];
        }
      }
    }
  }
  rotateShape() {
    this.rotateShapeDir(true);
    if (this.collision(0, 0)) {
      this.rotateShapeDir(false);
    }
  }

  collision(tx, ty) {
    var ks = this.shapeSize;
    var kr = ceil(this.shapeSize / 2);
    for (var ky = 0; ky < ks; ky++) {
      for (var kx = 0; kx < ks; kx++) {
        var px = this.sx + kx - kr + tx;
        var py = this.sy + ky - kr + ty;
        var valGrid = this.getGridVal(px, py);
        var valShape = this.getShapeVal(kx, ky);
        if (valGrid * valShape != 0) {
          return true;
        }
      }
    }
    return false;
  }
  updateRows() {
    var rows = 0;
    for (var gy = 0; gy < this.ny; gy++) {
      var rowCompleted = true;
      for (var gx = 0; gx < this.nx; gx++) {
        var gi = gy * this.nx + gx;
        if (this.grid[gi] == 0) rowCompleted = false;
      }
      if (rowCompleted) {
        this.grid.copyWithin(this.nx, 0, gy * this.nx);
        rows++;
        score += 10;
        console.log(score);
      }
    }
    if (rows > 0) {
      for (var gx = 0; gx < this.nx; gx++) {
        this.grid[gx] = 0;
      }
    }
    return rows;
  }
  splatShape() {
    let ks = this.shapeSize;
    let kr = ceil(this.shapeSize / 2);
    for (let ky = 0; ky < ks; ky++) {
      for (let kx = 0; kx < ks; kx++) {
        let px = this.sx + kx - kr;
        let py = this.sy + ky - kr;
        let valShape = this.getShapeVal(kx, ky);
        if (valShape != 0) {
          this.setGridVal(px, py, valShape);
        }
      }
    }
  }
}
