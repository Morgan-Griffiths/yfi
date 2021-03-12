// scripts/index.js

const { getTypeParameterOwner } = require('typescript');
const { BigNumber } = require('ethers');
const erc20_abi = require('./erc20abi.json');

const DAI_ADDRESS = '0x6B175474E89094C44Da98b954EedeAC495271d0F';
const WBTC_ADDRESS = '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599';
const WETH_ADDRESS = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
const LINK_ADDRESS = '0x514910771AF9Ca656af840dff83E8264EcF986CA';
const API3_ADDRESS = '0x0b38210ea11411557c13457D4dA7dC6ea731B88a';

function log_outputs(data) {
  data.events.forEach((element) => {
    console.log(element.args);
    try {
      element.args.forEach((value) => {
        console.log(parseInt(value._hex, 16));
      });
    } catch {}
  });
}

async function main() {
  // Our code will go here
  // Retrieve accounts from the local node
  const [owner, addr1] = await ethers.getSigners();
  const accounts = await ethers.provider.listAccounts();
  // console.log(accounts);

  const walletAddress = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8';
  const tokenAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
  const testAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';
  const BFIToken = await ethers.getContractFactory('BFIToken', owner);
  const dai = new ethers.Contract(DAI_ADDRESS, erc20_abi, owner);
  const wbtc = new ethers.Contract(WBTC_ADDRESS, erc20_abi, owner);
  const link = new ethers.Contract(LINK_ADDRESS, erc20_abi, owner);
  const api3 = new ethers.Contract(API3_ADDRESS, erc20_abi, owner);
  // const Test = await ethers.getContractFactory('Test');
  // const token = await BFIToken.attach(tokenAddress);
  // const test = await Test.attach(testAddress);
  // const test = await Test.deploy();
  const token = await BFIToken.deploy(
    ['500000', '500000'],
    [DAI_ADDRESS, WBTC_ADDRESS]
  );

  // console.log(token.interface);
  // console.log(Object.getOwnPropertyNames(token));
  // const contract = new ethers.Contract(token.address, token.interface, owner);
  // result = await token.test_swap({
  //   value: `${1 * 1e18}`
  // });
  console.log(await token.readWeights());
  let value = BigNumber.from(10).pow(18);
  let gasPrice = BigNumber.from(10).pow(4);
  let gasLimit = BigNumber.from(10).pow(6);
  result = await token.deposit({ value, gasPrice, gasLimit });
  data = await result.wait();
  log_outputs(data);
  let tokenBalance = parseInt(await token.balanceOf(owner.address), 16);
  console.log('yfi balance', tokenBalance);
  console.log(`owner ETH: ${await owner.getBalance()}`);
  // TEST WITHDRAWAL
  // result = await token.withdraw(BigNumber.from(10).pow(18));
  // data = await result.wait();
  // log_outputs(data);
  // TEST RAW WITHDRAWAL
  // result = await token.withdrawRaw();
  // data = await result.wait();
  // log_outputs(data);
  // console.log('Token Balance', await token.balanceOf(owner.address));
  // dai_balance = await dai.balanceOf(owner.address);
  // console.log('Dai Balance', parseInt(dai_balance._hex, 16));
  // wbtc_balance = await wbtc.balanceOf(owner.address);
  // console.log('WBTC Balance', parseInt(wbtc_balance._hex, 16));
  // TEST MIGRATION
  token.migratePortfolio(['300000', '700000'], [LINK_ADDRESS, API3_ADDRESS]);
  console.log('Token Balance', await token.balanceOf(owner.address));
  dai_balance = await link.balanceOf(token.address);
  console.log('Link Balance', parseInt(dai_balance._hex, 16));
  wbtc_balance = await api3.balanceOf(token.address);
  console.log('Api3 Balance', parseInt(wbtc_balance._hex, 16));
  // TEST VALUE PORTFOLIO
  // result = await token.valuePortfolio();
  // result = await token.portfolioPerformance();
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
