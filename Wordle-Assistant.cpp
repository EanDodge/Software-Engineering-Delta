// Delta Group Wordle Assistant
// 8/29/2024

#include <iostream>
#include <vector>
#include <string>
#include <fstream>
#include <algorithm>
#include <numeric>
#include <functional>

using std::cin;
using std::cout;
using std::endl;
using std::ifstream;
using std::ofstream;
using std::string;
using std::vector;
void myErasenot(vector<string> &, vector<char> &, const char &, const int &place); // will delete every word that has letter in it
void myErasehave(vector<string> &, const char &, const int &);                     // will delete every word that doesnt have letter in it
void myEraseplace(vector<string> &, const char &, const int &);                    // will delete word if letter not in right place
void print(vector<string>);
char most_common_start(const vector<string>&);

int main()
{
    ifstream fin("five_words.txt");
    if (fin.fail())
    { // made to exit program if file 1 not found
        cout << "failed to open file 1" << endl;
        exit(1);
    }

    vector<string> strs;
    string myString = "";
    getline(fin, myString);
    while (!fin.eof())
    {
        // cout << "got here";
        strs.push_back(myString); // put all words from words.txt into strs.
        getline(fin, myString);
    }
    // cout << strs.size();
    int counter = 0;
    string guess = "carve"; // always start with glyph
    // myErase(strs, 'a');
    // cout << strs.size();
    //  for(auto i: strs){
    //      cout << i << endl;
    //  }
    //.(not found), #(found, not in right place), !(in right place)
    string result = "";
    vector<char> bank; // for letters that wont be deleted
    // cin >> result;
    int i = 0, j = 0;
    cout << "\n==============================================================================\n"
         << " Format for our wordle solver...\n"
         << " '!' before your letter: means correct letter and position... (Green)\n"
         << " '#' before your letter: means correct letter, but wrong position... (Yellow)\n"
         << " '.' before your letter: means wrong letter and position... (Gray)\n"
         << "==============================================================================\n"
         << std::endl;
    while (j != 5)
    {
        cout << "This is your guess: '" << guess << "'" << endl;
        cin >> result;
        if (result[0] == '!' && result[2] == '!' && result[4] == '!' && result[6] == '!' && result[8] == '!')
        { // if all is correct
            cout << "Good job! See you tomorrow";
            exit(1);
        }
        bool flag = false;
        i = 0;
        while (i != 10)
        {
            // cout << result[i]<<endl;
            switch (result[i])
            {
            case '.':                                         // grey
                myErasenot(strs, bank, result[i + 1], i / 2); // will delete every word that has the letter not used
                // cout << "case 1"<<endl;;
                break;
            case '#': // yellow
                bank.push_back(result[i + 1]);
                myErasehave(strs, result[i + 1], i / 2); // will delete every word that doesnt have letter
                // cout << "case 2"<<endl;
                break;
            case '!': // green
                bank.push_back(result[i + 1]);
                myEraseplace(strs, result[i + 1], i / 2); // will delete every word that doesnt have letter in place
                // cout << "case 3"<<endl;
                // cout << i/2 << endl;
                break;
            default:
                print(strs);
                --j;
                flag = true;
            }
            i += 2;           // increase by two for the word, because of a symbol, then letter
            if (flag == true) // for debug purpose, if want to see bank, then leave
                break;
        }
        ++j; // increase row of wordle

        char temp = most_common_start(strs);

        if (guess != strs[0])
            guess = strs[0];
        else
            // we need to be sure we are not repeating the same word
            guess = strs.size() > 1 ? strs[1] : strs[0];

        // for (auto a : strs)
        // {
        //     cout << a << endl;
        // }

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
    //print(strs);
    cout << "Our last try: '" << guess << "'" << endl;
}

void myErasenot(vector<string> &strs, vector<char> &bank, const char &a, const int &place)
{ // grey letter case
    // checks a word bank so it doesnt purge words that have double letter (shoot)
    // will purge every word with letter in that position of double letter(#o.o)
    // If false, will purge every word with that letter
    bool flag = false;
    for (auto i : bank)
    {
        if (a == i) // if a is in the word bank, do not delete it from word, just delete words that have it in that spot
            flag = true;
    }
    if (flag)
    {
        strs.erase(remove_if(strs.begin(), strs.end(), [&a, place](string str)
                             { return str[place] == a; }),
                   strs.end());
    }
    else
    {
        strs.erase(remove_if(strs.begin(), strs.end(), [&a](string str)
                             { return str.find(a) != string::npos; }),
                   strs.end());
    }
}
void myErasehave(vector<string> &strs, const char &a, const int &place)
{ // yellow letter case
    // deletes all words that have that letter in that spot
    // deletes all words that dont have that letter at all
    strs.erase(remove_if(strs.begin(), strs.end(), [&a, place](string str)
                         { return str[place] == a; }),
               strs.end());
    strs.erase(remove_if(strs.begin(), strs.end(), [&a](string str)
                         { return str.find(a) == string::npos; }),
               strs.end());
}
void myEraseplace(vector<string> &strs, const char &a, const int &place)
{ // this is the green letter case
    // Will purge words that dont have letter in that position
    // myErasehave(strs,a);
    strs.erase(remove_if(strs.begin(), strs.end(), [&a, place](string str)
                         { return str[place] != a; }),
               strs.end());
}

void print(vector<string> strs)
{ // Will print all words left in strs
    for (auto i : strs)
    {
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
    for (int i = 0; i < 26; ++i) {
        cout << letter_counts[i] << ' ';
    }
    cout << endl;

    int maxCount = std::distance(letter_counts, std::max_element(letter_counts, letter_counts + 26));
    char maxChar = maxCount + 'a';

    return maxChar;
}

// helper function to calculate letter frequencies
std::vector<int> calcFreq(const vector<string> &strs)
{
    std::vector<int> freq(26, 0); // only 26 letters in the alphabet
    for (const auto &word : strs)
    {
        for (const char &ch : word)
        {
            freq[ch - 'a']++;
        }
    }
    return freq;
}