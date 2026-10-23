const assert = require('node:assert/strict');
const Parser = require('../../src/parser/Parser');
const XmlWriter = require('../../src/parser/XmlWriter');

const palavras = new Set('class constructor function method field static var int char boolean void true false null this let do if else while return'.split(' '));
const simbolos = new Set('{}()[].,;+-*/&|<>=~'.split(''));

// Gerador simples de tokens apenas para os cenários de teste.
function tokensDe(fragmentos) {
  return fragmentos.map((value, i) => ({
    type: palavras.has(value) ? 'keyword' : simbolos.has(value) ? 'symbol' : /^\d+$/.test(value) ? 'integerConstant' : value.startsWith('"') && value.endsWith('"') ? 'stringConstant' : 'identifier',
    value: value.startsWith('"') && value.endsWith('"') ? value.slice(1, -1) : value,
    line: 1, column: i + 1
  }));
}
function analisar(source) { return new Parser(tokensDe(source.trim().split(/\s+/))).parse(); }
let ok = 0;
function testar(nome, fn) {
  try { fn(); console.log('OK:', nome); ok++; }
  catch (err) { console.error('FALHOU:', nome, '\n', err.message); process.exitCode = 1; }
}

testar('1. classe vazia: XML exato', () => {
  const xml = analisar('class Main { }');
  assert.equal(xml, ['<class>', '  <keyword> class </keyword>', '  <identifier> Main </identifier>', '  <symbol> { </symbol>', '  <symbol> } </symbol>', '</class>'].join('\n'));
});

testar('2. variáveis static/field, funções e parâmetros', () => {
  const xml = analisar('class Main { static int a , b ; field boolean ligado ; function void run ( int x , boolean y ) { var int z ; let z = x + 2 ; return ; } }');
  assert.equal((xml.match(/<classVarDec>/g) || []).length, 2);
  assert.match(xml, /<parameterList>[\s\S]*<identifier> x <\/identifier>[\s\S]*<identifier> y <\/identifier>[\s\S]*<\/parameterList>/);
  assert.match(xml, /<varDec>/);
  assert.match(xml, /<letStatement>/);
  assert.match(xml, /<returnStatement>/);
  assert.match(xml, /<integerConstant> 2 <\/integerConstant>/);
});

testar('3. if/else, while e chamadas de sub-rotina', () => {
  const xml = analisar('class Main { function void run ( ) { var int x ; let x = 0 ; while ( x < 3 ) { if ( x = 1 ) { do Output . printInt ( x ) ; } else { do Output . printInt ( 0 ) ; } let x = x + 1 ; } return ; } }');
  for (const tag of ['whileStatement','ifStatement','doStatement','expressionList','returnStatement']) assert.ok(xml.includes('<' + tag + '>'), tag);
  assert.equal((xml.match(/<doStatement>/g)||[]).length, 2);
  assert.match(xml, /<symbol> &lt; <\/symbol>/);
});

testar('4. arrays, operadores unários e retorno com expressão', () => {
  const xml = analisar('class Test { function int f ( ) { var int x ; let x = - ( 3 + 2 ) ; let a [ 1 ] = ~ x ; return a [ 1 ] ; } }');
  assert.match(xml, /<symbol> \[ <\/symbol>/);
  assert.match(xml, /<symbol> ~ <\/symbol>/);
  assert.match(xml, /<returnStatement>[\s\S]*<expression>/);
});

testar('5. XML escapa &, < e >', () => {
  const w = new XmlWriter();
  w.token({type:'symbol', value:'&'});
  w.token({type:'symbol', value:'<'});
  w.token({type:'symbol', value:'>'});
  assert.equal(w.toString(), '<symbol> &amp; </symbol>\n<symbol> &lt; </symbol>\n<symbol> &gt; </symbol>');
});

testar('6. falta de ponto e vírgula: SyntaxError', () => {
  assert.throws(() => analisar('class Main { function void run ( ) { return } }'), SyntaxError);
});

testar('7. token extra após classe: SyntaxError', () => {
  assert.throws(() => analisar('class Main { } x'), SyntaxError);
});

testar('8. declaração sem tipo: SyntaxError', () => {
  assert.throws(() => analisar('class Main { field ; }'), SyntaxError);
});

console.log(`\nResultado: ${ok}/8 testes passaram.`);
