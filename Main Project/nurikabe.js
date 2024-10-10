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

    // here is how all the puzzle start and puzzle solution states are stored:
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

    //calls functions defined below to store cantClick and solution_colors in the format seen in puzzles[0]
    //takes in strings for puzzle start and solution that I found on a nurikabe archive website: https://www.logicgamesonline.com/nurikabe/archive.php
    var puzzle = "6...............1.2.....2.........4...........2.........7.....5.1...............2";
    var solpuz = "6     ##########1#2 # # 2##### ###4## # #   ##2# #######7 #   5#1# # ########## 2";
    puzzles.push({
      cantClick: generateStartingColors(puzzle),
      solution_colors: generateSolutionColors(solpuz)
    });

    var puzzle = ".........4.........2............4...3.......5...7............5.........3.........";
    var solpuz = "   ######4###  # ##2 ## # #### #4# #3 # ### 5# #7# ###### #  5##   # ##3#######  ";
    puzzles.push({
      cantClick: generateStartingColors(puzzle),
      solution_colors: generateSolutionColors(solpuz)
    });

    var puzzle = ".5..............3.1..........5..2...............4..2..........2.5..............1.";
    var solpuz = "#5    ##########3#1#  # # ## 5 #2# ###########  4 #2# ###### #2#5    ##########1#";
    puzzles.push({
      cantClick: generateStartingColors(puzzle),
      solution_colors: generateSolutionColors(solpuz)
    });

    var puzzle = "..6.3....................3.3.........3.....2.........3.3....................1.6..";
    var solpuz = "##6#3  ## # #### # #   # 3#3### #####3 ### 2### # ###3#3##   # #  ### # ####1#6##";
    puzzles.push({
      cantClick: generateStartingColors(puzzle),
      solution_colors: generateSolutionColors(solpuz)
    });

    var puzzle = "......2.4.1.4.......3.......................................7.......2.5.6.5......";
    var solpuz = "###  #2#4#1#4 # # ##3#####  #  #  #  ####  ## #  #  #  # ###7#  # # 2#5 6#5##### ";
    puzzles.push({
      cantClick: generateStartingColors(puzzle),
      solution_colors: generateSolutionColors(solpuz)
    });

    var puzzle = "..........4................7...1......4...4......2...6................4..........";
    var solpuz = "##########4   # # ###### # 7# #1# #  #4 ##4#  # #2 # 6 ########   #   4##########";
    puzzles.push({
      cantClick: generateStartingColors(puzzle),
      solution_colors: generateSolutionColors(solpuz)
    });

    var puzzle = "..4.........2...4.......3......3.................2......4.......1...3.........5..";
    var solpuz = "# 4###   # #2 ##4## ####3##### 3#  ## # ######  #2 # ###4#### ##1#  3# #######5 #";
    puzzles.push({
      cantClick: generateStartingColors(puzzle),
      solution_colors: generateSolutionColors(solpuz)
    });

    var puzzle = "......2....4....1..3.................2.....4.................4..1....7....5......";
    var solpuz = "##### 2## #4 ###1# 3# # ###### # #  #2### #4 # # # ###### # #4 #1# # 7# ##5 #### ";
    puzzles.push({
      cantClick: generateStartingColors(puzzle),
      solution_colors: generateSolutionColors(solpuz)
    });

    var puzzle = "................7.1.........1..3.................2..9.........3.3................";
    var solpuz = "##########      7#1#########1# 3 # ######## ## # 2# 9## #### #3#3#    # ######## ";
    puzzles.push({
      cantClick: generateStartingColors(puzzle),
      solution_colors: generateSolutionColors(solpuz)
    });

    var puzzle = ".......5....7..1......3...................................9......5..1....3.......";
    var solpuz = "###  ##5 #  7##1# # ##3### # #  # # ###### ###  #    ### #9## # #5 #1# # 3#######";
    puzzles.push({
      cantClick: generateStartingColors(puzzle),
      solution_colors: generateSolutionColors(solpuz)
    });

    var puzzle = "......4.........3....................2.6.2.2....................8.........6......";
    var solpuz = "####  4###  # ##3###  ##  ## # # ####2#6#2#2 ##########       ##8#########6     #";
    puzzles.push({
      cantClick: generateStartingColors(puzzle),
      solution_colors: generateSolutionColors(solpuz)
    });

    var puzzle = "1..............1..6............5......4...4......1............6..3..............4";
    var solpuz = "1##########   #1# 6### ###  # #5# #  #4 ##4#  # #1# #  ##### #6 #3  #########   4";
    puzzles.push({
      cantClick: generateStartingColors(puzzle),
      solution_colors: generateSolutionColors(solpuz)
    });

    var puzzle = "........7............3....18..........2...1..........36....2............8........";
    var solpuz = "   #    7  #### ## ##3 # #18# # #### #2###1# ###  ###36   #2 # #########8       #";
    puzzles.push({
      cantClick: generateStartingColors(puzzle),
      solution_colors: generateSolutionColors(solpuz)
    });

    var puzzle = "6..........4....3............1.....................2............4....6..........6";
    var solpuz = "6######## #4  # 3# ### # ## #1#####  ### # #  # # #2# ## # ### #4 #  6# ########6";
    puzzles.push({
      cantClick: generateStartingColors(puzzle),
      solution_colors: generateSolutionColors(solpuz)
    });

    var puzzle = "....9.......6.....4...3...................................5...2.....6.......2....";
    var solpuz = "####9     # 6#### 4# #3  #  # #####  #  #  # ###### ###   5# #2# ###6 # ### 2####";
    puzzles.push({
      cantClick: generateStartingColors(puzzle),
      solution_colors: generateSolutionColors(solpuz)
    });

    var puzzle = ".............4...........4...4..1...............1..3...3...........4.............";
    var solpuz = "##########   4#  ########4## 4 #1# ## ##########1# 3 ##3########  #4   ##########";
    puzzles.push({
      cantClick: generateStartingColors(puzzle),
      solution_colors: generateSolutionColors(solpuz)
    });

    var puzzle = ".5..1......8.......................4...4.3...4.......................1......2..5.";
    var solpuz = " 5##1###  #8### #  #     #  # #####4###4#3 ##4 # ## # # #  ### # ####1# ### 2##5 ";
    puzzles.push({
      cantClick: generateStartingColors(puzzle),
      solution_colors: generateSolutionColors(solpuz)
    });

    var puzzle = "...................2....3.3..........6.....4..........3.3....4...................";
    var solpuz = "########## # # #  #2# # 3#3### ######6  #  4###### ###3#3 ###4#  # #   ##########";
    puzzles.push({
      cantClick: generateStartingColors(puzzle),
      solution_colors: generateSolutionColors(solpuz)
    });

    var puzzle = "2.............8.................3....3.....4....5.................2.............3";
    var solpuz = "2 ##########  8  ## # ### ## # #3####3### #4### 5# # ##  ###  ## #2 ##########  3";
    puzzles.push({
      cantClick: generateStartingColors(puzzle),
      solution_colors: generateSolutionColors(solpuz)
    });

    var puzzle = ".2...............6................4.5.......3.1................6...............5.";
    var solpuz = "#2######## #     6#########    #  4#5#### ##3#1# ###  ### # ###6   #   ########5#";
    puzzles.push({
      cantClick: generateStartingColors(puzzle),
      solution_colors: generateSolutionColors(solpuz)
    });

    var puzzle = ".3..........2....1..6....4.............................2....4..7....2..........5.";
    var solpuz = " 3####### ##2 # #1##6### 4##    ## #### # #### ###  # #2# ##4# 7## #2##     # #5 ";
    puzzles.push({
      cantClick: generateStartingColors(puzzle),
      solution_colors: generateSolutionColors(solpuz)
    });

    var puzzle = "...........7....1.........3....1.1.............1.4....4.........5....7...........";
    var solpuz = "########## 7   #1### #####3 # #1#1#  #### ##  #1#4  ##4## #### #5   #7  ######   ";
    puzzles.push({
      cantClick: generateStartingColors(puzzle),
      solution_colors: generateSolutionColors(solpuz)
    });

    var puzzle = "..6..................2............2.6..2.4..3.4............1..................6..";
    var solpuz = " #6     # ######## # 2# # #  ##  #2#6##2#4##3#4# ###  # ###1####  # ## #####  6 #";
    puzzles.push({
      cantClick: generateStartingColors(puzzle),
      solution_colors: generateSolutionColors(solpuz)
    });

    var puzzle = ".......4.4....3..........3.8.........................2.3..........3....2.4.......";
    var solpuz = "  #### 4 4 #  3## #######3#8    #  ##### #####  #  # 2#3####### ##3  # 2 4 ######";
    puzzles.push({
      cantClick: generateStartingColors(puzzle),
      solution_colors: generateSolutionColors(solpuz)
    });

    var puzzle = ".......3.4.........6....1............5.....2............4....2.........1.7.......";
    var solpuz = "   ####3 4###  ## #6   #1######### ##5    #2########### 4  # 2#########1 7     ##";
    puzzles.push({
      cantClick: generateStartingColors(puzzle),
      solution_colors: generateSolutionColors(solpuz)
    });

    var puzzle = "..3............4.4....2.......1...................4.......2....1.7............2..";
    var solpuz = "##3#######  # #4#4####2# # # #1#  # # ###### #   #4 #### #2#  #1#7# ##########2 #";
    puzzles.push({
      cantClick: generateStartingColors(puzzle),
      solution_colors: generateSolutionColors(solpuz)
    });

    var puzzle = ".........4......3.........7.....5...............3.....6.........4......2.........";
    var solpuz = "#########4   #  3#########7  # #5#    # # #   ##3# #  6# ## ####4  # # 2#########";
    puzzles.push({
      cantClick: generateStartingColors(puzzle),
      solution_colors: generateSolutionColors(solpuz)
    });

    var puzzle = "..6......3......4............1.....3.........2.....4............1......1......5..";
    var solpuz = "##6######3#   # 4# ### # ## #1# # #3######## 2 #   4# ##########1#    #1######5##";
    puzzles.push({
      cantClick: generateStartingColors(puzzle),
      solution_colors: generateSolutionColors(solpuz)
    });

    var puzzle = ".3..................2.......4..........2.4..........7.......7..................5.";
    var solpuz = "#3  ########## # # #2 # # # 4### # # # 2#4# ########7 #     7# # ##########    5#";
    puzzles.push({
      cantClick: generateStartingColors(puzzle),
      solution_colors: generateSolutionColors(solpuz)
    });

    var puzzle = ".....1...6.........3...4.......3.................3.......4...4.........3...3.....";
    var solpuz = "    #1###6## ### ##3###4  ## # 3##### # ##  #####3 # ##  4# #4## ######3###3  #  ";
    puzzles.push({
      cantClick: generateStartingColors(puzzle),
      solution_colors: generateSolutionColors(solpuz)
    });

    var puzzle = "....3.......2....6..............1...............7..............3....5.......6....";
    var solpuz = "####3 #### #2# # 6# # ### ## ###1# ##   ### ####7# # # # ## ###3#  #5  # #  6####";
    puzzles.push({
      cantClick: generateStartingColors(puzzle),
      solution_colors: generateSolutionColors(solpuz)
    });

    var puzzle = "...1.........6..........5.1............2.1............3.3..........7.........5...";
    var solpuz = "###1##   # ##6# ###    #5#1######### # 2#1# # #####  #3#3#   ###  #7### #####5   ";
    puzzles.push({
      cantClick: generateStartingColors(puzzle),
      solution_colors: generateSolutionColors(solpuz)
    });

    var puzzle = "6.2..1..........1....................6.....4....................7..........2..1.4";
    var solpuz = "6#2 #1### ######1#   # # ## ### #  ##6   ##4###### ####     #  #7###### ###2 #1#4";
    puzzles.push({
      cantClick: generateStartingColors(puzzle),
      solution_colors: generateSolutionColors(solpuz)
    });

    var puzzle = "..........2..5.............8....1...............2....3.............2..4..........";
    var solpuz = "##########2 #5   ######## #8   #1#### #####  # #2 # #3# #### ### # 2# 4##########";
    puzzles.push({
      cantClick: generateStartingColors(puzzle),
      solution_colors: generateSolutionColors(solpuz)
    });

    var puzzle = ".....1.........4...2..4.........1...............1.........4..4...5.........4.....";
    var solpuz = "#####1#### # ##4 ##2# 4## #### #1# ## ######## #1#  # # ##4 #4 # 5##### ###4   ##";
    puzzles.push({
      cantClick: generateStartingColors(puzzle),
      solution_colors: generateSolutionColors(solpuz)
    });

    var puzzle = "7............2....5.....3......6.................1......5.....2....1............5";
    var solpuz = "7  ######## #2 # #5# ###3 # # #6 ### # ##   # ###1# #  #5#####2## #1# ##   ##   5";
    puzzles.push({
      cantClick: generateStartingColors(puzzle),
      solution_colors: generateSolutionColors(solpuz)
    });

    var puzzle = "....3...................8.24.........4.....5.........42.1...................3....";
    var solpuz = " #  3#### ##### #  # #  8#24# # #####4 # # 5##### # #42#1# # #  ##### # ##  3### ";
    puzzles.push({
      cantClick: generateStartingColors(puzzle),
      solution_colors: generateSolutionColors(solpuz)
    });

    var puzzle = "............4..........1.......7..3...........6..3.......1..........5............";
    var solpuz = "###   #### #4### ## ###1# ##   7##3### ## ####6##3 # ## #1### ## ###5  ##   #####";
    puzzles.push({
      cantClick: generateStartingColors(puzzle),
      solution_colors: generateSolutionColors(solpuz)
    });

    var puzzle = "........8..........8.........2.4.................4.5.........2..........3........";
    var solpuz = "#       8######### 8#   # # #2#4## # # ###  # ###4#5##   # ##2#####  # #3  ######";
    puzzles.push({
      cantClick: generateStartingColors(puzzle),
      solution_colors: generateSolutionColors(solpuz)
    });

    var puzzle = "....4.............4.1....3..1.......................4..5....5.5.............5....";
    var solpuz = "  # 4#### ### #  #4#1# ##3##1#### #### # #  ##  # ##4##5 #  5#5########     5#   ";
    puzzles.push({
      cantClick: generateStartingColors(puzzle),
      solution_colors: generateSolutionColors(solpuz)
    });

    var puzzle = "..........8.6....1..............2...............1..............1....3.5..........";
    var solpuz = "##########8#6   #1# # ###### # #2# ## ### # ## #1### ##  ## # #1# # 3#5##########";
    puzzles.push({
      cantClick: generateStartingColors(puzzle),
      solution_colors: generateSolutionColors(solpuz)
    });

    var puzzle = "..3..7......2......2.................4.....4.................3......4......2..3..";
    var solpuz = "  3##7######2# # # 2# # # ###### # ##4#   #4## ###### # #   #3 # ###4##### 2##3  ";
    puzzles.push({
      cantClick: generateStartingColors(puzzle),
      solution_colors: generateSolutionColors(solpuz)
    });

    var puzzle = ".....3....3...........3..1..2.......................7..2..3...........1....2.....";
    var solpuz = "#####3  ##3 # ###### #3 #1##2######## #     #### ###7##2##3 #### # # #1####2#####";
    puzzles.push({
      cantClick: generateStartingColors(puzzle),
      solution_colors: generateSolutionColors(solpuz)
    });

    var puzzle = "........4.3.......3................5....7....1................6.......4.2........";
    var solpuz = "#####   4#3  #####3####      # ####5### 7# ##1#  #    ## #####6 # #   4#2########";
    puzzles.push({
      cantClick: generateStartingColors(puzzle),
      solution_colors: generateSolutionColors(solpuz)
    });

    var puzzle = "...............5.........3.....2.....6.....5.....2.....3.........3...............";
    var solpuz = "########## #   5# # # ###3 # ##2 ####6 ####5### #2 # # 3##### # #3  #  ##########";
    puzzles.push({
      cantClick: generateStartingColors(puzzle),
      solution_colors: generateSolutionColors(solpuz)
    });

    var puzzle = "..6..3......3..........................3.3..........................5......6..8..";
    var solpuz = "  6##3  # ##3##### #  # # # #### # ##  3#3# ######## # #    # # ####5# #   6##8 #";
    puzzles.push({
      cantClick: generateStartingColors(puzzle),
      solution_colors: generateSolutionColors(solpuz)
    });

    var puzzle = ".7...................2......7.........6...4.........4......3...................2.";
    var solpuz = "#7      ########### #2 #  # 7#### ## #6  #4#  # ####4  # # 3# # # # ########## 2#";
    puzzles.push({
      cantClick: generateStartingColors(puzzle),
      solution_colors: generateSolutionColors(solpuz)
    });

    var puzzle = "2.4............2.........3.......5.............3.......6.........5............2.5";
    var solpuz = "2#4 ##### #  # 2# #######3  # #  5## # ### #  #3# # #  6## ###  #5  # # ######2#5";
    puzzles.push({
      cantClick: generateStartingColors(puzzle),
      solution_colors: generateSolutionColors(solpuz)
    });

    var puzzle = ".2...........2.2.......5............4.......3............6.......1.2...........3.";
    var solpuz = "#2######## # 2#2 ######5####  #  # #4# ## # 3 #  # ### ##6### # #1#2 # ########3#";
    puzzles.push({
      cantClick: generateStartingColors(puzzle),
      solution_colors: generateSolutionColors(solpuz)
    });

    var puzzle = ".....................4......1...3...4.......5...2...3......7.....................";
    var solpuz = "##########   # # ####4# # ##1###3#  4## ####5  #2# #3# ####7# ##     # ##########";
    puzzles.push({
      cantClick: generateStartingColors(puzzle),
      solution_colors: generateSolutionColors(solpuz)
    });

    var puzzle = "................1..4..............5....2.4....8..............6..6................";
    var solpuz = "##########   # #1##4### ## ### # #5 # #2#4#  #8 ########    #6  6### #      ###  ";
    puzzles.push({
      cantClick: generateStartingColors(puzzle),
      solution_colors: generateSolutionColors(solpuz)
    });

    var puzzle = ".............4....5............2..7...........3..5............1....2.............";
    var solpuz = "#########   #4   #5######## # #2 #7###  ##  ##3# 5# ### #### #1# # 2#  ##########";
    puzzles.push({
      cantClick: generateStartingColors(puzzle),
      solution_colors: generateSolutionColors(solpuz)
    });

    var puzzle = "..5......5...............2......3....2.....3....2......6...............2......1..";
    var solpuz = "##5   ###5#### # #    ###2######3### 2# # #3####2# # ##6##### ##     ##2######1# ";
    puzzles.push({
      cantClick: generateStartingColors(puzzle),
      solution_colors: generateSolutionColors(solpuz)
    });

    var puzzle = "..........4......4...............2...5..2..6...1...............2......5..........";
    var solpuz = "##########4  #   4### ######  ## 2#  5##2##6  #1# #   #########2 #    5##########";
    puzzles.push({
      cantClick: generateStartingColors(puzzle),
      solution_colors: generateSolutionColors(solpuz)
    });

    var puzzle = ".........4...........3..........5.2...........1.2..........6...........5.........";
    var solpuz = "#########4 # #   ## #3# #### # #5#2 ##########1#2 #  ######6# ##     # 5#########";
    puzzles.push({
      cantClick: generateStartingColors(puzzle),
      solution_colors: generateSolutionColors(solpuz)
    });

    var puzzle = ".5..2.5.3.............................4...4.............................3.4.5..1.";
    var solpuz = " 5# 2#5#3# #### # #  #   # ########## 4  #4 ###### # # #  # # # # ## ###3#4#5 #1#";
    puzzles.push({
      cantClick: generateStartingColors(puzzle),
      solution_colors: generateSolutionColors(solpuz)
    });

    var puzzle = ".....4....4..........7.................4.4.................2..........3....3.....";
    var solpuz = "#   #4####4###   ### 7######  ##   ## #4#4#### #  ## ## # #2# ###### #3##  3#####";
    puzzles.push({
      cantClick: generateStartingColors(puzzle),
      solution_colors: generateSolutionColors(solpuz)
    });

    var puzzle = ".2...................3.........3......4...9......3.........4...................7.";
    var solpuz = "#2 #    ######## ##  3# # #####3 # ## 4###9 ## # 3##### # #4   ##########      7#";
    puzzles.push({
      cantClick: generateStartingColors(puzzle),
      solution_colors: generateSolutionColors(solpuz)
    });

    var puzzle = ".5.........1.....5.................4.........5.................7.....7.........2.";
    var solpuz = " 5####### #1#    5 ######## # #   #4## ### # 5  # # # #### # # 7    #7#########2 ";
    puzzles.push({
      cantClick: generateStartingColors(puzzle),
      solution_colors: generateSolutionColors(solpuz)
    });

    var puzzle = ".......6.4...............2.........2..4...3..3.........3...............1.7.......";
    var solpuz = "####   6#4  # ###### # # 2# #######2 #4  #3# 3### #  ##3  ##########  #1#7    ###";
    puzzles.push({
      cantClick: generateStartingColors(puzzle),
      solution_colors: generateSolutionColors(solpuz)
    });

    var puzzle = ".2..............1.............2....2.........7....6.............5..............4.";
    var solpuz = "#2 ##########  #1## # # #### #2# # 2# ### ###7   #6# ######## ##5    # ########4#";
    puzzles.push({
      cantClick: generateStartingColors(puzzle),
      solution_colors: generateSolutionColors(solpuz)
    });

    var puzzle = ".5..2...........2.4............2.................2............4.2...........4..7.";
    var solpuz = " 5 #2###### # # 2#4# ###### ## 2# #   #### # ### 2# # # #### #4#2#  # ##### 4# 7#";
    puzzles.push({
      cantClick: generateStartingColors(puzzle),
      solution_colors: generateSolutionColors(solpuz)
    });

    var puzzle = "...7.......2................5...4...............2...2................6.......5...";
    var solpuz = "###7    ## 2#### ####   # ##5###4#### # ### ## #2# #2##  #   ########6 ##    5###";
    puzzles.push({
      cantClick: generateStartingColors(puzzle),
      solution_colors: generateSolutionColors(solpuz)
    });

    var puzzle = ".4...........7..............1.......5..4.2..1.......2..............2...........7.";
    var solpuz = " 4#######  # 7   ######## ##1# # # #5##4#2##1  #  # 2## ######## # 2#   #####  7 ";
    puzzles.push({
      cantClick: generateStartingColors(puzzle),
      solution_colors: generateSolutionColors(solpuz)
    });

    var puzzle = ".2............3.............3...........4...........7.............3............6.";
    var solpuz = "#2######## #  3# ######## ##3# #   ## # 4## ## # # #7###### ####  3#   ########6#";
    puzzles.push({
      cantClick: generateStartingColors(puzzle),
      solution_colors: generateSolutionColors(solpuz)
    });

    var puzzle = "......7.........3.1............4....1.......6....2............4.5.........4......";
    var solpuz = "      7#########3#1#   #  #####4####1# ##   6## #2# ###  # # #4#5###### ##4   #  ";
    puzzles.push({
      cantClick: generateStartingColors(puzzle),
      solution_colors: generateSolutionColors(solpuz)
    });

    var puzzle = "....1.5..........1............3....4.........6....1............2..........7.5....";
    var solpuz = "####1#5### # ## #1# # #  ##  #3# ##4 ######  6#  #1# ###   ####2# ###  # #7#5  ##";
    puzzles.push({
      cantClick: generateStartingColors(puzzle), 
      solution_colors: generateSolutionColors(solpuz)
    });

    var puzzle = ".............3..5.............2...1.4.......4.1...2.............5..3.............";
    var solpuz = "######### #  3# 5# ####  ## # 2# #1#4#######4#1# #2 # ##  #### #5 #3  # #########";
    puzzles.push({
      cantClick: generateStartingColors(puzzle), 
      solution_colors: generateSolutionColors(solpuz)
    })

    var puzzle = ".....2.................2..3....4......5...2......6....4..2.................7.....";
    var solpuz = "#####2 # # # #### # # #2 #3# # 4##### 5###2 # ###6 ###4# 2#     ######## # 7     ";
    puzzles.push({
      cantClick: generateStartingColors(puzzle), 
      solution_colors: generateSolutionColors(solpuz)
    })

    var puzzle = ".5..2...............4......7...........1.2...........6......6...............5..1.";
    var solpuz = " 5 #2 ###  ##### ###4   #  7#######   #1#2 #   ## ###6  #   6 ###########   5 #1#";
    puzzles.push({
      cantClick: generateStartingColors(puzzle), 
      solution_colors: generateSolutionColors(solpuz)
    })

    var puzzle = "..........5..5.......7.................2.3.................1.......8..4..........";
    var solpuz = "   ###### 5##5   ### 7### ##  ##  ### #2#3# ## # ### ## ###1# #### 8##4#      ###";
    puzzles.push({
      cantClick: generateStartingColors(puzzle), 
      solution_colors: generateSolutionColors(solpuz)
    })

    var puzzle = "......3.................7.....1...5...........3...4.....4.................4......";
    var solpuz = "######3 ##    ## #####  7### #1###5## ### # ##3# #4# ###4 # # # ## # # #  4######";
    puzzles.push({
      cantClick: generateStartingColors(puzzle), 
      solution_colors: generateSolutionColors(solpuz)
    })

    var puzzle = "..2..6...........2....1...............2...7...............5....7...........1..2..";
    var solpuz = "##2# 6 ## # ##  #2 ###1# #  # ###### #2#  7 # ###### # #  5 # #7# #### ####1# 2##";
    puzzles.push({
      cantClick: generateStartingColors(puzzle), 
      solution_colors: generateSolutionColors(solpuz)
    })

    var puzzle = ".........1......7.........4.....5...............4.....2.........4......9.........";
    var solpuz = "#########1#     7####### #4#    5## #######   # 4  ###2#####   #4   #  9######   ";
    puzzles.push({
      cantClick: generateStartingColors(puzzle), 
      solution_colors: generateSolutionColors(solpuz)
    })

    var puzzle = ".........2................64....2...............5....37................3.........";
    var solpuz = "#########2 # #   #### ### 64 # #2# #  # # ######5##  37 ## #####    #  3#########";
    puzzles.push({
      cantClick: generateStartingColors(puzzle), 
      solution_colors: generateSolutionColors(solpuz)
    })

    var puzzle = "7...3...............4....5...........2.....1...........6....1...............6...3";
    var solpuz = "7  #3  ##  ######  #4  # 5  ### # ###2 ####1#####  ####6   #1# ######## #   6  #3";
    puzzles.push({
      cantClick: generateStartingColors(puzzle), 
      solution_colors: generateSolutionColors(solpuz)
    })

    var puzzle = "....2.........2...........26..........5...2..........38...........7.........5....";
    var solpuz = "  # 2####  ###2 #  ## ####26#   # ####5###2#   ##  ##38 #    #   #7#####  ##5    ";
    puzzles.push({
      cantClick: generateStartingColors(puzzle), 
      solution_colors: generateSolutionColors(solpuz)
    })

    var puzzle = "...............5.4.........4.1....4...........4....4.2.........4.3...............";
    var solpuz = " ######   #    5#4 ####### 4#1#   4###########4   #4#2 ##### # 4#3  #  #  #######";
    puzzles.push({
      cantClick: generateStartingColors(puzzle), 
      solution_colors: generateSolutionColors(solpuz)
    })

    var puzzle = ".................6..........5...8...1.......3...2...4..........2.................";
    var solpuz = "########## #     6# ########5  #8#  1#### ##3## 2# #4# ###  # #2#   #  ##########";
    puzzles.push({
      cantClick: generateStartingColors(puzzle), 
      solution_colors: generateSolutionColors(solpuz)
    })

    var puzzle = "..1....3..5...6...................................................7...2..2....4..";
    var solpuz = "##1####3##5# #6# ## # # # ## # # #### # #   ## # ######## # # ## #7# #2##2### 4##";
    puzzles.push({
      cantClick: generateStartingColors(puzzle), 
      solution_colors: generateSolutionColors(solpuz)
    })

    var puzzle = "...........8.....4.5.2..3...............................1..5.1.4.....3...........";
    var solpuz = "       ####8#####4#5#2 #3# # #### # #  # # # # ## ######1# 5#1#4### #3##   ###  #";
    puzzles.push({
      cantClick: generateStartingColors(puzzle), 
      solution_colors: generateSolutionColors(solpuz)
    })

    var puzzle = ".3.................1...........1....1.6...6.4....4...........2.................3.";
    var solpuz = "#3 ######## #   # #1#### # ## #1# # 1#6###6#4## #4#####  # # 2## #  ########## 3 ";
    puzzles.push({
      cantClick: generateStartingColors(puzzle), 
      solution_colors: generateSolutionColors(solpuz)
    })

    var puzzle = ".3.8....................6.....2...................4.....4....................5.1.";
    var solpuz = "#3#8    ## #  ##### ## #6 ####2### ## # # # ## ###4# ## 4#  # ###########    5#1#";
    puzzles.push({
      cantClick: generateStartingColors(puzzle), 
      solution_colors: generateSolutionColors(solpuz)
    })

    var puzzle = "......4....8...........3......4...................3......1...........5....3......";
    var solpuz = "####  4 ## 8####### # #3  ## #4 ##### # # # ## ###3# ## #1# # ## ####5 ###3  ####";
    puzzles.push({
      cantClick: generateStartingColors(puzzle), 
      solution_colors: generateSolutionColors(solpuz)
    });

    var puzzle = "...6.....2.........6......1.........5.......4.........4......4.........2.....3...";
    var solpuz = " # 6    #2#########6     #1#########5   #   4## ######4###   4#   #####2#### 3 # ";
    puzzles.push({
      cantClick: generateStartingColors(puzzle), 
      solution_colors: generateSolutionColors(solpuz)
    });

    var puzzle = "......3......4...........1.2..3...................2..3.3...........4......3......";
    var solpuz = "######3 ##   4# #########1#2 #3  ########## ##  # 2# 3#3######### #4   ## 3######";
    puzzles.push({
      cantClick: generateStartingColors(puzzle), 
      solution_colors: generateSolutionColors(solpuz)
    });

    var puzzle = ".........4....3.............6....2.............4....3.............1....4.........";
    var solpuz = "#########4   #3  ###########6   #2 ##### ##### 4# # 3 # ######## #1#   4#########";
    puzzles.push({
      cantClick: generateStartingColors(puzzle), 
      solution_colors: generateSolutionColors(solpuz)
    });

    var puzzle = ".................6.......4..3..........4.3..........3..7.......1.................";
    var solpuz = "####     # # ####6# # #  4##3# ### ####4#3#### ##  #3##7 #### #1#    # ##########";
    puzzles.push({
      cantClick: generateStartingColors(puzzle), 
      solution_colors: generateSolutionColors(solpuz)
    });

    var puzzle = "...4.............2....1..5..2.......................1..3..5....6.............8...";
    var solpuz = "## 4#### #  ##  #2####1# 5##2 #### #####  ####  #  #1##3##5### 6## ##       #8   ";
    puzzles.push({
      cantClick: generateStartingColors(puzzle), 
      solution_colors: generateSolutionColors(solpuz)
    });

    var puzzle = "...................3......7.......5....3.4....4.......4......7...................";
    var solpuz = "####     #  ##### #3# #  #7### ## 5## #3#4# ##4 ## ###4# #  #7# ###### #  #     #";
    puzzles.push({
      cantClick: generateStartingColors(puzzle), 
      solution_colors: generateSolutionColors(solpuz)
    });

    var puzzle = "..7..2.4..6...........................................................4..2.4..5..";
    var solpuz = "##7 #2#4 #6# # # ## # ### ## #   #### ##### ## # # # ## # # # #### # #4# 2#4# 5##";
    puzzles.push({
      cantClick: generateStartingColors(puzzle), 
      solution_colors: generateSolutionColors(solpuz)
    });

    var puzzle = "...3..........6...............4...2.1.......2.6...2...............1..........4...";
    var solpuz = "#  3#   ######6####   # # ####4# #2#1# #####2#6  #2 # # ######## #1#   ######4###";
    puzzles.push({
      cantClick: generateStartingColors(puzzle), 
      solution_colors: generateSolutionColors(solpuz)
    });

    var puzzle = "................8..3....1.........3...........4.........4....9..7................";
    var solpuz = "####    ##  # ##8##3## #1#### # ##3##  ###  ##4## ######4  # 9  7####        #   ";
    puzzles.push({
      cantClick: generateStartingColors(puzzle), 
      solution_colors: generateSolutionColors(solpuz)
    });

    var puzzle = "........1.3...3.........1.4...........................4.6.........4...5.3........";
    var solpuz = "#####  #1#3  #3#########1#4 #   ###  # ### #  # # # # 4#6# # #####4 # 5#3  ######";
    puzzles.push({
      cantClick: generateStartingColors(puzzle), 
      solution_colors: generateSolutionColors(solpuz)
    });

    var puzzle = ".....6....5..................3.......3.1.5.3.......1..................4....5.....";
    var solpuz = "  #  6    5####### #  #   ###3## ####3#1#5#3 # ####1# # # # ###### #  4##  5#####";
    puzzles.push({
      cantClick: generateStartingColors(puzzle), 
      solution_colors: generateSolutionColors(solpuz)
    });

    var puzzle = "..........4..4......2......1...........4.2...........7......3......4..3..........";
    var solpuz = "   ##### #4##4  # ##2# ### 1# ## #  ###4#2## #   ## #7##### 3###   4##3#######  #";
    puzzles.push({
      cantClick: generateStartingColors(puzzle), 
      solution_colors: generateSolutionColors(solpuz)
    });

    var puzzle = "........1.5..............3.........4...3.2...5.........2..............4.4........";
    var solpuz = "########1#5   # ###### # 3#  # ####4  #3#2#  5## # # ##2 ##########   4#4   #####";
    puzzles.push({
      cantClick: generateStartingColors(puzzle), 
      solution_colors: generateSolutionColors(solpuz)
    });

    var puzzle = "....8...2.7..........1......4.......................4......3..........2.2...2....";
    var solpuz = "   #8 # 2 7 ## ### ##1# # ##4### # ## #   # ## #####4## #  3######### 2#2 # 2####";
    puzzles.push({
      cantClick: generateStartingColors(puzzle), 
      solution_colors: generateSolutionColors(solpuz)
    });

    var puzzle = "...............4.5..............6.....2...5.....4..............7.2...............";
    var solpuz = "#####  ## #  ##4#5 ##  # #  # # 6##  #2###5#  ##4 # #  # # # ##7#2# #  ##########";
    puzzles.push({
      cantClick: generateStartingColors(puzzle), 
      solution_colors: generateSolutionColors(solpuz)
    });

    var puzzle = "....5.........3................4.2..1.......1..2.3................3.........6....";
    var solpuz = "### 5#####   #3  ###########   4#2 #1#######1# 2#3  ######### ##  3#   #####6 ###";
    puzzles.push({
      cantClick: generateStartingColors(puzzle), 
      solution_colors: generateSolutionColors(solpuz)
    });

    var puzzle = "..3.............7.2.2............1.............2............2.8.5.............1..";
    var solpuz = "  3##########   7#2#2# ###  # # #1# #### ##  # 2### # #### #2#8#5   ### ######1# ";
    puzzles.push({
      cantClick: generateStartingColors(puzzle), 
      solution_colors: generateSolutionColors(solpuz)
    });

    var puzzle = "..6................4..4..............6.....6..............1..6................2..";
    var solpuz = "##6     # ######## 4 #4   ###########6#    6## # #### # ##1# 6 #   #### ##### 2# ";
    puzzles.push({
      cantClick: generateStartingColors(puzzle), 
      solution_colors: generateSolutionColors(solpuz)
    });

    var puzzle = "........6.1.......4.....3.............3...2.............1.....5.......7.6........";
    var solpuz = "###     6#1#######4# #  3#  # #####  #3# #2#  ### # # ##1#  ##5  ###  7#6   #####";
    puzzles.push({
      cantClick: generateStartingColors(puzzle), 
      solution_colors: generateSolutionColors(solpuz)
    });

    var puzzle = "................1..6............1...7.......6...2............6..1................";
    var solpuz = "##########     #1##6#########  #1#  7  ###  6  #2 # #########6##1#     ##########";
    puzzles.push({
      cantClick: generateStartingColors(puzzle), 
      solution_colors: generateSolutionColors(solpuz)
    });

    var puzzle = ".......8..3...6...4..............1.............3..............4...2...3..3.......";
    var solpuz = "###### 8 #3 # 6#  4# # ##   ### #1#  # # #### #3# #   ## #####4 ##2#  3# 3# #####";
    puzzles.push({
      cantClick: generateStartingColors(puzzle), 
      solution_colors: generateSolutionColors(solpuz)
    });

    var puzzle = "......7...3...1......3..................1..................1......5...7...4......";
    var solpuz = "######7 ##3# #1# ## #3### ## # #   #####1#####  ###  ###  #1# # ##5###7#  4##   #";
    puzzles.push({
      cantClick: generateStartingColors(puzzle), 
      solution_colors: generateSolutionColors(solpuz)
    });

    var puzzle = "......3.........2....5.................1.6.................2....7.........4......";
    var solpuz = "####  3### # ###2## #5  # ## ## ##### #1#6  ## ##### ## # #2# ##7# # # ###4 #####";
    puzzles.push({
      cantClick: generateStartingColors(puzzle), 
      solution_colors: generateSolutionColors(solpuz)
    });

    var puzzle = "2............1...........9.....1.4.............5.1.....5...........5............3";
    var solpuz = "2######## # #1#   ## ####9  # #1#4#  # ### #  #5#1# #  5#### # ### 5#####   ##  3";
    puzzles.push({
      cantClick: generateStartingColors(puzzle), 
      solution_colors: generateSolutionColors(solpuz)
    });

    var puzzle = ".....4.........7...4...3.................................3...3...6.........2.....";
    var solpuz = "##   4### #####7 # 4 # 3# ##### ## ##  ###  ## ## # ### #3 ##3## 6###  ####2 ####";
    puzzles.push({
      cantClick: generateStartingColors(puzzle), 
      solution_colors: generateSolutionColors(solpuz)
    });

    var puzzle = "..4.........5......6...................6.1...................5......2.........2..";
    var solpuz = "  4###### ##5    ##6######## #  #  ## #6#1# ## # ### ## # # #5## # #2#########2 #";
    puzzles.push({
      cantClick: generateStartingColors(puzzle), 
      solution_colors: generateSolutionColors(solpuz)
    });

    var puzzle = ".1..1.......4..........................7.3..........................4.......1..9.";
    var solpuz = "#1##1#######4##  ##   # # ###### # ##  7#3# ## ##### ## #   # ##  ##4# #####1##9#";
    puzzles.push({
      cantClick: generateStartingColors(puzzle), 
      solution_colors: generateSolutionColors(solpuz)
    });

    var puzzle = ".1.........1.....1...........3.....5.........9.....1...........5.....1.........5.";
    var solpuz = "#1#########1# # #1# ## # ### 3# #  5#### ####9    #1# ######## 5    #1# #######5 ";
    puzzles.push({
      cantClick: generateStartingColors(puzzle), 
      solution_colors: generateSolutionColors(solpuz)
    });

    var puzzle = "...2...6......5.........7...............................1.........6......9...4...";
    var solpuz = "## 2###6  ### 5##  #   #7#  ##### #  #     #  ######## #1#    # ##6 #### 9###4   ";
    puzzles.push({
      cantClick: generateStartingColors(puzzle), 
      solution_colors: generateSolutionColors(solpuz)
    });

    var puzzle = ".8........................2..4.......4.1.1.4.......6..4........................5.";
    var solpuz = "#8     ######## #  #   # #2 #4###### 4#1#1#4 ######6# 4#     #  ########  #    5#";
    puzzles.push({
      cantClick: generateStartingColors(puzzle), 
      solution_colors: generateSolutionColors(solpuz)
    });

    var puzzle = "......2.........4..2.2..............2.......4..............2.2..2.........6......";
    var solpuz = "##### 2### # ###4##2#2#   ##########2 # #   4### ###### # #2#2##2# # # ###6 #####";
    puzzles.push({
      cantClick: generateStartingColors(puzzle), 
      solution_colors: generateSolutionColors(solpuz)
    });

    var puzzle = "........7.....2.......5.4...............................7.5.......4.....2........";
    var solpuz = "##### # 7#   #2## ### 5#4# # #### # #   #  # #  ##### ##7#5  ## ##4##  #2#   ####";
    puzzles.push({
      cantClick: generateStartingColors(puzzle), 
      solution_colors: generateSolutionColors(solpuz)
    });

    var puzzle = ".............7.2...4...2......3...................5......1...3...2.1.............";
    var solpuz = "     #### ###7#2 ##4# #2#### #3# # ## # ##  ## ###5 #####1###3## 2#1#  ##########";
    puzzles.push({
      cantClick: generateStartingColors(puzzle), 
      solution_colors: generateSolutionColors(solpuz)
    });

    var puzzle = "..1....3..2............1..........2...........6..........6............1..3....8..";
    var solpuz = "##1##  3##2# ###### # #1# #### ###2#  # # ### 6# #   #  #6# ######## #1##3  # 8##";
    puzzles.push({
      cantClick: generateStartingColors(puzzle), 
      solution_colors: generateSolutionColors(solpuz)
    });

    var puzzle = "...........3............3.....8.....2.......4.....3.....1............8...........";
    var solpuz = "########## 3#  # ## ## #3 ####8 ####2#  ## #4 ## #3 # ##1##### # ##  8# #    ####";
    puzzles.push({
      cantClick: generateStartingColors(puzzle), 
      solution_colors: generateSolutionColors(solpuz)
    });

    var puzzle = ".....5.6.5..2..........................3.2..........................2..1.3.3.....";
    var solpuz = " ####5#6#5# 2# # # ###  # # # # ## # # 3#2# ###### # ## # ###### # #2 #1#3#3#####";
    puzzles.push({
      cantClick: generateStartingColors(puzzle), 
      solution_colors: generateSolutionColors(solpuz)
    });

    var puzzle = ".....7.3...6........................3.......3........................2...5.2.....";
    var solpuz = "#####7#3## 6 # # #### # # ## # # ###3 # # # 3##### # ##   # #### ####2 ##5#2 ####";
    puzzles.push({
      cantClick: generateStartingColors(puzzle), 
      solution_colors: generateSolutionColors(solpuz)
    });

    var puzzle = ".3..4................3...4.........5.........6.........2...4................1..2.";
    var solpuz = "#3##4   ## # ###### #3 # 4####### #5     # # 6####### #2#  4#  # # #########1# 2#";
    puzzles.push({
      cantClick: generateStartingColors(puzzle), 
      solution_colors: generateSolutionColors(solpuz)
    });

    var puzzle = ".........4.............4..........1.4.......5.3..........8.............4.........";
    var solpuz = "#########4   #   ######4###   # ##1#4###  ##5#3#  #   # #8## ### #  ###4######   ";
    puzzles.push({
      cantClick: generateStartingColors(puzzle), 
      solution_colors: generateSolutionColors(solpuz)
    });

    var puzzle = "4......8..........7...............3...........2...............1..........2......7";
    var solpuz = "4   ###8######   #7   # ###### # #3## # # # ##2# # # #########1# #    ###2####  7";
    puzzles.push({
      cantClick: generateStartingColors(puzzle), 
      solution_colors: generateSolutionColors(solpuz)
    });

    var puzzle = ".......3..1.1.................3...................2.................5.7..6.......";
    var solpuz = "#####  3##1#1######### #  ## #3 ## ## ### # ## # #2# ## # ### ## #  5#7##6#######";
    puzzles.push({
      cantClick: generateStartingColors(puzzle), 
      solution_colors: generateSolutionColors(solpuz)
    });

    var puzzle = "..........1...............5...3...5...........5...4...4...............1..........";
    var solpuz = "##########1# #    ### ####5# #3#  5## ##### ##5  #4# #4#### ###   #  #1##########";
    puzzles.push({
      cantClick: generateStartingColors(puzzle), 
      solution_colors: generateSolutionColors(solpuz)
    });

  //choose index of random puzzle
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