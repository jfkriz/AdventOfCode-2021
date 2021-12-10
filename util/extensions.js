Array.prototype.sum = function() {
    return this.reduce((a, b) => a + b, 0);
}

Array.prototype.multiply = function() {
    return this.reduce((a, b) => a * b, 1);
}