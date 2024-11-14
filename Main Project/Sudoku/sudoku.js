let rows = 9; let cols = 9;
let square_size = 45; //length and height of each square
let interval = 30;

// Num of errors allowed
let errorNum = 5;
let errorCount = 0;

// Here for global, needed for testing
let incompletedGame = true;
// Initializes to begin screen
let startupDisplay = true;
// Moving to help display
let helpDisplay = true;

// Counts number of available hints
let hintNum = 3;

// Retrieves a random sudoku pattern from 'sudokuPick.js'
let indexForSudoku = giveSudokuIndex();
let sudoku = sudoku_samples[indexForSudoku];
let sudoku_solution = sudoku_answers[indexForSudoku];

// Uploads font
let font, back;
function preload() {
  font = loadFont('pirateFont.ttf');
  back = loadImage('wood.jpg');
  backgroundMusic = loadSound('../music/PuzzleBop.wav');
}

function setup() {
    //create a canvas in the center of the screen
    canvas = createCanvas(cols * square_size, rows * square_size);
    center_x = (windowWidth - width) / 2;
    center_y = (windowHeight - height) / 2;
    canvas.position(center_x, center_y);

    xpos = []; ypos = [];
    colorState = []; 
    numberState = [];
    editable = [];
    currSquare = -1;
    pastSquare = -1;
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
    textFont(font);

    loadMusic();

  }

  function loadMusic() {
    userStartAudio(); //music starts playing when user interacts with browser
    backgroundMusic.setVolume(0.5);
    backgroundMusic.play();
    backgroundMusic.loop();
  }

  //Repositions Canvas upon windowResize
  function windowResized() {
    center_x = (windowWidth - width) / 2;
    center_y = (windowHeight - height) / 2;
    canvas.position(center_x, center_y);
  }

  
  function draw() {
    // Upon startup shows intro graphic only
    // Navigates to helpDisplay after button click
    if (startupDisplay) {
      initGame();
      return;
    } else if (helpDisplay) {
      helpGame();
      return;
    }

    textFont('sans-serif');
    //loop through all square position coordinates and color states
    for (i = 0; i < rows * cols; ++i) {
      if (colorState[i] == 0) fill(300); //0 in colorState = white
      if (colorState[i] == 1) fill(40, 100, 600); //1 in colorState = lightblue
      if (colorState[i] == 2) fill(200); //2 in colorState = offWhite
      if (colorState[i] == 3) fill(0, 50, 200); //3 in colorState = darkblue
      if (colorState[i] == 4) fill(30, 200, 150); //4 in colorState = tealgreen
      if (colorState[i] == 5) fill(0, 130, 80); //4 in colorState = darktealgreen
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
    // Only runs check_sudoku upon certain frame interval
    // Costly check to do every frame
    if (frameCount % interval === 0) check_sudoku();
  }


  // Shows intro display graphic
  function initGame() {
    background(back);
    fill('cream');
    textSize(50);
    textAlign(CENTER, CENTER);
    text("Sudoku", width/2, height/2);
    noLoop();
    document.getElementById('err1').style.display = 'none';
    document.getElementById('err2').style.display = 'none';
    document.getElementById('err3').style.display = 'none';
    document.getElementById('err4').style.display = 'none';
    document.getElementById('err5').style.display = 'none';
    document.getElementById('helpButton').style.display = 'none';
    document.getElementById('hintButton').style.display = 'none';
    document.getElementById('backToIndexButton').style.display = 'none';
    document.getElementById('completeButton').style.display = 'none';
    document.getElementById('finishButton').style.display = 'none';
  }

  // Invoked by 'initButton'
  // Goes to help display
  // Uses a slight delay to repel unwanted selection when pressing button
  function startupToFalse() { 
    setTimeout(() => {
      startupDisplay = false; 
      loop();
      document.getElementById('initButton').style.display = 'none';
    }, 100);
  }

  // Shows help display graphic
  function helpGame() {
    background(back);
    fill('cream');
    textAlign(CENTER, CENTER);
    textSize(50);
    text("Rules", width/2, height/2-150);
    textSize(15);
    fill(40, 100, 600);
    text("Blue", width/2-150, height/2-70);
    fill('cream');
    text("cell indicates selected", width/2+37, height/2-70);
    fill('white');
    backspaceText = "BACKSPACE";
    rectMode(CENTER);
    rect(width/2-90, height/2-20, textWidth(backspaceText), 30);
    fill('black');
    textFont('sans-serif');
    textSize(25);
    text(backspaceText, width/2-90, height/2-20);
    textFont(font);
    textSize(15);
    fill('cream');
    text("to clear cell", width/2+100, height/2-20);
    fill(200, 40, 60);
    text("Red", width/2-140, height/2+35);
    fill('cream');
    text("text indicates error", width/2+25, height/2+35);
    text("given       errors", width/2-45, height/2+90);
    textFont('sans-serif');
    textSize(30);
    text(errorNum, width/2-52, height/2+90);
    fill('white');
    ellipse(width/2+110, height/2+90, 50, 50);
    fill('cream');
    noLoop();
    document.getElementById('helpButton').style.display = 'block';
  }

  // Invoked by 'helpButton'
  // Returns to Sudoku board
  // Uses a slight delay to repel unwanted selection when pressing button
  function helpToFalse() { 
    setTimeout(() => {
      helpDisplay = false; 
      loop();
      document.getElementById('err1').style.display = 'block';
      document.getElementById('err2').style.display = 'block';
      document.getElementById('err3').style.display = 'block';
      if (errorNum > 3) document.getElementById('err4').style.display = 'block';
      if (errorNum > 4) document.getElementById('err5').style.display = 'block';
      document.getElementById('helpButton').style.display = 'none';
      document.getElementById('backToIndexButton').style.display = 'block';
      document.getElementById('completeButton').style.display = 'block';
      if (hintNum > 0) document.getElementById('hintButton').style.display = 'block';
    }, 100);
  }

  function mouseClicked() {
    // Stops unwanted selection as 'initButton' is pressed
    if (startupDisplay || helpDisplay) return;
    //when the mouse is clicked, change the color state by negating the value
    for (i = 0; i < rows * cols; ++i) resetColor(i);
    for (i = 0; i < rows * cols; ++i) {
      //check if mouse position is within the current square
      if (dist(mouseX, 0, xpos[i], 0) < sideLength / 2 && dist(0, mouseY, 0, ypos[i]) < sideLength / 2) {
        currSquare = i; // sets currSquare to the current square clicked on by mouse

        // Implements clicking behavior
        // When clicking on a cell it should:
        // Highlight in corresponding color
        // If cell is already in selection, should return to origin color
        if (editable[i]) {
          if (colorState[i] == 0) {
            colorState[i] = 1;
          }  else if (colorState[i] == 1) {
            colorState[i] = 0;
          }
        } else {
          if (colorState[i] == 2) {
            colorState[i] = 3;
          }  else if (colorState[i] == 3) {
            colorState[i] = 2;
          }
        }


        if (numberState[i] != 0) highlightCommonCell();
        //pastSquare identifies which cell was previously selected
        //Purpose is to clear old selection; Makes clicking more elegant
        if (pastSquare != -1 && pastSquare != currSquare && editable[pastSquare]) colorState[pastSquare] = 0;
        if (pastSquare != -1 && pastSquare != currSquare && !editable[pastSquare]) colorState[pastSquare] = 2;
        if (currSquare != -1) pastSquare = i;
        return;
      }
    }
    //Clears selection if click off grid
    if (pastSquare != -1 && editable[pastSquare]) colorState[pastSquare] = 0;
    if (pastSquare != -1 && !editable[pastSquare]) colorState[pastSquare] = 2;
    pastSquare = -1;
    currSquare = -1;

  }


  function keyPressed() {
    // If a square has been clicked on by mouse
    if (currSquare != -1 && editable[currSquare]) {
      // And the key pressed is between [1-9](range is set by values reflected in Sudoku)
      if (key >= '1' && key <= '9') {
        // Sets value for corresponding square equal to key pressed
        numberState[currSquare] = key;
        colorState[currSquare] = 0;
        if (numberState[currSquare] != +sudoku_solution[currSquare]) {
          ++errorCount;
          setErrorCircles();
        }
      }
      // Resets cell state upon 'BACKSPACE'; I guess key 8 is BACKSPACE?
      if (keyCode == 8) {
        numberState[currSquare] = 0;
        for (i = 0; i < rows*cols; ++i) resetColor(i);
      }
      // Resets currSquare to prevent accidental changing of numbers
      currSquare = -1;
    }
  }

  
  // Sets text to red if key entered is wrong
  function check_key_entered(i) {
    if (numberState[i] != +sudoku_solution[i]) {
      fill(200, 40, 60);
    }
  }

  // Orchestrates common Sudoku interface
  // When selecting/clicking a numbered cell (editable or not):
  // Highlights cells with the same number throughout the puzzle
  function highlightCommonCell() {
    if (currSquare != -1 && numberState[currSquare] != 0) {
      var highlightedNumber = numberState[currSquare];
      for (i = 0; i < rows*cols; ++i) {
        if (numberState[i] == highlightedNumber) {
          if (currSquare != i && editable[i]) colorState[i] = 4;
          if (currSquare != i && !editable[i]) colorState[i] = 5;
        } else {
          resetColor(i);
        }
      }
    }
  }

  // Changes color back to origin
  // Used for number identifying
  function resetColor(cell) {
    if (editable[cell]) {
      colorState[cell] = 0;
    } else {
      colorState[cell] = 2
    }
  }

  // Sets incompletedGame to false if game state doesn't match solution, true if complete
  function check_sudoku() {
    incompletedGame = true;
    for (i = 0; i < rows*cols; ++i) {
      if (numberState[i] != +sudoku_solution[i]) {
        incompletedGame = false;
        break;
      }
    }

    textFont('Georgia');

    if (errorCount == errorNum) {
      lostSudoku();
      return;
    }
    // Displays completion overlay, if incompletedGame passes as TRUE
    if (incompletedGame) wonSudoku();
  }

  // Displays Won Sudoku screen
  function wonSudoku() {
    textFont(font);
    background(back);
    fill('cream');
    textSize(50);
    textAlign(CENTER, CENTER);
    text("Complete", width/2, height/2);
    noLoop();
    document.getElementById('err1').style.display = 'none';
    document.getElementById('err2').style.display = 'none';
    document.getElementById('err3').style.display = 'none';
    document.getElementById('err4').style.display = 'none';
    document.getElementById('err5').style.display = 'none';
    document.getElementById('backToIndexButton').style.display = 'none';
    document.getElementById('completeButton').style.display = 'none';
    document.getElementById('hintButton').style.display = 'none';
    document.getElementById('finishButton').style.display = 'block';
    let currency = parseInt(localStorage.getItem('playerCurrency'));
    currency += 500;
    localStorage.setItem('playerCurrency', currency);
  }

  // Displays Lost Sudoku screen
  function lostSudoku() {
    textFont(font);
    background(back);
    fill('cream');
    textSize(50);
    textAlign(CENTER, CENTER);
    text("Lost", width/2, height/2);
    noLoop();
    document.getElementById('err1').style.display = 'none';
    document.getElementById('err2').style.display = 'none';
    document.getElementById('err3').style.display = 'none';
    document.getElementById('err4').style.display = 'none';
    document.getElementById('err5').style.display = 'none';
    document.getElementById('backToIndexButton').style.display = 'none';
    document.getElementById('completeButton').style.display = 'none';
    document.getElementById('hintButton').style.display = 'none';
    document.getElementById('finishButton').textContent = "Return to Ship.";
    document.getElementById('finishButton').style.display = 'block';
  }

  // Sets game state to complete to show complete state; Demo purposes
  function autoComplete() {
    for (i = 0; i < rows*cols; ++i) {
      numberState[i] = +sudoku_solution[i];
    }
  }

  // Sets number of Errors allowed, dependent upon whether the player has bought an upgrade for it.
  function setErrorCircles() {
    if (errorCount == 1) document.getElementById('err1').style.backgroundColor = 'rgb(200, 40, 60)';
    if (errorCount == 2) document.getElementById('err2').style.backgroundColor = 'rgb(200, 40, 60)';
    if (errorCount == 3) document.getElementById('err3').style.backgroundColor = 'rgb(200, 40, 60)';
    if (errorCount == 4) document.getElementById('err4').style.backgroundColor = 'rgb(200, 40, 60)';
    if (errorCount == 5) document.getElementById('err5').style.backgroundColor = 'rgb(200, 40, 60)';
  }

  // Fills out column upon requesting a hint
  function giveHint() {
    // Random number 1-9
    // First makes sure that the column of num chosen isn't already finished
    do {
      columnToSolve = Math.floor((Math.random() * 9) +1);
    }while(!checkColumn(columnToSolve));
    switch(columnToSolve) {
      case 1:
        for (i = 0; i < 9; ++i) numberState[i] = +sudoku_solution[i];
        break;
      case 2:
        for (i = 9; i < 18; ++i) numberState[i] = +sudoku_solution[i];
        break;
      case 3:
        for (i = 18; i < 27; ++i) numberState[i] = +sudoku_solution[i];
        break;
      case 4:
        for (i = 27; i < 36; ++i) numberState[i] = +sudoku_solution[i];
        break;
      case 5:
        for (i = 36; i < 45; ++i) numberState[i] = +sudoku_solution[i];
        break;
      case 6:
        for (i = 45; i < 54; ++i) numberState[i] = +sudoku_solution[i];
        break;
      case 7:
        for (i = 54; i < 63; ++i) numberState[i] = +sudoku_solution[i];
        break;
      case 8:
        for (i = 63; i < 72; ++i) numberState[i] = +sudoku_solution[i];
        break;
      case 9:
        for (i = 72; i < 81; ++i) numberState[i] = +sudoku_solution[i];
        break;
      default:
        break;
    }
    --hintNum;
    if (hintNum == 0) document.getElementById('hintButton').style.display = 'none';
  }

  // Used to deter hint from giving an already finished row
  function checkColumn(col) {
    let columnIsComplete = true;
    switch(col) {
      case 1:
        for (i = 0; i < 9; ++i) {if (numberState[i] != +sudoku_solution[i]){ columnIsComplete = false; break; }}
        break;
      case 2:
        for (i = 9; i < 18; ++i) {if (numberState[i] != +sudoku_solution[i]){ columnIsComplete = false; break; }}
        break;
      case 3:
        for (i = 18; i < 27; ++i) {if (numberState[i] != +sudoku_solution[i]){ columnIsComplete= false; break; }}
        break;
      case 4:
        for (i = 27; i < 36; ++i) {if (numberState[i] != +sudoku_solution[i]){ columnIsComplete = false; break; }}
        break;
      case 5:
        for (i = 36; i < 45; ++i) {if (numberState[i] != +sudoku_solution[i]){ columnIsComplete = false; break; }}
        break;
      case 6:
        for (i = 45; i < 54; ++i) {if (numberState[i] != +sudoku_solution[i]){ columnIsComplete = false; break; }}
        break;
      case 7:
        for (i = 54; i < 63; ++i) {if (numberState[i] != +sudoku_solution[i]){ columnIsComplete = false; break; }}
        break;
      case 8:
        for (i = 63; i < 72; ++i) {if (numberState[i] != +sudoku_solution[i]){ columnIsComplete = false; break; }}
        break;
      case 9:
        for (i = 72; i < 81; ++i) {if (numberState[i] != +sudoku_solution[i]){ columnIsComplete = false; break; }}
        break;
      default:
        break;
    }

    if (!columnIsComplete) return 1;
    return 0;
  }
