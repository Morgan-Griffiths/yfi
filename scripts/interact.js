const { ethers } = require('hardhat');
const { BigNumber } = require('ethers');
const TOKENS = require('../tokenAddress');
const { sortAddresses } = require('../utils');
const erc20_abi = require('../erc20abi.json');
const token_abi = require('../token_abi.json');
const voting_abi = require('../voting_abi.json');
const swaps_abi = require('../swaps_abi.json');

SWAPS_RINKEBY = '0x6Ef973FC8de5a14585A0E9312Ab50B21fd0e4319';
TINY_RINKEBY = '0x144Bc7AE57F18259D570B95f14CfA690A3B0ce14';
VOTING_RINKEBY = '0x0F47d003c562aCE34B701D97e0405726C5D78c39';
CONTRACT_RINKEY = '0xAe1fBAeE8ac60Cc9cF38a709417d07115e334A86';
ACCOUNT_1 = '0x593729Bf6404Efb0C1056B8bEb639bdBc233114d';
ACCOUNT_2 = '0xdd912c81c13056b705A8d835207995203e9b966E';
const Network = 'RINKEBY';
const DAI = TOKENS[Network]['DAI'];
const LINK = TOKENS[Network]['LINK'];
let supply;
let balance;
let result;

async function test() {
  // TOKEN
  // Test depositing ETH
  // Test depositing DAI
  // Test withdrawing raw
  // Test withdrawing ETH
  // VOTING
  // send proposal
  // vote on proposal
  // execute proposal
  // confirm portfolio migration
  // reset proposal
}

async function main() {
  const [deployer] = await ethers.getSigners();
  // const Token = await ethers.getContractFactory('BFIToken');
  const swapsContract = new ethers.Contract(SWAPS_RINKEBY, swaps_abi, deployer);
  const tokenContract = new ethers.Contract(
    CONTRACT_RINKEY,
    token_abi,
    deployer
  );
  const dai = new ethers.Contract(DAI.tokenAddress, erc20_abi, deployer);
  let dai_balance = await dai.balanceOf(deployer.address);
  console.log(`Interacting with contracts with account ${deployer.address}`);
  console.log(`Account balance ${(await deployer.getBalance()).toString()}`);
  console.log(`DAI balance ${dai_balance.toString()}`);
  // console.log(Object.getOwnPropertyNames(tokenContract));
  // WHITELIST ADDRESSES
  // let result = await tokenContract.whitelistAddress(VOTING_RINKEBY);
  // console.log(await result.wait());
  // DEPOSIT ETH
  let value = BigNumber.from(10).pow(17);
  let gasPrice = BigNumber.from(10).pow(9);
  let gasLimit = BigNumber.from(10).pow(6);
  // // let result = await tokenContract.totalSupply();
  // balance = tokenContract.balanceOf(deployer.address);
  // await dai.approve(CONTRACT_RINKEY, dai_balance);
  // result = await tokenContract.depositToken(dai_balance, DAI.tokenAddress, {
  //   gasPrice,
  //   gasLimit
  // });
  // result = await tokenContract.setMigrator(TINY_RINKEBY);
  // console.log(await result.wait());
  // result = await tokenContract.deposit({ value, gasPrice, gasLimit });
  // let data = await result.wait();
  // console.log(data);
  // supply = tokenContract.totalSupply();
  // balance = tokenContract.balanceOf(deployer.address);
  // console.log('Deployer balance of token ', await balance);
  // console.log('Total supply ', await supply);
  // result = await tokenContract.withdraw(balance);
  // console.log(await result.wait());
  // supply = tokenContract.totalSupply();
  // balance = tokenContract.balanceOf(deployer.address);
  // console.log('Deployer balance of token ', await balance);
  // console.log('Total supply ', await supply);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
