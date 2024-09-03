//! This is only for nick
//! I am trying to test these algorithms
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

int scoreWord(const vector<string> &strs, const vector<int> &freq)
{
    int score = 0;
    for (const auto &word : strs)
    {
        for (const char &ch : word)
        {
            score += freq[ch - 'a'];
        }
    }
    return score;
}

int main()
{
    vector<string> strs = {"hello", "word", "apple", "grace", "grave", "grape", "grade", "grale"};
    vector<int> frequencies = calcFreq(strs);

    int score = scoreWord(strs, frequencies);

    // for actually printing the frequencies
    for (int i = 0; i < 26; ++i)
    {
        cout << static_cast<char>('a' + i) << ": " << frequencies[i] << endl;
    }

    cout << "The score of the words is: " << score << endl;
}