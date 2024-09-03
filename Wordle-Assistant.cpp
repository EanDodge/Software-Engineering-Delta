//Delta Group
//8/29/2024

#include <iostream>
#include <vector>
#include <string>
#include <fstream>
#include <algorithm>
#include <numeric>
#include <functional>

using std::cout; using std::endl; using std::cin;
using std::vector; using std::string; 
using std::ifstream; using std::ofstream;
void myErasenot(vector<string>&, vector<char>&, const char&, const int& place); //will delete every word that has letter in it
void myErasehave(vector<string>&, const char&, const int&); // will delete every word that doesnt have letter in it
void myEraseplace(vector<string>&, const char&, const int&); // will delete word if letter not in right place
void print(vector<string>);
int main(){
    ifstream fin("words.txt");
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
    string guess = "notes"; //always start with notes
    //myErase(strs, 'a');
    //cout << strs.size();

    // for(auto i: strs){
    //     cout << i << endl;
    // }
    //.(not found), #(found, not in right place), !(in right place)
    string result = "";
    vector<char> bank; //for letters that wont be deleted
    //cin >> result;
    int i = 0, j = 0;
    while(j != 5){
        cout << "this is your guess '" << guess << "'"<<endl;
        cin >> result;
        if(result[0] == '!' && result[2] == '!' && result[4] == '!' 
        && result[6] == '!' && result[8] == '!'){ //if all is correct
            cout << "Good job! See you tomorrow";
            exit(1);
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
            guess = strs[1];
        
    }
    print(strs);
    cout<<"our last try '"<< guess << "'"<<endl;
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