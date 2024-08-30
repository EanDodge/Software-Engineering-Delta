//Delta Group
//8/29/2024

#include <iostream>
#include <vector>
#include <string>
#include <fstream>

using std::cout; using std::endl; using std::cin;
using std::vector; using std::string; 
using std::ifstream; using std::ofstream;


int main(){
    ifstream fin("five_words.txt");
    
    vector<string> strs;
    string myString = "";
    getline(fin, myString);
    int i= 0;
    while(strs != fin.eof()){
        strs[i] = myString;
        getline(fin, myString);
        ++i;
    }
    for(auto i : strs){
        cout << i<< endl;
    }
}