class CaveGraph {
    constructor(lines) {
        this.caves = new Set(lines.map(line => line.split('-')).flat());
    
        this.adjacentCaves = {};
        this.caves.forEach(c => this.adjacentCaves[c] = []);
        lines.map(line => line.split('-')).forEach(p => {
            // This was tricky - some entries have 'start' as the second node, had to make sure it was always the first,
            // otherwise the logic for finding paths was in problem 2 was trying to visit 'start' multiple times. Problem 1
            // worked fine without this though, which is interesting - I think it is because 'start' and 'end' were already
            // considered "small caves", so they were never allowed to be traversed more than once. But in problem 2, we
            // needed to be able to traverse any single small cave twice, but with 'start' being considered a small cave,
            // it was likely being hit more than once, causing other valid paths to be missed.
            if (p[1] == 'start') {
                p.reverse();
            }
            this.adjacentCaves[p[0]].push(p[1]);
            if (p[0] !== 'start') {
                this.adjacentCaves[p[1]].push(p[0]);
            }
        });
    }

    findAllPaths(allowTwoVisitsToOneSmallCave) {
        if (allowTwoVisitsToOneSmallCave === undefined) {
            allowTwoVisitsToOneSmallCave = false;
        }
        const visited = {};
        this.caves.forEach(c => visited[c] = 0);
        const currentPath = ['start'];
        const allPaths = [];

        this._findPaths('start', visited, currentPath, allPaths, allowTwoVisitsToOneSmallCave);

        return allPaths;
    }

    /**
     * This is based on a depth-first search (https://en.wikipedia.org/wiki/Depth-first_search), but modifies the behavior slightly
     * to allow "large caves" (nodes noted by uppercase name) to be traversed any number of times in a path, while "small caves", 
     * (nodes noted by lowercase names) can either only be traversed once as in problem #1, or in problem #2, where a single
     * small cave is allowed to be traversed twice.
     * 
     * @param {number} start the node to start on - should be 'start' on the first call 
     * @param {Map<string,number>} visited a map of nodes that have been visited, with counts of 
     * @param {Array<string>} currentPath the list of nodes included in the path currently being calculated
     * @param {Array<string>} allPaths the list of discovered paths from 'start' to 'end' 
     * @param {boolean} allowTwoVisitsToOneSmallCave whether this should allow two visits to single small cave (true = problem #2, false = problem #1)  
     */
    _findPaths(start, visited, currentPath, allPaths, allowTwoVisitsToOneSmallCave) {
        if(start == 'end') {
            allPaths.push(currentPath.join(' -> '));
            return;
        }

        visited[start] = visited[start] + 1;

        for (const destination of this.adjacentCaves[start]) {
            if (visited[start] <=1 || start == start.toUpperCase() || (allowTwoVisitsToOneSmallCave && this._canVisitThisSmallCaveAgain(start, visited))) {
                currentPath.push(destination);
                this._findPaths(destination, visited, currentPath, allPaths, allowTwoVisitsToOneSmallCave);

                currentPath.splice(currentPath.indexOf(destination), 1);
            }
        }

        visited[start] = visited[start] - 1;
    }

    /**
     * Determine if the current cave can be traversed again. This is true if this cave has not already been traversed twice,
     * and no other small cave has not been traversed twice yet.
     */
    _canVisitThisSmallCaveAgain(current, visited) {
        if (current == current.toLowerCase() && visited[current] > 2) {
            return false;
        }

        const smallCaves = Object.entries(visited).filter(([key, _]) => key != 'start' && key != 'end' && key == key.toLowerCase());
        return smallCaves.filter(([key, value]) => key != current && value > 1).length <= 0;
    }
}

module.exports = { CaveGraph };