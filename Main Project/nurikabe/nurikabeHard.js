let rows = 11; let cols = 11;
let square_size = 50; //length and height of each square
let square_states = 2; //number of color states each square can have
let puzzles = []; //will store the puzzle starting states and solution states
let rulesPopup;
let done, winnerPopup = false;
let hintSquares = []; let cantBeHint = [];

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
  puzzles = loadJSON('nurikabePuzzlesHard.json', () => {
    console.log("Puzzles loaded successfully");
  }, () => {
    console.log("Failed to load puzzles");
  });
  backgroundMusic = loadSound('../music/PuzzleBop.wav');
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
  rulesPopup.style('left', '77%'); //put rules popup to the right of the puzzle
  rulesPopup.style('top', '50%');
  rulesPopup.style('transform', 'translate(-50%, -50%)');
  rulesPopup.style('display', 'none'); // Hide the pop-up initially

  // Create a button to show rules pop-up
  let rulesButton = createButton('Rules');
  rulesButton.position(10, 60);
  rulesButton.mousePressed(showPopup);

  // Create a button inside rules pop-up to close it
  let closeRules = createButton('Close');
  closeRules.mousePressed(hidePopup);
  closeRules.parent(rulesPopup); // Attach the button to the pop-up
  closeRules.style('position', 'absolute');
  closeRules.style('top', '10px');
  closeRules.style('right', '10px');

  // Create a button to restart the puzzle
  let restartButton = createButton('Restart');
  restartButton.position(10, 110);
  restartButton.mousePressed(restart);

  // Create a button to restart the puzzle
  let solveButton = createButton('Solve');
  solveButton.position(10, 160);
  solveButton.mousePressed(solve);

  let hintButton = createButton('Hint');
  hintButton.position(10, 210);
  hintButton.mousePressed(hint);

  //Choose random puzzle
  const keys = Object.keys(puzzles); //get all keys from the stored puzzles
  const randomKey = keys[Math.floor(Math.random() * keys.length)]; //choose a key at random
  selectedPuzzle = puzzles[randomKey]; //select the puzzle with this random key

  // format the puzzle start and puzzle solution like we need to use it: 
  window.cantClick = generateStartingColors(selectedPuzzle.puzzle); //cantClick = map(square index, value)
  window.solution_colors = generateSolutionColors(selectedPuzzle.solpuz); //solution_colors = array (0 for water, 1 for land, size row * col)

  loadMusic();
}

function loadMusic() {
	userStartAudio(); //music starts playing when user interacts with browser
  backgroundMusic.setVolume(0.5);
	backgroundMusic.play();
  backgroundMusic.loop();
}

function draw() {
  var isSolved = true;
  // Variable that will track which square is hovered
  let hoverSquare = -1;
  
  // Loop through all square position coordinates and color states
  for (i = 0; i < rows * cols; ++i) {
    if (!done) {
      //get index of square currently hovered over
      if (dist(mouseX, 0, xpos[i], 0) < sideLength / 2 && dist(0, mouseY, 0, ypos[i]) < sideLength / 2) {
        hoverSquare = i;
      }

      // Draw the background for the current square based on its state
      if (cantClick.has(i)) {
        fill('white');
      } 
      else {
        if (colorState[i] == 0) fill(0, 0, 200); // 0 = blue (water)
        if (colorState[i] == 1) fill('white');   // 1 = white (land)
        if (colorState[i] != solution_colors[i]) isSolved = false;
      }
      //apply hover effect for squares that aren't numbered squares or hint squares
      if (!hintSquares.includes(i) && !cantClick.has(i)) {
        if (i === hoverSquare) {
          if (colorState[i] == 0) {
            fill(0, 0, 175); //slightly darker blue
          }
          else fill(230, 230, 230); //light grey
        }
      }

      rect(xpos[i], ypos[i], sideLength, sideLength); // Create square
    }
    else {
      //make water squares green when puzzle completes
      if (solution_colors[i] == 0) fill('green');
      else fill('white');
      rect(xpos[i], ypos[i], sideLength, sideLength);
    }

    //Draw number on starting squares
    strokeWeight(0); // Set no stroke weight so text doesn't get borders
      // Draw numbers on starting squares
      if (cantClick.has(i)) {
        fill('black');
        textSize(square_size * 0.6);
        textAlign(CENTER, CENTER);
        text(cantClick.get(i), xpos[i], ypos[i]); // Draw number
      }
    strokeWeight(1); // Reset stroke weight for next iteration
  }

  if (!done) {
    //Draw green outline for hint squares last so they appear on top
    hintSquares.forEach((index) => {
      noFill();                // No fill for outline
      stroke('green');         // Green border for hint squares
      strokeWeight(3);         // Thicker stroke for visibility
      rect(xpos[index], ypos[index], sideLength, sideLength); // Draw the green outline
    });

    // Reset stroke settings after drawing outlines
    strokeWeight(1);
    stroke('black');
  }
  
  if (isSolved && !done && !winnerPopup) {
    winnerPopup = true;
    winnerText();
    done = true;
  }
}


function mouseClicked() {
  //when the mouse is clicked, change the color state by negating the value
  for (i = 0; i < rows * cols; ++i) {
    if (!hintSquares.includes(i)) {
      //check if mouse position is within the current square
      if (dist(mouseX, 0, xpos[i], 0) < sideLength / 2 && dist(0, mouseY, 0, ypos[i]) < sideLength / 2) {
        ++colorState[i];
        colorState[i] = colorState[i] % square_states;
        return;
      }
    }
  }
}

