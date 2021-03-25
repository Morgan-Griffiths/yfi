// scripts/index.js

import { sortAddresses } from '../utils';
const { BigNumber } = require('ethers');

const DAI_ADDRESS = '0x6B175474E89094C44Da98b954EedeAC495271d0F';
const WBTC_ADDRESS = '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599';
const WETH_ADDRESS = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';

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
  const stratContract = await ethers.getContractFactory('UNISwaps');
  // const Test = await ethers.getContractFactory('Test');
  // const token = await GLDToken.attach(tokenAddress);
  // const test = await Test.attach(testAddress);
  // const test = await Test.deploy();
  // ,
  const token = await stratContract.deploy(
    ['5000000', '5000000'],
    [(DAI_ADDRESS, WBTC_ADDRESS)]
  );
  let value = BigNumber.from(10).pow(18);
  let gasPrice = BigNumber.from(10).pow(2);
  let gasLimit = BigNumber.from(10).pow(6);
  result = await token.deposit({ value, gasPrice, gasLimit });
  data = await result.wait();
  log_outputs(data);
  console.log('Token Balance', await token.balanceOf(owner.address));
  // TEST WITHDRAW
  result = await token.withdraw(value);
  data = await result.wait();
  log_outputs(data);
  console.log('Token Balance', await token.balanceOf(owner.address));
  // await token.AddAddress(DAI_ADDRESS);
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
