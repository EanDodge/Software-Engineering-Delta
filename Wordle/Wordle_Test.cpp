//Delta Group Wordle Assistant Tester
//8/29/2024

#include <iostream>
#include <vector>
#include <string>
#include <fstream>
#include <algorithm>
#include <numeric>
#include <functional>

#include "testForWA.hpp"

using std::cout; using std::endl; using std::cin;
using std::vector; using std::string; 
using std::ifstream; using std::ofstream;
void myErasenot(vector<string>&, vector<char>&, const char&, const int& place); //will delete every word that has letter in it
void myErasehave(vector<string>&, const char&, const int&); // will delete every word that doesnt have letter in it
void myEraseplace(vector<string>&, const char&, const int&); // will delete word if letter not in right place
void print(vector<string>);
char most_common_start(const vector<string>&);

void WA(const vector<string>& pastWordleVec, const int& numWord, int& winCounter, int& almostCounter, vector<string>& wordlesNotSolved){
    ifstream fin("rand_words_temp.txt");
     if (fin.fail())
    { // made to exit program if file 1 not found
        cout << "failed to open file 1" << endl;
        exit(1);
    }
    
    vector<string> strs;
    string myString = "";
    getline(fin, myString);
    while(!fin.eof()){
        //cout << "got here";
        strs.push_back(myString); //put all words from words.txt into strs.
        getline(fin, myString);
    }
    //cout << strs.size();
    string guess = "carve"; //always start with glyph
    //myErase(strs, 'a');
    //cout << strs.size();

    // for(auto i: strs){
    //     cout << i << endl;
    // }
    //.(not found), #(found, not in right place), !(in right place)
    string result = "";
    vector<char> bank; //for letters that wont be deleted
    //cin >> result;
    bool flag2 = false; // for repetition in testing
    std::string correctWord = pastWordleVec[numWord];
    int i = 0, j = 0;
    while(j != 5){
        //cout << "this is your guess '" << guess << "'"<<endl;
        //cin >> result;
        //////////////////////////Test:
        result = test(guess, correctWord);
        if(result[0] == '!' && result[2] == '!' && result[4] == '!' 
        && result[6] == '!' && result[8] == '!'){ //if all is correct
            //cout << "Good job! See you tomorrow";
            //exit(1);
            flag2 = true;
            ++winCounter;
            break;
        }
        bool flag = false;
        i = 0;
        while (i!=10){
            //cout << result[i]<<endl;
            switch(result[i]){ 
            case '.': //grey
                myErasenot(strs, bank, result[i+1], i/2);   //will delete every word that has the letter not used
                //cout << "case 1"<<endl;;
                break;
            case '#': //yellow
                bank.push_back(result[i+1]);
                myErasehave(strs, result[i+1], i/2);  // will delete every word that doesnt have letter
                //cout << "case 2"<<endl;
                break;
            case '!': //green
                bank.push_back(result[i+1]);
                myEraseplace(strs, result[i+1], i/2 ); //will delete every word that doesnt have letter in place
                //cout << "case 3"<<endl;
                //cout << i/2 << endl;
                break;
            default:
                print(strs);
                --j;
                flag = true;
            }
            i+=2; // increase by two for the word, because of a symbol, then letter
            if (flag == true) // for debug purpose, if want to see bank, then leave
                break;
        }
        ++j; //increase row of wordle
        if(guess != strs[0])
            guess = strs[0];
        else
            guess = strs.size() > 1 ? strs[1] : strs[0];

        
        if (j == 1)
            guess = "downy";
        if (j == 2)
            guess = "plumb";
        if (j == 3)
            guess = "sight";
        if (j == 4) {
            for (auto word : strs) {
                if (word[0] == most_common_start(strs)) {
                    guess = word;
                }
            }
        }
        
    }
    if (!flag2) {
        //cout<<"our last try '"<< guess << "'"<<endl;
        if (guess == correctWord) {
            //cout << test(guess, correctWord) << endl;
            //cout << "Good job! See you tomorrow";
            ++winCounter;
        }else{
        //print(strs);
        int checkIfInc = almostCounter;
        for (auto s : strs) if (s == correctWord) ++almostCounter;
        
        if (checkIfInc != almostCounter) wordlesNotSolved.push_back(correctWord);
        }
    }
}

