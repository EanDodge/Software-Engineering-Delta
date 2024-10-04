let rows = 9; let cols = 9;
let square_size = 50; //length and height of each square
let square_states = 2; //number of color states each square can have
let puzzles = []; //will store the puzzle starting states and solution states

//==================================================================================================================
// Nurikabe rules:
// -"Islands" are made up of white squares, the blue squares are water
// -Each starting square is part of an island, the amount of white squares this island has is listed on the square
// -Each island has only one numbered square
// -Islands cannot touch horizontally or vertically (diagonally is ok)
// -There cannot be 2x2 squares of water
// -All water blocks must be connected
// (Sounds like a lot but it's really not too bad I swear)
//==================================================================================================================

function setup() {
    //create a canvas in the center of the screen
    var canvas = createCanvas(cols * square_size, rows * square_size);
    var center_x = (windowWidth - width) / 2;
    var center_y = (windowHeight - height) / 2;
    canvas.position(center_x, center_y);

    xpos = []; ypos = [];
    colorState = []; 
    sideLength = square_size;
    for (i = 0; i < rows; ++i) {
      for (j = 0; j < cols; ++j) {
        //calculate the index where info will be stored
        var index = (i * cols) + j;

        //calculate and store all the x-coordinates of square centers
        xpos[index] = (j * sideLength) + (sideLength / 2);
        
        //calculate and store all the y-coordinates of square centers
        ypos[index] = (i * sideLength) + (sideLength / 2);

        colorState[index] = 0; //set all color states to 0 as default
      }
    }
    
    //set coordinates used to create square to be the center 
    //of the square instead of the top-left corner
    rectMode(CENTER);

    background(220); //gray background

    // puzzles[0]
    puzzles.push({
      //[square index, square value]
      cantClick: new Map([
        [36, 2], [63, 3], [19, 3], [29, 1], [66, 3], [14, 4], [51, 3], [61, 4], [17, 2], [44, 4]
      ]),
      //0 = water, 1 = island (laid out to look just like the puzzle)
      solution_colors: [0, 0, 0, 0, 0, 0, 0, 0, 0, 
                        0, 1, 1, 0, 1, 1, 0, 1, 1, 
                        0, 1, 0, 0, 1, 0, 0, 0, 0, 
                        0, 0, 1, 0, 1, 0, 1, 1, 1,
                        1, 1, 0, 0, 0, 1, 0, 0, 1,
                        0, 0, 0, 1, 0, 1, 1, 0, 0,
                        0, 1, 0, 1, 0, 0, 0, 1, 0,
                        1, 1, 0, 1, 0, 1, 1, 1, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0]
    });

    //puzzles[1]
    puzzles.push({
      cantClick: new Map([
        [1, 6], [16, 4], [23, 2], [31, 2], [49, 2], [57, 7], [64, 1], [79, 4]
      ]),
      solution_colors: [0, 1, 0, 0, 0, 0, 0, 0, 0, 
                        0, 1, 1, 1, 0, 1, 0, 1, 0, 
                        0, 1, 0, 0, 0, 1, 0, 1, 0, 
                        0, 1, 0, 1, 1, 0, 1, 1, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 1, 1, 0, 1, 1, 0, 1, 0,
                        0, 0, 1, 1, 0, 0, 0, 1, 0,
                        0, 1, 0, 1, 1, 1, 0, 1, 0,
                        0, 0, 0, 0, 0, 0, 0, 1, 0]
    });

    //puzzles[2]
    puzzles.push({
      cantClick: new Map([
        [4, 5], [10, 3], [28, 2], [32, 6], [48, 2], [52, 3], [70, 1], [76, 6]
      ]),
      solution_colors: [0, 0, 0, 0, 1, 0, 0, 0, 0,
                        0, 1, 1, 0, 1, 1, 1, 1, 0,
                        0, 0, 1, 0, 0, 0, 0, 0, 0,
                        0, 1, 0, 0, 1, 1, 0, 1, 0,
                        0, 1, 0, 1, 0, 1, 0, 1, 0,
                        0, 0, 0, 1, 0, 1, 0, 1, 0,
                        0, 1, 0, 0, 0, 1, 0, 0, 0,
                        0, 1, 1, 1, 0, 1, 0, 1, 0,
                        0, 0, 0, 1, 1, 0, 0, 0, 0]
    });

    //puzzles[3]
    puzzles.push({
      cantClick: new Map([
        [2, 3], [12, 4], [23, 5], [25, 6], [55, 8], [57, 2], [68, 2], [78, 1]
      ]),
      solution_colors: [1, 1, 1, 0, 0, 1, 1, 1, 0,
                        0, 0, 0, 1, 0, 1, 0, 0, 0,
                        0, 1, 1, 1, 0, 1, 0, 1, 0,
                        0, 0, 0, 0, 0, 0, 0, 1, 0,
                        0, 1, 1, 1, 1, 1, 0, 1, 0,
                        0, 1, 0, 0, 0, 0, 0, 1, 0,
                        0, 1, 0, 1, 0, 1, 0, 1, 0,
                        0, 1, 0, 1, 0, 1, 0, 1, 0,
                        0, 0, 0, 0, 0, 0, 1, 0, 0]
    });

    //puzzles[4]
    puzzles.push({
      cantClick: new Map([
        [10, 1], [26, 5], [30, 3], [34, 5], [46, 5], [50, 4], [54, 4], [70, 1]
      ]),
      solution_colors: [0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 1, 0, 1, 0, 1, 1, 1, 1,
                        0, 0, 0, 1, 0, 0, 0, 0, 1,
                        0, 1, 0, 1, 0, 1, 1, 1, 0,
                        0, 1, 0, 0, 0, 0, 0, 1, 0,
                        0, 1, 1, 1, 0, 1, 0, 1, 0,
                        1, 0, 0, 0, 0, 1, 0, 0, 0,
                        1, 1, 1, 0, 1, 1, 0, 1, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0]
    });

    //puzzles[5] (hard)
    puzzles.push({
      cantClick: new Map([
        [8, 1], [11, 5], [14, 6], [24, 2], [56, 8], [66, 7], [69, 3], [72, 7]
      ]),
      solution_colors: [1, 1, 1, 0, 1, 1, 1, 0, 1,
                        0, 0, 1, 0, 1, 1, 0, 0, 0,
                        1, 0, 1, 0, 1, 0, 1, 1, 0,
                        1, 0, 0, 0, 0, 0, 0, 0, 0,
                        1, 0, 1, 1, 1, 1, 1, 1, 0,
                        1, 0, 1, 0, 0, 0, 0, 0, 0,
                        1, 0, 1, 0, 1, 1, 0, 1, 0,
                        1, 0, 0, 1, 1, 0, 1, 1, 0,
                        1, 0, 1, 1, 1, 0, 0, 0, 0]
    });

    //puzzles[6]
    puzzles.push({
      cantClick: new Map([
        [6, 4], [16, 5], [19, 3], [27, 7], [53, 3], [61, 3], [64, 4], [74, 6]
      ]),
      solution_colors: [0, 0, 0, 1, 1, 1, 1, 0, 0,
                        0, 1, 0, 0, 0, 0, 0, 1, 0,
                        0, 1, 1, 0, 1, 1, 1, 1, 0,
                        1, 0, 0, 0, 0, 0, 0, 0, 0,
                        1, 1, 1, 1, 1, 1, 0, 1, 1,
                        0, 0, 0, 0, 0, 0, 0, 0, 1,
                        0, 1, 1, 1, 0, 1, 1, 1, 0,
                        0, 1, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 1, 1, 1, 1, 1, 1, 0]
    });

    //puzzles[7]
    puzzles.push({
      cantClick: new Map([
        [1, 5], [5, 6], [12, 2], [17, 3], [63, 3], [68, 4], [75, 4], [79, 5]
      ]),
      solution_colors: [0, 1, 0, 1, 0, 1, 0, 0, 0,
                        0, 1, 0, 1, 0, 1, 0, 1, 1,
                        0, 1, 0, 0, 0, 1, 0, 1, 0,
                        0, 1, 0, 1, 1, 1, 0, 0, 0,
                        0, 1, 0, 0, 0, 0, 0, 1, 0,
                        0, 0, 0, 1, 0, 1, 0, 1, 0,
                        0, 1, 0, 1, 0, 1, 0, 1, 0,
                        1, 1, 0, 1, 0, 1, 0, 1, 0,
                        0, 0, 0, 1, 0, 1, 0, 1, 0]
    });

    //puzzles[8]
    puzzles.push({
      cantClick: new Map([
        [8, 3], [13, 6], [26, 4], [30, 2], [36, 1], [44, 1], [50, 3], [54, 5], [67, 4], [72, 3]
      ]),
      solution_colors: [0, 0, 0, 0, 0, 0, 1, 1, 1,
                        0, 1, 1, 1, 1, 0, 0, 0, 0,
                        0, 1, 0, 0, 0, 0, 1, 1, 1,
                        0, 1, 0, 1, 1, 0, 1, 0, 0,
                        1, 0, 0, 0, 0, 0, 0, 0, 1,
                        0, 0, 1, 1, 0, 1, 1, 1, 0,
                        1, 1, 1, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 1, 1, 1, 1, 0,
                        1, 1, 1, 0, 0, 0, 0, 0, 0]
    });

    //puzzles[9]
    puzzles.push({
      cantClick: new Map([
        [1, 2], [17, 5], [19, 4], [27, 2], [38, 2], [42, 2], [53, 4], [61, 4], [63, 2], [79, 8]
      ]),
      solution_colors: [1, 1, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 1, 0, 1, 1, 1, 1,
                        0, 1, 1, 1, 0, 1, 0, 0, 0,
                        1, 0, 0, 0, 0, 0, 0, 1, 1,
                        1, 0, 1, 1, 0, 1, 1, 0, 1,
                        0, 0, 0, 0, 0, 0, 0, 0, 1,
                        1, 0, 1, 0, 1, 1, 1, 1, 0,
                        1, 0, 1, 0, 0, 0, 0, 0, 0,
                        0, 0, 1, 1, 1, 1, 1, 1, 0]
    });

    //puzzles[10]
    puzzles.push({
      cantClick: new Map([
        [3, 9], [16, 8], [29, 3], [39, 3], [41, 4], [51, 6], [64, 1], [77, 2]
      ]),
      solution_colors: [1, 1, 1, 1, 0, 0, 0, 0, 0,
                        1, 0, 0, 0, 0, 1, 0, 1, 0,
                        1, 0, 1, 1, 0, 1, 0, 1, 0,
                        1, 0, 1, 0, 0, 1, 0, 1, 1,
                        1, 0, 0, 1, 0, 1, 0, 0, 1,
                        1, 0, 1, 1, 0, 0, 1, 0, 1,
                        0, 0, 0, 0, 1, 1, 1, 0, 1,
                        0, 1, 0, 1, 1, 0, 0, 0, 1,
                        0, 0, 0, 0, 0, 1, 1, 0, 0]
    });

    //puzzles[11]
    puzzles.push({
      cantClick: new Map([
        [0, 4], [16, 4], [18, 6], [24, 3], [34, 1], [46, 2], [56, 5], [62, 3], [64, 6], [80, 4]
      ]),
      solution_colors: [1, 1, 1, 1, 0, 1, 1, 1, 0,
                        0, 0, 0, 0, 0, 0, 0, 1, 0,
                        1, 1, 1, 1, 0, 1, 1, 0, 0,
                        0, 0, 0, 1, 0, 1, 0, 1, 0,
                        0, 1, 0, 1, 0, 0, 0, 0, 0,
                        0, 1, 0, 0, 0, 1, 0, 1, 0,
                        0, 0, 1, 1, 1, 1, 0, 1, 1,
                        1, 1, 0, 0, 0, 0, 0, 0, 0,
                        1, 1, 1, 1, 0, 1, 1, 1, 1]
    });

  puzzle_index = Math.floor(Math.random() * puzzles.length);
}
  
  function draw() {
    var isSolved = true;
    //loop through all square position coordinates and color states
    for (i = 0; i < rows * cols; ++i) {
      //making all the starting squares unclickable
      if (puzzles[puzzle_index].cantClick.has(i)) {
        fill('white');
      }
      else {
        if (colorState[i] == 0) fill(0, 0, 200); //0 in colorState = blue
        if (colorState[i] == 1) fill('white'); //1 in colorState = white
        //if there's any difference between the current color states and the solution's color states, the puzzle is not solved
        if (colorState[i] != puzzles[puzzle_index].solution_colors[i]) {
          isSolved = false;
        }
      }
      rect(xpos[i], ypos[i], sideLength, sideLength); //create square
      
      //draw numbers on the starting squares
      if (puzzles[puzzle_index].cantClick.has(i)) {
        fill('black');
        textSize(square_size * 0.6);
        textAlign(CENTER, CENTER);
        text(puzzles[puzzle_index].cantClick.get(i), xpos[i], ypos[i]);
      }
      // Uncomment for tile indexes
      //==============================
      //fill('black');
      //text(i, xpos[i], ypos[i]);
      //==============================
    }
    if (isSolved) {
      fill(0, 250, 200);
      rect(width / 2, height / 2, 100, 100);
    }
    // for comparing the current state to the solution with the web editor:
    // print(colorState); //current state
    // print(solution_colors); //solution state
    // print('=========='); //divider lol
  }

  function mouseClicked() {
    //when the mouse is clicked, change the color state by negating the value
    for (i = 0; i < rows * cols; ++i) {
      //check if mouse position is within the current square
      if (dist(mouseX, 0, xpos[i], 0) < sideLength / 2 && dist(0, mouseY, 0, ypos[i]) < sideLength / 2) {
        ++colorState[i];
        colorState[i] = colorState[i] % square_states;
        return;
      }
    }
  }
