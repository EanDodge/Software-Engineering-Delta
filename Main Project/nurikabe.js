let rows = 9; let cols = 9;
let square_size = 45; //length and height of each square
let square_states = 2; //number of color states each square can have

function setup() {
    //create a canvas in the center of the screen
    var canvas = createCanvas(cols * square_size, rows * square_size);
    var center_x = (windowWidth - width) / 2;
    var center_y = (windowHeight - height) / 2;
    canvas.position(center_x, center_y);

    xpos = []; ypos = [];
    colorState = []; 
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

        colorState[index] = 0; //set all color states to 0 as default
      }
    }
    
    //set coordinates used to create square to be the center 
    //of the square instead of the top-left corner
    rectMode(CENTER);

    background(220); //gray background

    //specifies the indexes of the starting squares, as well as the values they will show
    cantClick = new Map([
        [4, 2], [7, 3], [11, 3], [21, 1], [34, 3], [46, 4], [59, 3], [69, 4], [73, 2], [76, 4]
    ]);
    //first row is left column top-to-bottom, second row is second column, etc
    solution_colors = [0, 0, 0, 0, 1, 0, 0, 1, 0, 
                       0, 1, 1, 0, 1, 0, 1, 1, 0, 
                       0, 1, 0, 1, 0, 0, 0, 0, 0, 
                       0, 0, 0, 0, 0, 1, 1, 1, 0,
                       0, 1, 1, 1, 0, 0, 0, 0, 0,
                       0, 1, 0, 0, 1, 1, 0, 1, 0,
                       0, 0, 0, 1, 0, 1, 0, 1, 0,
                       0, 1, 0, 1, 0, 0, 1, 1, 0,
                       0, 1, 0, 1, 1, 0, 0, 0, 0];
  }
  
  function draw() {
    var isSolved = true;
    //loop through all square position coordinates and color states
    for (i = 0; i < rows * cols; ++i) {
      //making all the starting squares unclickable
      if (cantClick.has(i)) {
        fill('white');
      }
      else {
        if (colorState[i] == 0) fill(0, 0, 200); //0 in colorState = blue
        if (colorState[i] == 1) fill('white'); //1 in colorState = white
        //if there's any difference between the current color states and the solution's color states, the puzzle is not solved
        if (colorState[i] != solution_colors[i]) {
          isSolved = false;
        }
      }
      rect(xpos[i], ypos[i], sideLength, sideLength); //create square
      
      //draw numbers on the starting squares
      if (cantClick.has(i)) {
        fill('black');
        textSize(24);
        textAlign(CENTER, CENTER);
        text(cantClick.get(i), xpos[i], ypos[i]);
      }
    }
    if (isSolved) {
      fill(0, 250, 200);
      rect(width / 2, height / 2, 100, 100);
    }
    print(colorState);
    print(solution_colors);
    print('==========');
  }

  function mouseClicked() {
    //when the mouse is clicked, change the color state by negating the value
    for (i = 0; i < rows * cols; ++i) {
      //check if mouse position is within the current square
      if (dist(mouseX, 0, xpos[i], 0) < sideLength / 2 && dist(0, mouseY, 0, ypos[i]) < sideLength / 2) {
        ++colorState[i];
        colorState[i] = colorState[i] % square_states;
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