void myErasenot(vector<string>& strs, vector<char>& bank, const char& a,const int& place){ //grey letter case
                                        //checks a word bank so it doesnt purge words that have double letter (shoot)
                                        //will purge every word with letter in that position of double letter(#o.o)
                                        //If false, will purge every word with that letter
    bool flag = false;
    for(auto i: bank){
        if (a == i) //if a is in the word bank, do not delete it from word, just delete words that have it in that spot
            flag = true;
    }
    if(flag){  
        strs.erase(remove_if(strs.begin(), strs.end(),[&a, place](string str)
   {return str[place] == a;}),strs.end());
    }
    else{
    strs.erase(remove_if(strs.begin(), strs.end(),[&a](string str)
   {return str.find(a) != string::npos;}),strs.end());
    }
}
void myErasehave(vector<string>& strs, const char& a, const int& place){ // yellow letter case
                                                            // deletes all words that have that letter in that spot
                                                            // deletes all words that dont have that letter at all
    strs.erase(remove_if(strs.begin(), strs.end(),[&a, place](string str)
   {return str[place] == a;}),strs.end());
    strs.erase(remove_if(strs.begin(), strs.end(),[&a](string str)
   {return str.find(a) == string::npos;}),strs.end());
   
}
void myEraseplace(vector<string>& strs, const char& a, const int& place){// this is the green letter case
                                                         // Will purge words that dont have letter in that position
    //myErasehave(strs,a);
    strs.erase(remove_if(strs.begin(), strs.end(),[&a, place](string str)
   {return str[place] != a;}),strs.end());
}

void print(vector<string> strs){ //Will print all words left in strs
    for (auto i: strs){ 
        cout << i << endl;
    }
}

//calculates the most common starting letter out of the remaining words
char most_common_start(const vector<string>& strs) {
    char start_letters[strs.size()];
    for (int i = 0; i < strs.size(); ++i) {
        start_letters[i] = strs[i][0];
    }

    int letter_counts[26] = {0};
    for (char letter : start_letters) {
        if (letter >= 'a' && letter <= 'z') {
            ++letter_counts[letter - 'a'];
        }
    }
    // for (int i = 0; i < 26; ++i) {
    //     cout << letter_counts[i] << ' ';
    // }
    // cout << endl;

    int maxCount = std::distance(letter_counts, std::max_element(letter_counts, letter_counts + 26));
    char maxChar = maxCount + 'a';

    return maxChar;
}

int main() {
    
    //ifstream allWords("pastWordles.txt");
    ifstream allWords("rand_words_temp.txt");
    vector<string> wordsToTest;

    string s;
    while (getline(allWords, s)){
        wordsToTest.push_back(s);
    }
    allWords.close();
    

    //wordsToTest.push_back("eerie");
    //vector<string> wordsToTest {"ionic", "mover", "wrote", "rears"};

    int winCounter = 0;
    int almostCounter = 0;
    vector<string> wordlesNotSolved;
    
    for (int i = 0; i < wordsToTest.size(); ++i) {
        //cout << "Word to solve for:  " << wordsToTest[i] << endl;
        WA(wordsToTest, i, winCounter, almostCounter, wordlesNotSolved);
        //cout << endl << endl << endl;
    }

    cout << "Words solved correctly:  " << winCounter << "." << endl;
    cout << "Words almost solved [in strs after]:  " << almostCounter << "." << endl;
    // cout << "Words not solved:  " << endl;
    // print(wordlesNotSolved);
}
