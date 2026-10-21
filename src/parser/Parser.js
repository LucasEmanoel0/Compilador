const XmlWriter = require('./XmlWriter');

class Parser {
  constructor(tokens, writer = new XmlWriter()) {
    if (!Array.isArray(tokens)) throw new TypeError('Os tokens devem ser um array');
    this.tokens = tokens;
    this.pos = 0;
    this.writer = writer;
  }

  peek(offset = 0) { return this.tokens[this.pos + offset] ?? null; }
  advance() {
    const token = this.peek();
    if (token) this.pos++;
    return token;
  }
  match(...values) { const token = this.peek(); return token ? values.includes(token.value) : false; }
  matchType(...types) { const token = this.peek(); return token ? types.includes(token.type) : false; }
  fail(message) {
    const token = this.peek();
    const location = token ? `linha ${token.line}, coluna ${token.column}` : 'fim do arquivo';
    throw new SyntaxError(`Erro sintático (${location}): ${message}`);
  }
  _isValid(token, expected) {
    if (expected === 'identifier') return token.type === 'identifier';
    if (expected === 'integerConstant') return ['integerConstant', 'integer', 'int'].includes(token.type);
    if (expected === 'stringConstant') return ['stringConstant', 'string'].includes(token.type);
    return token.value === expected;
  }
  consume(expected) {
    const token = this.peek();
    if (!token) this.fail(`esperado ${expected}`);
    if (!this._isValid(token, expected)) this.fail(`esperado ${expected}, encontrado ${token.value}`);
    this.writer.token(this.advance());
    return token;
  }
  node(tag, callback) {
    this.writer.open(tag);
    callback();
    this.writer.close(tag);
  }
  parse() {
    this.class();
    if (this.peek() !== null) this.fail(`token inesperado: ${this.peek().value}`);
    return this.writer.toString();
  }
  class() {
    this.node('class', () => {
      this.consume('class'); this.consume('identifier'); this.consume('{');
      while (this.match('static', 'field')) this.classVarDec();
      this.consume('}');
    });
  }
  type() {
    if (this.match('int', 'char', 'boolean') || this.matchType('identifier')) this.consume(this.matchType('identifier') ? 'identifier' : this.peek().value);
    else this.fail('tipo esperado');
  }
  classVarDec() {
    this.node('classVarDec', () => {
      if (!this.match('static', 'field')) this.fail('esperado static ou field');
      this.consume(this.peek().value); this.type(); this.consume('identifier');
      while (this.match(',')) { this.consume(','); this.consume('identifier'); }
      this.consume(';');
    });
  }
}
module.exports = Parser;
