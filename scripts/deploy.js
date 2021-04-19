const { ethers } = require('hardhat');
const TOKENS = require('../tokenAddress');
const { sortAddresses } = require('../utils');
const erc20_abi = require('../erc20abi.json');
const token_abi = require('../token_abi.json');
const voting_abi = require('../voting_abi.json');
const { whitelisted } = require('../globals.json');

const { Chris, Ryan, Alex, TJ } = whitelisted;

const ROPSTEN_PRIVATE_KEY = 'YOUR ROPSTEN PRIVATE KEY';
const Network = 'RINKEBY';
const DAI = TOKENS[Network]['DAI'];
const LINK = TOKENS[Network]['LINK'];
// scripts/deploy.js
async function main() {
  // Account #0: 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266 (10000 ETH)
  // Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
  // We get the contract to deploy
  // const Box = await ethers.getContractFactory("Box");
  // console.log("Deploying Box...");
  // const box = await Box.deploy();
  // await box.deployed();
  // console.log("Box deployed to:", box.address);
  const [deployer] = await ethers.getSigners();
  // const dai = new ethers.Contract(DAI.tokenAddress, erc20_abi, deployer);
  // console.log(`Deploying contracts with account ${deployer.address}`);
  // console.log(`Account balance ${(await deployer.getBalance()).toString()}`);
  // console.log(
  //   `DAI balance ${(await dai.balanceOf(deployer.address)).toString()}`
  // );

  let { addresses, weights } = sortAddresses(
    [DAI.tokenAddress, LINK.tokenAddress],
    ['500000', '500000']
  );
  // const Token = await ethers.getContractFactory('Swaps');
  // console.log('Deploying Swaps...');
  // const token = await Token.deploy(addresses, weights, tinyTokenRinkeby);
  // await token.deployed();
  // console.log('Swaps deployed to:', token.address);
  const Token = await ethers.getContractFactory('BFIToken');
  console.log('Deploying Token...');
  const token = await Token.deploy(addresses, weights);
  await token.deployed();
  console.log('Token deployed to:', token.address);
  console.log('Deploying Voting contract...');
  const tinyToken = await ethers.getContractFactory('TinyToken');
  const tiny = await tinyToken.deploy(token.address);
  await tiny.deployed();
  const Voting = await ethers.getContractFactory('Voting');
  const voting = await Voting.deploy(
    [deployer.address, Chris, Ryan, Alex, TJ],
    token.address
  );
  await voting.deployed();
  console.log('Voting deployed to:', voting.address);
  console.log('tiny deployed to:', tiny.address);
  // setMigrator for token
  await token.setMigrator(tiny.address);
  // add voting to whitelisted addresses for token
  await token.batchWhitelist([voting.address, Chris, Ryan, Alex, TJ]);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
