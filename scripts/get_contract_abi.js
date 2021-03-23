import ethers from 'ethers';
var fs = require('fs');

const stratContract = await ethers.getContractFactory('Voting');
const BFIToken = await ethers.getContractFactory('BFIToken');
const contract = new ethers.Contract(token.address, token.interface, owner);
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
