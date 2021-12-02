const fs = require('fs');
const path = require('path');

try {
    let fileName = path.resolve(__dirname, 'input.txt');
    if(process.argv.length > 2) {
        fileName = process.argv[2];
    }
    const data = fs.readFileSync(fileName, 'utf8');
    processInput(data);
} catch(e) {
    console.error(e);
}

function processInput(data) {
    let horizontal = 0;
    let vertical = 0;
    let aim = 0;
    const input = data.split('\n').map(line => {
        const pair = line.split(" ");
        return {
            "command": pair[0].toLowerCase(),
            "units": parseInt(pair[1])
        };
    })

    input.forEach(i => {
        switch(i.command) {
            case "forward":
                horizontal += i.units;
                vertical += i.units * aim;
                break;
            case "up":
                aim -= i.units;
                break;
            case "down":
                aim += i.units;
                break;
            default:
                console.log(`Unknown command "${i.command}"" with units ${i.units}`);
                break;
        }
    });

    console.log(`Final Position: Horizontal ${horizontal}, Depth ${vertical}, Answer is ${horizontal * vertical}`);
}