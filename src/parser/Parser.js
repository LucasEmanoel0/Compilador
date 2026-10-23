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
      while (this.match('constructor', 'function', 'method')) this.subroutineDec();
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
  subroutineDec() {
    this.node('subroutineDec', () => {
      if (!this.match('constructor', 'function', 'method')) this.fail('sub-rotina esperada');
      this.consume(this.peek().value);
      if (this.match('void')) this.consume('void'); else this.type();
      this.consume('identifier'); this.consume('('); this.parameterList(); this.consume(')');
      this.subroutineBody();
    });
  }
  parameterList() {
    this.node('parameterList', () => {
      if (!this.match(')')) {
        this.type(); this.consume('identifier');
        while (this.match(',')) { this.consume(','); this.type(); this.consume('identifier'); }
      }
    });
  }
  subroutineBody() {
    this.node('subroutineBody', () => {
      this.consume('{');
      while (this.match('var')) this.varDec();
      this.statements(); this.consume('}');
    });
  }
  varDec() {
    this.node('varDec', () => {
      this.consume('var'); this.type(); this.consume('identifier');
      while (this.match(',')) { this.consume(','); this.consume('identifier'); }
      this.consume(';');
    });
  }
  statements() {
    this.node('statements', () => {
      while (this.match('let', 'return')) {
        if (this.match('let')) this.letStatement();
        else this.returnStatement();
      }
    });
  }
  letStatement() {
    this.node('letStatement', () => {
      this.consume('let'); this.consume('identifier');
      if (this.match('[')) { this.consume('['); this.expression(); this.consume(']'); }
      this.consume('='); this.expression(); this.consume(';');
    });
  }
  returnStatement() {
    this.node('returnStatement', () => {
      this.consume('return'); if (!this.match(';')) this.expression(); this.consume(';');
    });
  }
  expression() {
    this.node('expression', () => {
      this.term();
      while (this.match('+', '-', '*', '/', '&', '|', '<', '>', '=')) {
        this.consume(this.peek().value); this.term();
      }
    });
  }
  term() {
    this.node('term', () => {
      const token = this.peek();
      if (!token) this.fail('termo esperado');
      if (this.matchType('integerConstant', 'integer', 'int', 'stringConstant', 'string')) {
        this.consume(['stringConstant', 'string'].includes(token.type) ? 'stringConstant' : 'integerConstant');
      } else if (this.match('true', 'false', 'null', 'this')) {
        this.consume(this.peek().value);
      } else if (this.matchType('identifier')) {
        this.consume('identifier');
      } else this.fail(`termo inválido: ${token.value}`);
    });
  }
  subroutineCall() {
    this.consume('identifier');
    if (this.match('.')) { this.consume('.'); this.consume('identifier'); }
    this.consume('('); this.expressionList(); this.consume(')');
  }
  expressionList() {
    this.node('expressionList', () => {
      if (!this.match(')')) {
        this.expression();
        while (this.match(',')) { this.consume(','); this.expression(); }
      }
    });
  }
}
module.exports = Parser;
