const fs = require('fs');
const path = require('path');

try {
    const data = fs.readFileSync(path.resolve(__dirname, '1-input.txt'), 'utf8');
    processInput(data);
} catch(e) {
    console.error(e);
}

function processInput(data) {
    let previous = -1;
    let increased = -1;
    const dataArray = data.split('\n').map(num => parseInt(num));
    for(let i = 0; i < dataArray.length - 3 + 1; i++) {
        let currentWindowSum = 0;
        for(let j = 0; j < 3; j++) {
            currentWindowSum += dataArray[i + j];
        }

        if(currentWindowSum > previous) {
            increased++;
        }

        previous = currentWindowSum;
    }

    console.log(`Number increased: ${increased}`);
}