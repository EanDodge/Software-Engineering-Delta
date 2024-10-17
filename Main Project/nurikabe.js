let rows = 9; let cols = 9;
let square_size = 50; //length and height of each square
let square_states = 2; //number of color states each square can have
let puzzles = []; //will store the puzzle starting states and solution states
let rulesPopup;
let done = false;

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

function preload() {
  console.log("Attempting to load puzzles");
  puzzles = loadJSON('nurikabePuzzles.json', () => {
    console.log("Puzzles loaded successfully");
  }, () => {
    console.log("Failed to load puzzles");
  });
}

function setup() {
  console.log("Setup is being called");
  //create a canvas in the center of the screen
  canvas = createCanvas(cols * square_size, rows * square_size);
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

  // Create the pop-up text box using createDiv with the Nurikabe rules
  rulesPopup = createDiv(`
      <h2>Nurikabe rules:</h2>
      <ul>
          <li>"Islands" are made up of white squares, the blue squares are water</li>
          <li>Each numbered square is part of an island, with the number being the amount of white squares this island has</li>
          <li>Each island has only one numbered square</li>
          <li>Islands cannot touch horizontally or vertically (diagonally is ok)</li>
          <li>There cannot be 2x2 squares of water</li>
          <li>All water blocks must be connected</li>
      </ul>
  `).id('rulesPopup');
  rulesPopup.style('font-size', '16px');
  rulesPopup.style('padding', '10px');
  rulesPopup.style('background-color', '#fff');
  rulesPopup.style('border', '1px solid #000');
  rulesPopup.style('position', 'absolute');
  rulesPopup.style('left', '50%');
  rulesPopup.style('top', '50%');
  rulesPopup.style('transform', 'translate(-50%, -50%)');
  rulesPopup.style('display', 'none'); // Hide the pop-up initially

  // Create a button to show the pop-up
  let rulesButton = createButton('Rules');
  rulesButton.position(10, 60);
  rulesButton.mousePressed(showPopup);

  // Create a button inside the pop-up to close it
  let closeRules = createButton('Close');
  closeRules.mousePressed(hidePopup);
  closeRules.parent(rulesPopup); // Attach the button to the pop-up
  closeRules.style('position', 'absolute');
  closeRules.style('top', '10px');
  closeRules.style('right', '10px');

  // Create a button to show the pop-up
  let restartButton = createButton('Restart');
  restartButton.position(10, 110);
  restartButton.mousePressed(restart);

  //Choose random puzzle
  const keys = Object.keys(puzzles); //get all keys from the stored puzzles
  const randomKey = keys[Math.floor(Math.random() * keys.length)]; //choose a key at random
  selectedPuzzle = puzzles[randomKey]; //select the puzzle with this random key

  // format the puzzle start and puzzle solution like we need to use it: 
  window.cantClick = generateStartingColors(selectedPuzzle.puzzle); //cantClick = map(square index, value)
  window.solution_colors = generateSolutionColors(selectedPuzzle.solpuz); //solution_colors = array (0 for water, 1 for land, size 81)

  // Here is how the puzzle start and puzzle solution state is stored after generateStartingColors and generateSolutionColors:
  //   cantClick: new Map([
  //     [36, 2], [63, 3], [19, 3], [29, 1], [66, 3], [14, 4], [51, 3], [61, 4], [17, 2], [44, 4]
  //   ]);
  //   //0 = water, 1 = island (laid out to look just like the puzzle)
  //   solution_colors: [0, 0, 0, 0, 0, 0, 0, 0, 0, 
  //                     0, 1, 1, 0, 1, 1, 0, 1, 1, 
  //                     0, 1, 0, 0, 1, 0, 0, 0, 0, 
  //                     0, 0, 1, 0, 1, 0, 1, 1, 1,
  //                     1, 1, 0, 0, 0, 1, 0, 0, 1,
  //                     0, 0, 0, 1, 0, 1, 1, 0, 0,
  //                     0, 1, 0, 1, 0, 0, 0, 1, 0,
  //                     1, 1, 0, 1, 0, 1, 1, 1, 0,
  //                     0, 0, 0, 0, 0, 0, 0, 0, 0];
}

function draw() {
  var isSolved = true;
  //loop through all square position coordinates and color states
  for (i = 0; i < rows * cols; ++i) {
    if (!done) {
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
    }
    else {
      if (solution_colors[i] == 0) fill('green');
      else fill('white');
    }
    rect(xpos[i], ypos[i], sideLength, sideLength); //create square

    //draw numbers on the starting squares
    if (cantClick.has(i)) {
      fill('black');
      textSize(square_size * 0.6);
      textAlign(CENTER, CENTER);
      text(cantClick.get(i), xpos[i], ypos[i]);
    }
    // Uncomment for tile indices
    //==============================
    //fill('black');
    //text(i, xpos[i], ypos[i]);
    //==============================
  }
  if (isSolved) done = true;
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

function generateStartingColors(puzzle) {
  cantClickMap = new Map();
  for (let i = 0; i < puzzle.length; ++i) {
    const char = puzzle[i];
    if (char !== '.' && char !== ' ') { // Only process numbers
      const key = parseInt(char); // Convert character to integer
      cantClickMap.set(i, key);
    }
  }
  return cantClickMap;
}

function generateSolutionColors(solpuz) {
  var solution_colors = [];
  for (var i = 0; i < solpuz.length; i++) {
    solution_colors.push(solpuz[i] !== '#' ? 1 : 0);
  }
  return solution_colors;
}

function showPopup() {
  rulesPopup.style('display', 'block'); // Show the pop-up
}

function hidePopup() {
  rulesPopup.style('display', 'none'); // Hide the pop-up
}

//Reset all the colors when "Restart" button is pressed
function restart() {
  for (let i = 0; i < colorState.length; ++i) colorState[i] = 0;
}