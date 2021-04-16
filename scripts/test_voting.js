// scripts/index.js

const { BigNumber } = require('ethers');
const { ConsoleLogger } = require('ts-generator/dist/logger');
const erc20_abi = require('../erc20abi.json');
const token_abi = require('../token_abi.json');
const voting_abi = require('../voting_abi.json');
var fs = require('fs');
const { sortAddresses } = require('../utils');

const DAI_ADDRESS = '0x6B175474E89094C44Da98b954EedeAC495271d0F';
const WBTC_ADDRESS = '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599';
const WETH_ADDRESS = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
const LINK_ADDRESS = '0x514910771AF9Ca656af840dff83E8264EcF986CA';
const API3_ADDRESS = '0x0b38210ea11411557c13457D4dA7dC6ea731B88a';
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
    [LINK_ADDRESS, API3_ADDRESS],
    ['300000', '700000']
  );
  await token.whitelistAddress(votingContract.address);
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
  const dai = new ethers.Contract(DAI_ADDRESS, erc20_abi, owner);
  const deadline = Math.floor(Number(new Date()) / 1000) + 300;
  const router = new ethers.Contract(UNISWAP_ROUTER_ADDRESS, router_abi, owner);
  let gasPrice = BigNumber.from(10).pow(3);
  let gasLimit = BigNumber.from(10).pow(6);
  let value = BigNumber.from(10).pow(18);
  let result = await router.swapExactETHForTokens(
    0,
    [WETH_ADDRESS, DAI_ADDRESS],
    owner.address,
    deadline,
    { value, gasPrice, gasLimit }
  );
  let daibalance = await dai.balanceOf(owner.address);
  return daibalance;
}

async function main() {
  // Our code will go here
  // Retrieve accounts from the local node
  const [owner, addr1, addr2] = await ethers.getSigners();
  // return console.log('owner', owner);
  const accounts = await ethers.provider.listAccounts();
  // console.log(accounts);
  const walletAddress = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8';
  const tokenAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
  const testAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';
  const dai = new ethers.Contract(DAI_ADDRESS, erc20_abi, owner);
  const wbtc = new ethers.Contract(WBTC_ADDRESS, erc20_abi, owner);
  const link = new ethers.Contract(LINK_ADDRESS, erc20_abi, owner);
  const api3 = new ethers.Contract(API3_ADDRESS, erc20_abi, owner);

  const stratContract = await ethers.getContractFactory('Voting');
  const BFIToken = await ethers.getContractFactory('BFIToken', owner);
  const tinyToken = await ethers.getContractFactory('TinyToken');

  let { addresses, weights } = sortAddresses(
    [DAI_ADDRESS, WBTC_ADDRESS],
    ['500000', '500000']
  );
  console.log(BFIToken.bytecode.length); //, Object.getOwnPropertyNames(BFIToken));
  const token = await BFIToken.deploy(addresses, weights);
  const tiny = await tinyToken.deploy(token.address);
  token.setMigrator(tiny.address);
  const votingContract = await stratContract.deploy(
    [owner.address, addr1.address],
    token.address
  );
  let value = BigNumber.from(10).pow(18);
  let gasPrice = BigNumber.from(10).pow(1);
  let gasLimit = BigNumber.from(10).pow(6);
  let result = await token.deposit({ value, gasPrice, gasLimit });
  let data = await result.wait();
  // log_outputs(data);
  dai_balance = await dai.balanceOf(token.address);
  console.log('DAI Balance', parseInt(dai_balance._hex, 16));
  wbtc_balance = await wbtc.balanceOf(token.address);
  console.log('WBTC Balance', parseInt(wbtc_balance._hex, 16));
  link_balance = await link.balanceOf(token.address);
  console.log('Link Balance', parseInt(link_balance._hex, 16));
  api3_balance = await api3.balanceOf(token.address);
  console.log('Api3 Balance', parseInt(api3_balance._hex, 16));
  // pathResult = await token.pathCheck(DAI_ADDRESS, dai_balance, API3_ADDRESS);
  // log_outputs('pathResult', pathResult);
  // TEST TOKEN DIRECT DEPOSIT
  // let amount = await buy_token(owner);
  // console.log('amount', amount.toString());
  // result = await dai.approve(token.address, amount);
  // console.log('allowance', await dai.allowance(owner.address, token.address));
  // await token.depositToken(amount, DAI_ADDRESS);
  // console.log(await token.balanceOf(owner.address));

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
  // await votingContract.AddAddress(DAI_ADDRESS);
  // await token.AddAddress(WBTC_ADDRESS);
  // console.log(await result.wait());
  // console.log(addresses2);
  // const addresses = await token.readAddresses(1);
  // console.log(addresses);
  // console.log(token.interface);
  // console.log(Object.getOwnPropertyNames(token));
  // const contract = new ethers.Contract(token.address, token.interface, owner);
  // result = await token.test_swap({
  //   value: `${1 * 1e18}`
  // });
  // console.log(DAI_ADDRESS);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
