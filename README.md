# Advent Of Code 2021
My solutions for the [Advent of Code - 2021](https://adventofcode.com/2021)

Create each Day's solutions in a structure like this:
```
./Day01 +
        |
        +- 1.js
        +- 2.js
        +- input.txt
        +- test-input.txt
        +- README.md

./Day02 +
        |
        +- 1.js
        +- 2.js
        +- input.txt
        +- test-input.txt
        +- README.md
./DayNN +
        |
        +- 1.js
        +- 2.js
        +- input.txt
        +- test-input.txt
        +- README.md
```

Assuming each day's solutions follow the above directory structure and naming conventions, you will be able to run each solution with a command like:
```
node aoc.js DayNumber ChallengeNumber [OptionalInputFileName]
```
Where DayNumber is the day number, like "1" for Day01, and ChallengeNumber is the challenge number, typically "1" or "2".  You can optionally specify an InputFileName (just the file name, it will look for the file in the Day directory), but it will default to a file named "input.txt" in the Day solution directory.

For each new Day...
- [ ] Create a DayNN directory
- [ ] In the DayNN directory, create a 1.js for the first challenge
- [ ] In the DayNN directory, create an input.txt file with the input for the challenge; optionally create a test-input.txt with the sample input, for easier testing
- [ ] Since the second challenge builds on the first, copy the completed 1.js to 2.js, and modify for the second
- [ ] Copy the source of the final HTML page after solving both challenges, and paste into [CodeBeautify](https://codebeautify.org/html-to-markdown) to get a markdown version of the page
- [ ] Add a README each day, with the markdown from CodeBeautify
- [ ] Commit the day's solution