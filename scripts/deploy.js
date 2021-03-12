const { ethers } = require('hardhat');

const DAI_ADDRESS = '0x6B175474E89094C44Da98b954EedeAC495271d0F';
const WBTC_ADDRESS = '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599';
const WETH_ADDRESS = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';

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
  const walletAddress = '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266';
  const Token = await ethers.getContractFactory('GLDToken');
  // const Test = await ethers.getContractFactory('Swaps');
  console.log('Deploying Token...');
  const token = await Token.deploy();
  // const test = await Test.deploy();
  await token.deployed();
  // await test.deployed();
  console.log('Token deployed to:', token.address);
  // console.log('Test deployed to:', test.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
