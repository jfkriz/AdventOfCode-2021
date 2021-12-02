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

module.exports = { processInput };