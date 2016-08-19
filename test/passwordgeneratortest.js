import { expect } from 'chai';
import { PasswordGenerator } from '../src/passwordgenerator.js';

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
});
