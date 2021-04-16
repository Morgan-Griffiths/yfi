// test/Box.test.js
// Load dependencies
const Web3 = require('web3');
const { expect } = require('chai');
const { waffle } = require('hardhat');
const { deployContract } = waffle;
const { sortAddresses } = require('../utils');
const { BigNumber } = require('ethers');
const erc20_abi = require('../erc20abi.json');
const token_abi = require('../token_abi.json');
const voting_abi = require('../voting_abi.json');

// Import utilities from Test Helpers
const { BN, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
const { web3 } = require('@openzeppelin/test-helpers/src/setup');

const DAI_ADDRESS = '0x6B175474E89094C44Da98b954EedeAC495271d0F';
const WBTC_ADDRESS = '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599';
const WETH_ADDRESS = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
// Load compiled artifacts
// const Token = artifacts.require('BFIToken');
// const tinyToken = artifacts.require('TinyToken');
// const Voting = artifacts.require('Voting');
let Voting;
let tinyToken;
let Token;
let token;
let tiny;
let voting;
let signer1, signer2;

contract('BFIToken', function () {
  beforeEach(async function () {
    [signer1, signer2] = await ethers.getSigners();
    Token = await ethers.getContractFactory('BFIToken');
    tinyToken = await ethers.getContractFactory('TinyToken');
    Voting = await ethers.getContractFactory('Voting');
    const { addresses, weights } = sortAddresses(
      [DAI_ADDRESS, WBTC_ADDRESS],
      ['5000000', '5000000']
    );
    console.log('Deploying Token...');
    token = await Token.deploy(addresses, weights);
    tiny = await tinyToken.deploy(token.address);
    voting = await Voting.deploy([signer1.address], token.address);
    // setMigrator for token
    await token.setMigrator(tiny.address);
    // add voting to whitelisted addresses for token
    await token.whitelistAddress(voting.address);
    tokenContract = new ethers.Contract(token.address, token_abi, signer1);
    tokenContract = new ethers.Contract(voting.address, voting_abi, signer1);
    console.log('Finished deploying');
    console.log(
      Web3.utils.fromWei(
        (await ethers.provider.getBalance(signer1.address)).toString()
      ),
      'Owner balance'
    );
  });
  // it('Deposit', async function () {
  //   let value = BigNumber.from(10).pow(18);
  //   let gasPrice = BigNumber.from(10).pow(1);
  //   let gasLimit = BigNumber.from(10).pow(6);
  //   console.log(await token.totalSupply());
  //   console.log(value, gasPrice, gasLimit);
  //   console.log(await token.deposit({ value }));
  // });
});

// Start test block
// contract('BFIToken', function ([owner, other]) {
//   let token;
//   let tiny;
//   let voting;
//   let tokenContract;
//   let votingContract;
//   let value = BigNumber.from(10).pow(18);
//   let gasPrice = BigNumber.from(10).pow(1);
//   let gasLimit = BigNumber.from(10).pow(6);
//   beforeEach(async function () {
//     const [signer1, signer2] = await ethers.getSigners();
//     const Token = await ethers.getContractFactory('BFIToken', signer1);
//     const { addresses, weights } = sortAddresses(
//       [DAI_ADDRESS, WBTC_ADDRESS],
//       ['5000000', '5000000']
//     );
//     // const Token = await ethers.getContractFactory('BFIToken');
//     console.log('Deploying Token...');
//     token = await Token.deploy(addresses, weights);
//     // token = await Token.new(addresses, weights, { from: owner });
//     // await token.deployed();
//     // console.log('Token deployed to:', token.address);
//     // console.log('Deploying Tiny contract...');
//     // const tinyToken = await ethers.getContractFactory('TinyToken');
//     tiny = await tinyToken.new(token.address);
//     // const tiny = await tinyToken.deploy(token.address);
//     // await tiny.deployed();
//     // const Voting = await ethers.getContractFactory('Voting');
//     // const voting = await Voting.deploy([owner.address], token.address);
//     // console.log('Deploying Voting contract...', owner);
//     voting = await Voting.new([owner], token.address);
//     // await voting.deployed();
//     // console.log('Voting deployed to:', voting.address);
//     // console.log('tiny deployed to:', tiny.address);
//     // setMigrator for token
//     await token.setMigrator(tiny.address);
//     // add voting to whitelisted addresses for token
//     await token.whitelistAddress(voting.address);
//     // tokenContract = new web3.eth.Contract(token_abi, token.address, owner);
//     tokenContract = new ethers.Contract(token.address, token_abi, signer1);
//     votingContract = new web3.eth.Contract(voting_abi, voting.address, owner);
//     console.log('Finished deploying');
//     console.log(
//       Web3.utils.fromWei((await ethers.provider.getBalance(owner)).toString()),
//       'Owner balance'
//     );
//   });
//   // Testing whitelisting
//   // it('On create sets creater to correct role', async function () {
//   //   expect(await token.hasRole(await token.MINTER_ROLE(), owner)).to.be.true;
//   // });
//   // it('Expect other address to not be whitelisted', async function () {
//   //   expect(await token.hasRole(await token.MINTER_ROLE(), other)).to.be.false;
//   // });
//   // it('Add another address to be whitelisted', async function () {
//   //   await token.whitelistAddress(other);
//   //   expect(await token.hasRole(await token.MINTER_ROLE(), other)).to.be.true;
//   // });
//   // // Testing eth deposit and withdrawal
//   // it('Send in insufficient eth, trigger error', async function () {
//   //   await expectRevert(
//   //     token.sendTransaction({
//   //       data: tokenContract.methods.deposit().encodeABI(),
//   //       value: 1e16,
//   //       from: owner
//   //     }),
//   //     'VM Exception while processing transaction: revert Insufficient amount of ether sent'
//   //   );
//   // });
//   // it('Send in eth from non approved address, should fail', async function () {
//   //   await expectRevert(
//   //     // await tokenContract.methods.deposit({ value: 1e18 }),
//   //     token.sendTransaction({
//   //       data: tokenContract.methods.deposit().encodeABI(),
//   //       value: 1e18,
//   //       from: other,
//   //       gasPrice,
//   //       gasLimit
//   //     }),
//   //     'VM Exception while processing transaction: revert Caller is not a minter'
//   //   );
//   // });
//     expect(
//       Web3.utils.fromWei((await token.balanceOf(owner)).toString(), 'ether')
//     ).to.be.equal('0');
//     // console.log(Object.getOwnPropertyNames(token));
//     // await token.deposit({ value });
//     // await tokenContract.deposit({ value, gasPrice, gasLimit });
//     // await tokenContract.methods.deposit().send({
//     //   from: owner,
//     //   to: token.address,
//     //   value,
//     //   gasPrice,
//     //   gasLimit
//     // });
//     // await signer.sendTransaction({
//     //   data: tokenContract.methods.deposit().encodeABI(),
//     //   value,
//     //   from: owner
//     // });
//     // expect(
//     //   Web3.utils.fromWei(await token.balanceOf(owner), 'ether')
//     // ).to.be.equal('1');
//   });
//   // it('Get tokens, redeem tokens, get eth in return', async function () {
//   //   await token.sendTransaction({
//   //     data: tokenContract.methods.deposit().encodeABI(),
//   //     value: 1e18,
//   //     from: owner
//   //   });
//   //   expect(
//   //     Web3.utils.fromWei(await token.balanceOf(owner), 'ether')
//   //   ).to.be.equal('1');
//   //   await token.withdraw(web3.utils.toWei('1', 'ether'), {
//   //     from: owner
//   //   });
//   //   expect(
//   //     Web3.utils.fromWei(await token.balanceOf(owner), 'ether')
//   //   ).to.be.equal('0');
//   // });
//   // it('Swap eth to dai', async function () {
//   //   await token.sendTransaction({
//   //     data: tokenContract.methods.deposit().encodeABI(),
//   //     value: `${1e18}`
//   //   });
//   //   console.log('dai balance', await token.balanceOf(owner));
//   //   expect(
//   //     Web3.utils.fromWei(await token.balanceOf(owner), 'ether')
//   //   ).to.be.greaterThan('0');
//   // });
//   // const fundRaiseAddress = await token.address;
//   // assert.equal(web3.eth.getBalance(fundRaiseAddress).toNumber(), 1e18);
//   // const objectList = await ethers.getSigners();
//   // const signer = objectList[0];
//   // console.log(Object.getOwnPropertyNames(signer.provider));
//   // console.log(signer.provider.send());
//   // console.log(Object.getOwnPropertyNames(signer.provider.send));
//   // const params = [
//   //   {
//   //     from: sender,
//   //     to: receiver,
//   //     value: ethers.utils.parseUnits(strEther, 'ether').toHexString()
//   //   }
//   // ];
//   // const transactionHash = await signer.provider.send(
//   //   token.depositEth,
//   //   params
//   // );
//   // await token.depositEth();
//   // expect(await token._isWhitelisted({ from: other })).to.be.true;
//   // it('Send in tokens, get eth in return', async function () {
//   //   await token.whitelistAddress(other);
//   //   expect(await token._isWhitelisted({ from: other })).to.be.true;
//   // });
// });
