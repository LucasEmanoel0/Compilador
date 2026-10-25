const SYMBOLS = new Set([
    "{", "}", "(", ")", "[", "]",
    ".", ",", ";", "+", "-", "*", "/",
    "&", "|", "<", ">", "=", "~"
]);

const KEYWORDS = new Set([
    "class", "constructor", "function", "method",
    "field", "static", "var", "int", "char",
    "boolean", "void", "true", "false", "null",
    "this", "let", "do", "if", "else", "while",
    "return"
]);






class Scanner {
    constructor(source) {
        this.source = source;
        this.tokens = [];
        this.start = 0;
        this.position = 0;
        this.line = 1;
        this.column = 1;
    }

    peek() {
    return this.source[this.position];
}

advance() {
    let char = this.source[this.position];
    this.position++;

    if (char === "\n") {
        this.line++;
        this.column = 1;
    } else {
        this.column++;
    }

    return char;
}

isAtEnd() {
    return this.position >= this.source.length;
}
}

module.exports = Scanner;