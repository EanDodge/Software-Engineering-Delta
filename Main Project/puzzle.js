let rows = 9; let cols = 9;
let square_size = 45; //length and height of each square
<<<<<<< HEAD
let square_states = 4; //number of color states each square can have
let interval = 30;

let sudoku_example = "500020000030000080900058470001000060703000502020000300069230007070000020000090004";
//let sudoku_example = "548723196637419285912658473851342769793861542426975318169234857374586921285197630";
let sudoku_answer = "548723196637419285912658473851342769793861542426975318169234857374586921285197634";
=======
let square_states = 3; //number of color states each square can have
>>>>>>> 41aff69315f6b3665c8bf9cc339c39e656a0d855

function setup() {
    //create a canvas in the center of the screen
    var canvas = createCanvas(cols * square_size, rows * square_size);
    var center_x = (windowWidth - width) / 2;
    var center_y = (windowHeight - height) / 2;
    canvas.position(center_x, center_y);

    xpos = []; ypos = [];
    colorState = []; 
    numberState = [];
    editable = [];
    currSquare = -1;
    sideLength = square_size;
    for (i = 0; i < cols; ++i) {
      for (j = 0; j < rows; ++j) {
        //calculate the index where info will be stored
        var index = (i * rows) + j;

        //calculate and store all the x-coordinates of square centers
        xpos[index] = (i * sideLength) + (sideLength / 2);
        //calculate and store all the y-coordinates of square centers
        ypos[index] = (j * sideLength) + (sideLength / 2);

<<<<<<< HEAD
        colorState[index] = 0; //set all color states to 1 as default
        numberState[index] = +sudoku_example[index];
        if (numberState[index] != 0) {
          colorState[index] = 4;
          editable[index] = false;
        } else {
          editable[index] = true;
        }
=======
        colorState[index] = 0; //set all color states to 0 as default
        numberState[index] = 0;
>>>>>>> 41aff69315f6b3665c8bf9cc339c39e656a0d855
      }
    }
    
    //set coordinates used to create square to be the center 
    //of the square instead of the top-left corner
    rectMode(CENTER);

    background(220); //gray background

    cantClick = [1, 10, 20, 25, 70]; //specifies which squares cannot be clicked
  }

  
  function draw() {
    //loop through all square position coordinates and color states
    for (i = 0; i < rows * cols; ++i) {
<<<<<<< HEAD
      if (colorState[i] == 0) fill(255); //1 in colorState = white
      if (colorState[i] == 1) fill(0, 0, 200); //-1 in colorState = blue
      if (colorState[i] == 2) fill(150, 150, 150);
      if (colorState[i] == 3) fill(200, 100, 0);
      if (colorState[i] == 4) fill(220);
      strokeWeight(1);
=======
      if (cantClick.includes(i)) {
        fill(200, 50, 50);
      }
      else {
        if (colorState[i] == 0) fill(255); //0 in colorState = white
        if (colorState[i] == 1) fill(0, 0, 200); //1 in colorState = blue
        if (colorState[i] == 2) fill(150, 150, 150);
        //if (colorState[i] == 3) fill(200, 100, 0);
      }
>>>>>>> 41aff69315f6b3665c8bf9cc339c39e656a0d855
      rect(xpos[i], ypos[i], sideLength, sideLength); //create square
      
      if (i <= rows-1) { 
        strokeWeight(6);
        line(xpos[i] - sideLength/2, ypos[i] - sideLength/2, xpos[i] - sideLength/2, ypos[i] + sideLength/2);
      }
      if (i % rows == 0) {
        strokeWeight(6);
        line(xpos[i] - sideLength/2, ypos[i] - sideLength/2, xpos[i] + sideLength/2, ypos[i] - sideLength/2);
      }
      if ((i >= ((rows*cols)-rows)  && i <= ((rows*cols)-1))
        || ((i >= (rows)*2) && (i <= (rows-1)*3.3)) 
        || ((i >= (rows)*5) && (i <= (rows-1)*6.7))){
        strokeWeight(6);
        line(xpos[i] + sideLength/2, ypos[i] - sideLength/2, xpos[i] + sideLength/2, ypos[i] + sideLength/2);
      }
      if ((i % cols == (cols - 1))
        || ((i % cols+3 == (cols - 1)))
        || ((i % cols+6 == (cols - 1)))) {
        strokeWeight(6);
        line(xpos[i] + sideLength/2, ypos[i] + sideLength/2, xpos[i] - sideLength/2, ypos[i] + sideLength/2);
      }

      strokeWeight(1);
      //prints the order the square positions are stored in the arrays:
      //shows each square's element in the position arrays
      fill('black');
      if (numberState[i] != 0) {
        check_key_entered(i);
        textSize(24);
        textStyle(NORMAL);
        if (editable[i] == false) textStyle(BOLD);
        textAlign(CENTER, CENTER);
        text(numberState[i], xpos[i], ypos[i]);
      }
    }
    if (frameCount % interval === 0) check_sudoku();
  }

  function mouseClicked() {
    //when the mouse is clicked, change the color state by negating the value
    for (i = 0; i < rows * cols; ++i) {
      //check if mouse position is within the current square
<<<<<<< HEAD
      if (dist(mouseX, 0, xpos[i], 0) < sideLength / 2 && dist(0, mouseY, 0, ypos[i]) < sideLength / 2 && editable[i]) {
=======
      if (dist(mouseX, 0, xpos[i], 0) < sideLength / 2 && dist(0, mouseY, 0, ypos[i]) < sideLength / 2) {
>>>>>>> 41aff69315f6b3665c8bf9cc339c39e656a0d855
        ++colorState[i];
        colorState[i] = colorState[i] % square_states;
        currSquare = i; // sets currSquare to the current square clicked on by mouse
        return;
      } else {
        currSquare = -1;
      }
    }
  }

  function keyPressed() {
    // If a square has been clicked on by mouse
    if (currSquare != -1) {
      // And the key pressed is between [1-9](range is set by values reflected in Sudoku)
      if (key >= '1' && key <= '9') {
        // Sets value for corresponding square equal to key pressed
        numberState[currSquare] = key;
        colorState[currSquare] = 0;
      }
      if (keyCode === BACKSPACE) {
        numberState[currSquare] = 0;
        colorState[currSquare] = 0;
      }
    }
  }

  // Sets text to red if key entered is wrong
  function check_key_entered(i) {
    if (numberState[i] != +sudoku_answer[i]) {
      fill('red');
    }
  }

  function check_sudoku() {
    let incompletedGame = true;
    for (i = 0; i < rows*cols; ++i) {
      if (numberState[i] != +sudoku_answer[i]) {
        incompletedGame = false;
        break;
      }
    }

    if (incompletedGame) {
      background(220);
      fill('black');
      textSize(50);
      textAlign(CENTER, CENTER);
      text("Complete.", width/2, height/2);
      noLoop();
    }
  }

