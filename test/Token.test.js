// test/Box.test.js
// Load dependencies
const { expect } = require('chai');

// Import utilities from Test Helpers
const { BN, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');

// Load compiled artifacts
const Token = artifacts.require('GLDToken');

// Start test block
contract('GLDToken', function ([owner, other]) {
  beforeEach(async function () {
    this.token = await Token.new({ from: owner });
  });
  // Testing whitelisting
  it('On create sets creater to correct role', async function () {
    expect(await this.token._isWhitelisted()).to.be.true;
  });
  it('Expect other address to not be whitelisted', async function () {
    expect(await this.token._isWhitelisted({ from: other })).to.be.false;
  });
  it('Add another address to be whitelisted', async function () {
    await this.token.whitelistAddress(other);
    expect(await this.token._isWhitelisted({ from: other })).to.be.true;
  });
  // Testing eth deposit and withdrawal
  it('Send in eth, get tokens in return', async function () {
    await this.token.depositEth({value:});
    expect(await this.token._isWhitelisted({ from: other })).to.be.true;
  });
  // it('Send in tokens, get eth in return', async function () {
  //   await this.token.whitelistAddress(other);
  //   expect(await this.token._isWhitelisted({ from: other })).to.be.true;
  // });
});
