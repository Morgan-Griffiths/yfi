const { ethers } = require('hardhat');
var fs = require('fs');

async function main() {
  const stratContract = await ethers.getContractFactory('Voting');
  const BFIToken = await ethers.getContractFactory('BFIToken');
  fs.writeFileSync(
    'voting_abi.json',
    stratContract.interface.format('json'),
    function (err) {
      if (err) {
        return console.error(err);
      }
    }
  );
  fs.writeFileSync(
    'token_abi.json',
    BFIToken.interface.format('json'),
    function (err) {
      if (err) {
        return console.error(err);
      }
    }
  );
}

main();
