with open("words.txt", "r") as f:
    words = f.readlines()

words = [w.strip() for w in words]

five_words = [word for word in words if len(word) == 5]

# print(len(five_words)) //prints entire 5-word list

freqs = [0] * 26
counter = 0
for letter in "abcdefghijklmnopqrstuvwxyz":
    occurrences = [0] * 5
    for word in five_words:
        if word[0] == letter: occurrences[0] += 1
        if word[1] == letter: occurrences[1] += 1
        if word[2] == letter: occurrences[2] += 1
        if word[3] == letter: occurrences[3] += 1
        if word[4] == letter: occurrences[4] += 1
    
    print(letter + ": ", end = ' ')
    percent = [0] * 5 
    sum = 0
    for i in range(0, len(occurrences)):
        sum = sum + occurrences[i]
        print(occurrences[i], end = ' ')

    freqs[counter] = sum
    counter += 1

    max = 0
    maxIndex = 0
    min = 10000
    minIndex = 0
    print()
    for i in range(0, len(percent)):
        percent[i] = round(occurrences[i] / sum * 100, 2)
        print(percent[i], end = "% ")
        if occurrences[i] > max:
            max = occurrences[i]
            maxIndex = i + 1
        if occurrences[i] < min:
            min = occurrences[i]
            minIndex = i + 1

    print()
    print(letter + " appears most often at position " + str(maxIndex))
    print(letter + " appears least often at position " + str(minIndex))
    print()

freq_order = (sorted(range(len(freqs)),key=freqs.__getitem__))
for i in range(0, len(freq_order)): 
    freq_order[i] += 97
    freq_order[i] = chr(freq_order[i])
freq_order = freq_order[::-1] #reversing frequency order list

print("Letters in order of frequency: ", end = '')
print(*freq_order) 

# Below is how I got five-word text file:

# with open('five_words.txt', 'w+') as f:  
#     for words in five_words:
#         f.write('%s\n' %words)  
#     print("File written successfully")

# close the file
# f.close()

exit(0)