import { expect } from 'chai';
import PasswordGenerator from '../lib/passwordgenerator';
import { diceware8k } from '../lib/diceware8k';

describe('PasswordGenerator', () => {
  it('should generate a password', () => {
    const pw = new PasswordGenerator();
    expect(pw.generate()).to.be.a('string');
  });
  it('should generate random symbols', () => {
    const pw = new PasswordGenerator();
    const s1 = pw.symbol;
    const s2 = pw.symbol;
    expect(s1).to.be.a('string');
    expect(s2).to.be.a('string');
    expect(s1).to.not.equal(s2);
  });
  it('should make sure it has enough symbols', () => {
    const pw = new PasswordGenerator([]);
    expect(pw.symbolTable.length).to.be.equal(2);
  });
  it('should make sure it the symbol table is a power of two log', () => {
    const dw8kPlus1 = diceware8k;
    dw8kPlus1.push('1234');
    const pw = new PasswordGenerator(dw8kPlus1);
    expect(pw.symbolTable.length).to.be.equal(8192);
  });
  it('should make sure it the symbol table is not too long', () => {
    const longArray = Array.from({ length: 0xffff + 0x2 }, () => 'a');
    const pw = new PasswordGenerator(longArray);
    expect(pw.symbolTable.length).to.be.equal(0xffff + 0x1);
  });
  it('should use an array as a symbol table', () => {
    const notAnArray = 'value';
    expect(() => new PasswordGenerator(notAnArray)).to.throw(
      TypeError,
      'Symbol table must be an array.'
    );
  });
});
