// scripts/index.js

const { getTypeParameterOwner } = require('typescript');
const { Web3 } = require('web3');
const axios = require('axios');
const Tx = require('ethereumjs-tx').Transaction;
const { ethers } = require('ethers');

CHAINID = 1;
CHAIN_DICT = {
  1: 'mainnet',
  4: 'rinkeby'
};
NETWORK = CHAIN_DICT[CHAINID];
TRANSACTION_URL =
  CHAINID != 1
    ? `https://${NETWORK}.etherscan.io/tx/`
    : `https://etherscan.io/tx/`;

async function callback(err, result) {
  if (err) return console.log(err);
  console.log(`sent ${TRANSACTION_URL}${result}`);
}

async function getCurrentGasPrices() {
  let response = await axios.get(
    'https://ethgasstation.info/json/ethgasAPI.json'
  );
  let prices = {
    low: response.data.safeLow / 10,
    medium: response.data.average / 10,
    high: response.data.fast / 10
  };
  console.log('\r\n');
  console.log(`Current ETH Gas Prices (in GWEI):`);
  console.log('\r\n');
  console.log(`Low: ${prices.low} (transaction completes in < 30 minutes)`);
  console.log(
    `Standard: ${prices.medium} (transaction completes in < 5 minutes)`
  );
  console.log(`Fast: ${prices.high} (transaction completes in < 2 minutes)`);
  console.log('\r\n');
  return prices;
}

function sendSigned(txData, private_key, cb) {
  const privateKey = Buffer.from(private_key, 'hex');
  const transaction = new Tx(txData, { chain: CHAINID });
  transaction.sign(privateKey);
  const serializedTx = transaction.serialize().toString('hex');
  web3.eth.sendSignedTransaction('0x' + serializedTx, cb);
}

async function sendMoney(amountToSend, fromAddress, toAddress, encodedABI) {
  let nonce = await web3.eth.getTransactionCount(fromAddress);
  console.log(
    `The outgoing transaction count for your wallet address is: ${nonce}`
  );
  let gasPrices = await getCurrentGasPrices();
  let txData = {
    to: toAddress,
    value: web3.utils.toHex(web3.utils.toWei(amountToSend, 'ether')),
    gas: 21000,
    gasPrice: web3.utils.toHex(web3.utils.toWei(`${gasPrices.medium}`, 'gwei')), // converts the gwei price to wei
    nonce: nonce,
    from: fromAddress,
    chainId: CHAINID,
    data: encodedABI
  };
  sendSigned(txData);
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
  const GLDToken = await ethers.getContractFactory('GLDToken', owner);
  // const Test = await ethers.getContractFactory('Test');
  // const token = await GLDToken.attach(tokenAddress);
  // const test = await Test.attach(testAddress);
  // const test = await Test.deploy();
  const token = await GLDToken.deploy();

  // console.log(token.interface);
  // console.log(Object.getOwnPropertyNames(token));
  ethers.Contract(token.address, token.interface, owner);
  const tx = routerContract.methods.test_swap();
  const encodedABI = tx.encodeABI();
  sendMoney('1.0', owner.address, token.address, encodedABI);
  // console.log(token.signer);
  // console.log(token);
  // tx = {
  //   to: token.address,
  //   value: ethers.utils.parseEther('0.0')
  // };
  // owner.signTransaction(tx);
  // value = await owner.send({
  //   to: tokenAddress,
  //   value: 1e18,
  //   from: owner
  // });
  // const transactionResponse = await token.test_swap({
  //   value: 1e18,
  //   from: owner
  // });
  // const result = await transactionResponse.wait();
  // console.log(result['events'][0], result['events'][0].args);
  // console.log(result.events[0].args); // result.events[0].decode());
  // const test = new ethers.Contract(testAddress, testAbi, owner);
  // token.sendTransaction({ value: 1e16, from: owner });
  // const result = await token.test();
  // console.log(result);
  // value = await token.balanceOf(walletAddress);
  // console.log('Balance is', value.toString());
  // console.log(Object.getOwnPropertyNames(token.signer));
  // console.log(Object.getOwnPropertyNames(owner.provider));
  // owner.sendTransaction(tx);
  // value = await accounts[0].send({
  //   to: tokenAddress,
  //   value: 1e18,
  //   from: owner
  // });
  // value = await token.balanceOf(walletAddress);
  // console.log('Balance is', value.toString());
  // await token.withdraw(walletAddress);
  // value = await token.balanceOf(walletAddress);
  // console.log('Balance is', value.toString());
  // await hardhatToken.transfer(addr1.address, 50);
  // await box.store(23);
  // const newValue = await box.retrieve();
  // console.log('Box value is',newValue.toString())

  // BOX CODE
  // const address = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
  // const Box = await ethers.getContractFactory("Box");
  // const box = await Box.attach(address);
  // value = await box.retrieve();
  // console.log("Box value is", value.toString());
  // await box.store(23);
  // const newValue = await box.retrieve();
  // console.log('Box value is',newValue.toString())
}
//   this.address = address
//   this.private_key = private_key
//   this.chainId = chainId
//   this.chain_dict = {
//       1:'mainnet',
//       4:'rinkeby'
//   }
//   this.network = this.chain_dict[this.chainId]
//   this.weth = WETH[chainId];
//   this.chain_name = this.chain_dict[chainId]
//   this.provider_url = `https://${this.chain_name}.infura.io/v3/${process.env.INFURA_ACCESS_TOKEN}`
//   this.transaction_url = (chainId != 1) ? `https://${this.chain_name}.etherscan.io/tx/` : `https://etherscan.io/tx/`s
//   web3 = new Web3(new Web3.providers.HttpProvider(this.provider_url))
//   web3.eth.defaultAccount = address

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
