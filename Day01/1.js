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
    data.split('\n').map(num => parseInt(num)).forEach(num => {
        if(num > previous) {
            increased++;
        }

        previous = num;
    });

    console.log(`Number increased: ${increased}`);
}