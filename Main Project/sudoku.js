let rows = 9; let cols = 9;
let square_size = 45; //length and height of each square
let square_states = 4; //number of color states each square can have
let interval = 30;

// Here for globlal, needed for testing
let incompletedGame = true;

// Retrieves a random sudoku pattern from 'sudokuPick.js'
let indexForSudoku = giveSudokuIndex();
let sudoku = sudoku_samples[indexForSudoku];
let sudoku_solution = sudoku_answers[indexForSudoku];

function setup() {
    //create a canvas in the center of the screen
    canvas = createCanvas(cols * square_size, rows * square_size);
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

        colorState[index] = 0; //set all color states to 1 as default
        numberState[index] = +sudoku[index];
        if (numberState[index] != 0) {
          colorState[index] = 2;
          editable[index] = false;
        } else {
          editable[index] = true;
        }
      }
    }
    
    //set coordinates used to create square to be the center 
    //of the square instead of the top-left corner
    rectMode(CENTER);

    background(220); //gray background

  }

  
  function draw() {
    //loop through all square position coordinates and color states
    for (i = 0; i < rows * cols; ++i) {
      if (colorState[i] == 0) fill(255); //1 in colorState = white
      if (colorState[i] == 1) fill(0, 0, 200); //-1 in colorState = blue
      if (colorState[i] == 2) fill(220);
      strokeWeight(1);
      rect(xpos[i], ypos[i], sideLength, sideLength); //create square
      

      // Next four ifs:
      // Create the grid-like sanctions, divide the grid into 9 equal parts
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
      if (dist(mouseX, 0, xpos[i], 0) < sideLength / 2 && dist(0, mouseY, 0, ypos[i]) < sideLength / 2 && editable[i]) {
        if (colorState[i] == 0) {
          colorState[i] = 1;
        } else if (colorState[i] == 1) {
          colorState[i] = 0;
        }
        currSquare = i; // sets currSquare to the current square clicked on by mouse
        return;
      }
    }
    currSquare = -1;
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
    if (numberState[i] != +sudoku_solution[i]) {
      fill('red');
    }
  }

  // Sets incompletedGame to false if game state doesn't match solution, true if complete
  function check_sudoku() {
    for (i = 0; i < rows*cols; ++i) {
      if (numberState[i] != +sudoku_solution[i]) {
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

  // Sets game state to complete to show complete state; Demo purposes
  function autoComplete() {
    for (i = 0; i < rows*cols; ++i) {
      numberState[i] = +sudoku_solution[i];
    }
  }