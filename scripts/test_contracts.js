// scripts/index.js

const TOKENS = require('../tokenAddress');
const { BigNumber } = require('ethers');
const { ConsoleLogger } = require('ts-generator/dist/logger');
const { BN, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const erc20_abi = require('../erc20abi.json');
const token_abi = require('../token_abi.json');
const voting_abi = require('../voting_abi.json');
var fs = require('fs');
const { sortAddresses } = require('../utils');

const Network = 'MAINNET';
const DAI = TOKENS[Network]['DAI'];
const LINK = TOKENS[Network]['LINK'];
const WETH = TOKENS[Network]['WETH'];
const WBTC = TOKENS[Network]['WBTC'];
const API3 = TOKENS[Network]['API3'];

// const DAI_ADDRESS = '0x6B175474E89094C44Da98b954EedeAC495271d0F';
// const WBTC_ADDRESS = '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599';
// const WETH_ADDRESS = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
// const LINK_ADDRESS = '0x514910771AF9Ca656af840dff83E8264EcF986CA';
// const API3_ADDRESS = '0x0b38210ea11411557c13457D4dA7dC6ea731B88a';
const UNISWAP_ROUTER_ADDRESS = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';

const router_abi = [
  'function WETH() external pure returns (address)',
  'function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)',
  'function swapExactTokensForTokensSupportingFeeOnTransferTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external',
  'function swapExactTokensForETHSupportingFeeOnTransferTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external',
  'function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)'
];

function log_outputs(data) {
  data.events.forEach((element) => {
    // console.log(element);
    try {
      element.args.forEach((value) => {
        console.log(parseInt(value._hex, 16));
      });
    } catch {
      // console.log(element);
    }
  });
}

async function vote_and_migrate(token, votingContract, owner, addr1) {
  let { addresses, weights } = sortAddresses(
    [LINK.tokenAddress, API3.tokenAddress],
    ['300000', '700000']
  );
  // await token.whitelistAddress(votingContract.address);
  await votingContract.addProposal('Hippo', addresses, weights);
  let voted = await votingContract.vote(1);
  // log_outputs(await voted.wait());
  const votingContract2 = new ethers.Contract(
    votingContract.address,
    voting_abi,
    addr1
  );
  let voted2 = await votingContract2.vote(1);
  // log_outputs(await voted2.wait());
  let gasPrice = BigNumber.from(10).pow(4);
  let gasLimit = BigNumber.from(10).pow(6);
  let executeProposal = await votingContract.executeProposal({
    gasPrice,
    gasLimit
  });
  let finalResult = await executeProposal.wait();
  log_outputs(finalResult);
}

async function buy_token(owner) {
  const dai = new ethers.Contract(DAI.tokenAddress, erc20_abi, owner);
  const deadline = Math.floor(Number(new Date()) / 1000) + 300;
  const router = new ethers.Contract(UNISWAP_ROUTER_ADDRESS, router_abi, owner);
  let gasPrice = BigNumber.from(10).pow(3);
  let gasLimit = BigNumber.from(10).pow(6);
  let value = BigNumber.from(10).pow(18);
  let result = await router.swapExactETHForTokens(
    0,
    [WETH.tokenAddress, DAI.tokenAddress],
    owner.address,
    deadline,
    { value, gasPrice, gasLimit }
  );
  let daibalance = await dai.balanceOf(owner.address);
  return daibalance;
}

async function main() {
  let dai_balance;
  let wbtc_balance;
  let link_balance;
  let api3_balance;
  let ownerBalance;
  let otherBalance;
  const [owner, other, addr1, addr2, addr3] = await ethers.getSigners();
  // return console.log('owner', owner);
  const accounts = await ethers.provider.listAccounts();
  // console.log(accounts);
  const walletAddress = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8';
  const tokenAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
  const testAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';
  const dai = new ethers.Contract(DAI.tokenAddress, erc20_abi, owner);
  const wbtc = new ethers.Contract(WBTC.tokenAddress, erc20_abi, owner);
  const link = new ethers.Contract(LINK.tokenAddress, erc20_abi, owner);
  const api3 = new ethers.Contract(API3.tokenAddress, erc20_abi, owner);

  let insufficientVal = BigNumber.from(10).pow(9);
  let value = BigNumber.from(10).pow(18);
  let gasPrice = BigNumber.from(10).pow(1);
  let gasLimit = BigNumber.from(10).pow(6);

  Token = await ethers.getContractFactory('BFIToken', owner);
  tinyToken = await ethers.getContractFactory('TinyToken');
  Voting = await ethers.getContractFactory('Voting');

  let { addresses, weights } = sortAddresses(
    [DAI.tokenAddress, WBTC.tokenAddress],
    ['500000', '500000']
  );
  console.log(Token.bytecode.length); //, Object.getOwnPropertyNames(BFIToken));
  const token = await Token.deploy(addresses, weights);
  const tiny = await tinyToken.deploy(token.address);
  token.setMigrator(tiny.address);
  const votingContract = await Voting.deploy(
    [owner.address, addr1.address],
    token.address
  );
  token.whitelistAddress(votingContract.address);

  // TESTS //
  // whitelist address
  expect(await token.hasRole(await token.MINTER_ROLE(), owner.address)).to.be
    .true;
  expect(await token.hasRole(await token.MINTER_ROLE(), other.address)).to.be
    .false;
  await token.whitelistAddress(other.address);
  expect(await token.hasRole(await token.MINTER_ROLE(), other.address)).to.be
    .true;
  // BLOCK DEPOSITS FROM OUTSIDE
  await expectRevert(
    token.deposit({ value: insufficientVal, gasPrice, gasLimit }),
    'VM Exception while processing transaction: revert Insufficient amount of ether sent'
  );
  const tokenContractOther = new ethers.Contract(
    token.address,
    token_abi,
    other
  );
  const tokenContract1 = new ethers.Contract(token.address, token_abi, addr1);
  await expectRevert(
    tokenContract1.deposit({
      value,
      gasPrice,
      gasLimit,
      from: addr1.address
    }),
    'VM Exception while processing transaction: revert Caller is not a minter'
  );
  let result = await token.deposit({ value, gasPrice, gasLimit });
  let data = await result.wait();
  dai_balance = await dai.balanceOf(token.address);
  wbtc_balance = await wbtc.balanceOf(token.address);
  expect(parseInt(dai_balance._hex, 16)).to.be.greaterThan(0);
  expect(parseInt(wbtc_balance._hex, 16)).to.be.greaterThan(0);
  // log_outputs(data);
  // assert token balance
  console.log('DAI Balance', parseInt(dai_balance._hex, 16));
  wbtc_balance = await wbtc.balanceOf(token.address);
  console.log('WBTC Balance', parseInt(wbtc_balance._hex, 16));
  link_balance = await link.balanceOf(token.address);
  console.log('Link Balance', parseInt(link_balance._hex, 16));
  api3_balance = await api3.balanceOf(token.address);
  console.log('Api3 Balance', parseInt(api3_balance._hex, 16));
  // Assert user balance
  // expect(token.balanceOf(owner.address)).to.be.equal(1);
  // expect((await token.ethDeposited()).toString()).to.be.equal(`${1e18}`);
  // withdraw
  console.log('WITHDRAW');
  ownerBalance = (await token.balanceOf(owner.address)).toString();
  console.log('ownerBalance', ownerBalance);
  result = await token.withdraw(ownerBalance);
  // expect((await token.ethDeposited()).toString()).to.be.equal(`${0}`);
  // assert user and token balance
  expect(await token.balanceOf(owner.address)).to.be.equal(0);
  dai_balance = await dai.balanceOf(token.address);
  wbtc_balance = await wbtc.balanceOf(token.address);
  console.log('dai_balance', dai_balance.toString());
  console.log('wbtc_balance', wbtc_balance.toString());
  // expect(parseInt(dai_balance._hex, 16)).to.be.closeTo(0, 2);
  // expect(parseInt(wbtc_balance._hex, 16)).to.be.closeTo(0, 2);
  // deposit -> withdraw raw
  console.log('WITHDRAW RAW');
  await token.deposit({ value, gasPrice, gasLimit });
  await token.withdrawRaw();
  // assert balances
  dai_balance = await dai.balanceOf(owner.address);
  wbtc_balance = await wbtc.balanceOf(owner.address);
  expect(parseInt(dai_balance._hex, 16)).to.be.greaterThan(0);
  expect(parseInt(wbtc_balance._hex, 16)).to.be.greaterThan(0);
  dai_balance = await dai.balanceOf(token.address);
  wbtc_balance = await wbtc.balanceOf(token.address);
  expect(parseInt(dai_balance._hex, 16)).to.be.equal(0);
  expect(parseInt(wbtc_balance._hex, 16)).to.be.equal(0);
  console.log('DEPOSIT ERC20');
  let tokenAmount = BigNumber.from(10).pow(19);
  dai_balance = (await dai.balanceOf(owner.address)).toString();
  console.log('owner dai_balance', dai_balance);
  await dai.approve(token.address, tokenAmount);
  await token.depositToken(tokenAmount, DAI.tokenAddress);
  dai_balance = await dai.balanceOf(owner.address);
  console.log('owner dai_balance', dai_balance.toString());
  dai_balance = await dai.balanceOf(token.address);
  expect(parseInt(dai_balance._hex, 16)).to.be.greaterThan(0);
  console.log('dai_balance', dai_balance.toString());
  console.log('MULTI DEPOSITS WITHDRAW RAW');
  // multi deposits and withdrawals
  await token.deposit({ value, gasPrice, gasLimit });
  await tokenContractOther.deposit({
    value,
    gasPrice,
    gasLimit
  });
  ownerBalance = await token.balanceOf(owner.address);
  otherBalance = await tokenContractOther.balanceOf(other.address);
  console.log('totalsupply', (await token.totalSupply()).toString());
  console.log('ownerBalance', ownerBalance.toString());
  console.log('otherBalance', otherBalance.toString());
  await token.withdrawRaw();
  dai_balance = await dai.balanceOf(token.address);
  wbtc_balance = await wbtc.balanceOf(token.address);
  expect(parseInt(dai_balance._hex, 16)).to.be.greaterThan(0);
  expect(parseInt(wbtc_balance._hex, 16)).to.be.greaterThan(0);
  console.log('MULTI DEPOSITS WITHDRAW');
  await token.deposit({ value, gasPrice, gasLimit });
  await tokenContractOther.deposit({
    value,
    gasPrice,
    gasLimit
  });
  ownerBalance = (await token.balanceOf(owner.address)).toString();
  otherBalance = await tokenContractOther.balanceOf(other.address);
  console.log('totalsupply', (await token.totalSupply()).toString());
  console.log('ownerBalance', ownerBalance);
  console.log('otherBalance', otherBalance.toString());
  result = await token.withdraw(ownerBalance);
  dai_balance = await dai.balanceOf(token.address);
  wbtc_balance = await wbtc.balanceOf(token.address);
  expect(parseInt(dai_balance._hex, 16)).to.be.greaterThan(0);
  expect(parseInt(wbtc_balance._hex, 16)).to.be.greaterThan(0);
  console.log('MIGRATE');
  // deposit -> migrate
  await token.deposit({ value, gasPrice, gasLimit });
  // TEST MIGRATION
  await vote_and_migrate(token, votingContract, owner, addr1);
  // console.log('Token Balance', await token.balanceOf(owner.address));
  dai_balance = await dai.balanceOf(token.address);
  console.log('DAI Balance', parseInt(dai_balance._hex, 16));
  wbtc_balance = await wbtc.balanceOf(token.address);
  console.log('WBTC Balance', parseInt(wbtc_balance._hex, 16));
  link_balance = await link.balanceOf(token.address);
  console.log('Link Balance', parseInt(link_balance._hex, 16));
  api3_balance = await api3.balanceOf(token.address);
  console.log('Api3 Balance', parseInt(api3_balance._hex, 16));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
