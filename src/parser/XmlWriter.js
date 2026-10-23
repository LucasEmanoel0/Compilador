class XmlWriter {
  constructor() { this.lines = []; this.level = 0; }
  indent() { return '  '.repeat(this.level); }
  open(tag) { this.lines.push(`${this.indent()}<${tag}>`); this.level++; }
  close(tag) { this.level--; this.lines.push(`${this.indent()}</${tag}>`); }
  escape(value) { return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  token(token) {
    const type = ({integer:'integerConstant', int:'integerConstant', string:'stringConstant'})[token.type] || token.type;
    if (!['keyword','symbol','identifier','integerConstant','stringConstant'].includes(type)) throw new TypeError(`Tipo de token inválido: ${token.type}`);
    this.lines.push(`${this.indent()}<${type}> ${this.escape(token.value)} </${type}>`);
  }
  toString() { return this.lines.join('\n'); }
}
module.exports = XmlWriter;
