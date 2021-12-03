function processInput(data) {
    let horizontal = 0;
    let vertical = 0;
    const input = data.map(line => {
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
                break;
            case "up":
                vertical -= i.units;
                break;
            case "down":
                vertical += i.units;
                break;
            default:
                console.log(`Unknown command "${i.command}"" with units ${i.units}`);
                break;
        }
    });

    console.log(`Final Position: Horizontal ${horizontal}, Depth ${vertical}, Answer is ${horizontal * vertical}`);
}

module.exports = { processInput };