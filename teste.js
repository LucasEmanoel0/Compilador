const Scanner = require("./src/scanner/Scanner");

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

console.log(scanner.tokenize());