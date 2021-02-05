const { ethers } = require("hardhat");

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
    const walletAddress = '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266'
    const Token = await ethers.getContractFactory("GLDToken");
    console.log("Deploying Token...")
    const token = await Token.deploy();
    await token.deployed();
    console.log("Token deployed to:", token.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });