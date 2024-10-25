// File for storing and selecting random sudoku grids

function giveSudokuIndex() {
    
    randomIndex = Math.floor(Math.random() * sudoku_samples.length);
    while (usedSudoku.length != sudoku_samples.length) {
        if (checkStorageIndex(randomIndex) == false) {
            randomIndex = Math.floor(Math.random() * sudoku_samples.length);
        } else {
            break;
        }
    }
    return randomIndex;

}

function checkStorageIndex(index) {
    for (i = 0; i < usedSudoku.length; ++i) {
        if (index == usedSudoku[i]) {
            return false;
        }
    }
    usedSudoku.push(index);
    return true;
}

const sudoku_samples = [

    // Easy [0 - ]
    "007008205300670009004002000700000810508000604046000007000100400400029006809500301",
    "004000000007240016030005049200800000010030000309006000000080967006504002003000451",
    "600004012400210300000007000850700901009605700702001060000400000004032009930100005"
];

const sudoku_answers = [

    // Easy [0 - ]
    "917348265382675149654912783793456812528791634146283957265137498431829576879564321",
    "624918573597243816831765249265879134718432695349156728452381967176594382983627451",
    "673954812498216357521387496856743921319625784742891563265479138184532679937168245"
];

const usedSudoku = [];