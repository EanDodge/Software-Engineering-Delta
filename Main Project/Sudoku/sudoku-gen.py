from sudoku import Sudoku

puzzle = Sudoku(3).difficulty(0.9)
puzzle.show()
solution = puzzle.solve()
#solution.show()

#print(type(puzzle))
#print(type(puzzle.board))

def findStringOfBoard(grid):
    puzzleString = ""
    for x in range(9):
        for i in grid:
            elem = str(i[x])
            if elem == "None":
                elem = "0"
            puzzleString += elem
    return puzzleString


strin = findStringOfBoard(puzzle.board)
string = findStringOfBoard(solution.board)
print(strin)
solution.show()
print(string)