// Tests WA:
//
// Using pastWordles.txt(a text file of 200 past wordle solutions) or five_words.txt, I/O with WA
// Takes input from WA, outputs user-determined answer back to WA
// Iterates through each word
//
// ex: 
// (! == accurate letter and position)
// (# == accurate letter, not right position)
// (. == letter not in solution)
//
//      [SOLUTION]: flute
//
//      WA -----  glyph
//      evaluate() ----- .g!l.y.p.h
//
//      WA -----  brick
//      evaluate() ----- .b.r.i.c.k
//      
//      WA -----  mound
//      evaluate() ----- .m.o!u.n.d
//
//      WA -----  fates
//      evaluate() ----- !f.a#t#e.s
//
//      WA -----  flute
//      evaluate() ----- !f!l!u!t!e    Correct
//
// TO TEST:
// g++ Wordle_Test.cpp testForWA.cpp -o test
// ./test
// 
// If wish to see feedback from program, check commented out std::cout at lines:
// [testForWA.cpp]: 78
// [Wordle_Test.cpp]: 53, 59, 111, 113, 114, 189, 191, 196, 197
//
// If wish to switch testing .txt file, check line 171 in [Wordle_test.cpp]

#include <iostream>
#include <fstream>
#include <vector>
#include <string>


std::string evaluate(const std::string&, const std::string&);
std::string test(const std::string&, const std::string&);


std::string evaluate(const std::string& guess, const std::string& word) {
    std::string result;
    int i = 0;
    for (i; i < 5; ++i) {
        bool flag = false;
        char indexInInput = guess[i];
        char indexFromWords = word[i];
        if (indexInInput == indexFromWords) {
            result += "!" + std::string(1, indexInInput);
            flag = true;
        } else {
            for (int j = 0; j < 5; j++) {
                char indexFromWordsp2 = word[j];
                if (indexInInput == word[j]) {
                    result += "#" + std::string(1, indexInInput);
                    flag = true;
                    break;
                }
            }
        }

        if (!flag) result += "." + std::string(1, indexInInput);

    }

    return result;

}


std::string test(const std::string& guess, const std::string& word) {
    std::string io = evaluate(guess, word);
    //std::cout << "test: " << io << std::endl;
    return io;
}