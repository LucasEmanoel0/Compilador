const fs = require("fs");
const arquivoEntrada = process.argv[2];
const arquivoSaida = process.argv[3];



const Scanner = require("./src/scanner/Scanner");
const Parser = require("./src/parser/Parser");

const codigo = fs.readFileSync(arquivoEntrada, "utf8");

const scanner = new Scanner(codigo);
const tokens = scanner.tokenize();

const parser = new Parser(tokens);
const xml = parser.parse();

fs.writeFileSync(arquivoSaida, xml, "utf8");

console.log(`XML gerado com sucesso: ${arquivoSaida}`);