function generateStartingColors(puzzle) {
  cantClickMap = new Map();
  for (let i = 0; i < puzzle.length; ++i) {
    const char = puzzle[i];
    if (char !== '.' && char !== ' ') { // Only process numbers
      const key = parseInt(char, 16); // Convert character to integer using base 16
      if (!isNaN(key)) { // Ensure char was a valid hex digit
        cantClickMap.set(i, key);
      }
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
  for (let i = 0; i < colorState.length; ++i) {
    if (!hintSquares.includes(i)) colorState[i] = 0; //only reset squares not part of hints
  }
}

//Set current color state to the solution colors to solve the puzzle
function solve() {
  colorState = solution_colors;
  //freeze canvas after one more loop of draw()
  redraw();
  noLoop();
}

//gives the player a hint
async function hint() {
  // Check if the no more hints popup already exists
  if (document.getElementById("noHint")) {
    return; // Exit the function if the popup is already displayed
  }

  let availableHintIndices = [];
  for (let i = 0; i < rows * cols - rows; ++i) {
    if (i % rows !== rows - 1) availableHintIndices.push(i);
  }
  let topLeft; // Declare topLeft
  do {
    topLeft = Math.floor(Math.random() * (rows * cols - rows)); // Generate a random index between 0 and 71 (all rows but the bottom one)
    
    // Filter out any positions that are in cantBeHint
    availableHintIndices = availableHintIndices.filter(pos => !cantBeHint.includes(pos));

    //if there are no more available locations for hint
    if (availableHintIndices.length === 0) {
      console.log("No more available places for a hint.");
      let noMoreHint = createDiv(`<h2>No more available places for a hint.</h2>`).id(`noHint`);
      noMoreHint.style('font-size', '16px');
      noMoreHint.style('padding', '10px');
      noMoreHint.style('background-color', '#fff');
      noMoreHint.style('border', '1px solid #000');
      noMoreHint.style('position', 'absolute');
      noMoreHint.style('left', '50%');
      noMoreHint.style('top', '50%');
      noMoreHint.style('transform', 'translate(-50%, -50%)');
      noMoreHint.style('z-index', '1000');
      noMoreHint.style('opacity', '1');

      await new Promise(r => setTimeout(r, 700)); //wait a lil
      // Gradually decrease opacity
      let opacity = 100;
      let fadeInterval = setInterval(() => {
        opacity -= 5; // Decrease opacity value, adjust as needed for speed
        noMoreHint.style('opacity', opacity / 100);

        // Stop the interval once fully invisible
        if (opacity <= 0) {
          clearInterval(fadeInterval);
          noMoreHint.remove(); // Remove the popup from the DOM, so it can appear again if the hint button is clicked again
        }
      }, 50); // Adjust the interval time to control the speed of the fade-out

      return; // Terminate the function if there are no available positions left
    }
  } while (topLeft % rows === rows - 1 || cantBeHint.includes(topLeft)); // Keep generating until it's not in the right column and not in a place that would overlap another hint

  hintSquares.push(topLeft, topLeft + 1, topLeft + rows, topLeft + rows + 1); //generate the three other squares of the 2x2 hint square
  cantBeHint.push(topLeft, topLeft + 1, topLeft + rows, topLeft + rows + 1, topLeft - rows + 1, topLeft - rows, topLeft - rows - 1, topLeft - 1, topLeft + rows - 1); //any topLeft whose hint square would intersect with another hintSquares cannot be hint

  // For each square in hintSquares, set the colorState to the correct solution and make it unclickable
  hintSquares.forEach((index) => {
    colorState[index] = solution_colors[index]; // Set the correct color from the solution
  });

  // console.log(topLeft);
  // console.log(hintSquares); // Log the value for debugging
  // console.log(cantBeHint);
}

async function winnerText() {
  await new Promise(r => setTimeout(r, 2000)); //wait a sec

  var coins_earned = Math.floor(Math.random() * (1000 - 100) + 100); //generate random number between 100 and 1000

  winner = createDiv(`
    <h2>Congrats!</h2>
    <p>You have opened the treasure chest.</p>
    <p>You've earned ${coins_earned} doubloons!</p>
  `).id(`completionText`);
  // After creating the element, add an id to it
  winner.style('font-size', '16px');
  winner.style('padding', '10px');
  winner.style('background-color', '#fff');
  winner.style('border', '1px solid #000');
  winner.style('position', 'absolute');
  winner.style('left', '50%');
  winner.style('top', '50%');
  winner.style('transform', 'translate(-50%, -50%)');
  winner.style('z-index', '1000');
  winner.style('opacity', '0'); // Start with 0 opacity

  winnerPopup = true;

  // Gradually increase opacity
  let opacity = 0;
  let fadeInterval = setInterval(() => {
    opacity += 5; // Increase opacity value, adjust as needed for speed
    winner.style('opacity', opacity / 100);

    // Stop the interval once fully visible
    if (opacity >= 100) {
      clearInterval(fadeInterval);
    }
  }, 50); // Adjust the interval time to control the speed of the fade-in

  await new Promise(r => setTimeout(r, 5000)); //wait a sec or two

  player.gainCurrency(coins_earned); //give player their currency
  player.updateCoinCount();
  window.location.href = "../islandIndex.html"; //send user back to upgrade island
}

//to fade out element
function fadeOut(element, duration) {
  let opacity = 1;
  const interval = 10; // Adjust as needed for smoothness

  const timer = setInterval(() => {
    if (opacity <= 0) {
      clearInterval(timer);
      element.style.display = "none";
    } else {
      opacity -= interval / duration;
      element.style.opacity = opacity;
    }
  }, interval);
}