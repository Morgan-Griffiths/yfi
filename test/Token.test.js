// test/Box.test.js
// Load dependencies
const Web3 = require('web3');
const { expect } = require('chai');
const { deployContract } = require('ethereum-waffle');

// Import utilities from Test Helpers
const { BN, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');

// Load compiled artifacts
const Token = artifacts.require('GLDToken');

// Start test block
contract('GLDToken', function ([owner, other]) {
  let token;
  beforeEach(async function () {
    token = await Token.new({ from: owner });
  });
  // Testing whitelisting
  it('On create sets creater to correct role', async function () {
    expect(await token.hasRole(await token.MINTER_ROLE(), owner)).to.be.true;
  });
  it('Expect other address to not be whitelisted', async function () {
    expect(await token.hasRole(await token.MINTER_ROLE(), other)).to.be.false;
  });
  it('Add another address to be whitelisted', async function () {
    await token.whitelistAddress(other);
    expect(await token.hasRole(await token.MINTER_ROLE(), other)).to.be.true;
  });
  // Testing eth deposit and withdrawal
  it('Send in insufficient eth, trigger error', async function () {
    await expectRevert(
      token.sendTransaction({ value: 1e16, from: owner }),
      'VM Exception while processing transaction: revert Insufficient amount of ether sent'
    );
  });
  it('Send in eth from non approved address, should fail', async function () {
    await expectRevert(
      token.sendTransaction({ value: 1e18, from: other }),
      'VM Exception while processing transaction: revert Caller is not a minter'
    );
  });
  it('Send in eth, get tokens in return', async function () {
    expect(
      Web3.utils.fromWei(await token.balanceOf(owner), 'ether')
    ).to.be.equal('0');
    await token.sendTransaction({ value: 1e18, from: owner });
    expect(
      Web3.utils.fromWei(await token.balanceOf(owner), 'ether')
    ).to.be.equal('1');
  });
  it('Get tokens, redeem tokens, get eth in return', async function () {
    await token.sendTransaction({ value: 1e18, from: owner });
    expect(
      Web3.utils.fromWei(await token.balanceOf(owner), 'ether')
    ).to.be.equal('1');
    await token.withdraw(web3.utils.toWei('1', 'ether'), {
      from: owner
    });
    expect(
      Web3.utils.fromWei(await token.balanceOf(owner), 'ether')
    ).to.be.equal('0');
  });
  it('Swap eth to dai', async function () {
    let deadline = 10;
    await token.test_swap({ value: 1e18, from: owner });
    // expect(
    //   Web3.utils.fromWei(await token.balanceOf(owner), 'ether')
    // ).to.be.equal('1');
  });
  // const fundRaiseAddress = await token.address;
  // assert.equal(web3.eth.getBalance(fundRaiseAddress).toNumber(), 1e18);
  // const objectList = await ethers.getSigners();
  // const signer = objectList[0];
  // console.log(Object.getOwnPropertyNames(signer.provider));
  // console.log(signer.provider.send());
  // console.log(Object.getOwnPropertyNames(signer.provider.send));
  // const params = [
  //   {
  //     from: sender,
  //     to: receiver,
  //     value: ethers.utils.parseUnits(strEther, 'ether').toHexString()
  //   }
  // ];
  // const transactionHash = await signer.provider.send(
  //   token.depositEth,
  //   params
  // );
  // await token.depositEth();
  // expect(await token._isWhitelisted({ from: other })).to.be.true;
  // it('Send in tokens, get eth in return', async function () {
  //   await token.whitelistAddress(other);
  //   expect(await token._isWhitelisted({ from: other })).to.be.true;
  // });
});
