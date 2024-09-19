let rows = 9; let cols = 9;
let square_size = 45; //length and height of each square

function setup() {
    //create a canvas in the center of the screen
    var canvas = createCanvas(cols * square_size, rows * square_size);
    var center_x = (windowWidth - width) / 2;
    var center_y = (windowHeight - height) / 2;
    canvas.position(center_x, center_y);

    xpos = []; ypos = [];
    colorState = []; 
    numberState = [];
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

        colorState[index] = 1; //set all color states to 1 as default
        numberState[index] = 0;
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
      if (colorState[i] == 1) fill(255); //1 in colorState = white
      if (colorState[i] == -1) fill(0, 0, 200); //-1 in colorState = blue
      rect(xpos[i], ypos[i], sideLength, sideLength); //create square

      //prints the order the square positions are stored in the arrays:
      //shows each square's element in the position arrays
      fill('black');
      if (numberState[i] != 0) {
        textSize(24);
        textAlign(CENTER, CENTER);
        text(numberState[i], xpos[i], ypos[i]);
      }
    }

  }

  function mouseClicked() {
    //when the mouse is clicked, change the color state by negating the value
    for (i = 0; i < rows * cols; ++i) {
      //check if mouse position is within the current square
      if (dist(mouseX, 0, xpos[i], 0) < sideLength / 2 && dist(0, mouseY, 0, ypos[i]) < sideLength / 2) {
        colorState[i] = colorState[i] * -1;
        currSquare = i; // sets currSquare to the current square clicked on by mouse
        return;
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
        colorState[currSquare] = 1;
      }
    }
  }
