const assert = require("node:assert/strict");
const Scanner = require("../../src/scanner/Scanner");

const casos = [
    {
        nome: "Numero acima do limite",
        codigo: "let idade = 40000;",
        erro: /Número inteiro fora do limite/
    },
    {
        nome: "String nao fechada",
        codigo: 'do Output.printString("Ola mundo);',
        erro: /String não fechada/
    },
    {
        nome: "Comentario de bloco nao fechado",
        codigo: "/* comentario sem fechamento",
        erro: /Comentário de bloco não fechado/
    },
    {
        nome: "Caractere invalido",
        codigo: "let valor = @;",
        erro: /Caractere inválido/
    }
];

for (const caso of casos) {
    assert.throws(
        () => new Scanner(caso.codigo).tokenize(),
        caso.erro,
        caso.nome
    );

    console.log(`PASSOU: ${caso.nome}`);
}