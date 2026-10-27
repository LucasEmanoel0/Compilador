const Scanner = require("./src/scanner/Scanner");
const Parser = require("./src/parser/Parser");

const codigo = `
class Main {
    function void main() {
        var int idade;
        let idade = 21;
        do Output.printString("Ola mundo");
        return;
    }
}
`;

const scanner = new Scanner(codigo);
const tokens = scanner.tokenize();

const parser = new Parser(tokens);
const xml = parser.parse();

console.log(xml);