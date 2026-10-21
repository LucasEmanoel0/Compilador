class XmlWriter {
  constructor() { this.lines = []; this.level = 0; }
  indent() { return '  '.repeat(this.level); }
  open(tag) { this.lines.push(`${this.indent()}<${tag}>`); this.level++; }
  close(tag) { this.level--; this.lines.push(`${this.indent()}</${tag}>`); }
  token(token) { this.lines.push(`${this.indent()}<${token.type}> ${token.value} </${token.type}>`); }
  toString() { return this.lines.join('\n'); }
}
module.exports = XmlWriter;
