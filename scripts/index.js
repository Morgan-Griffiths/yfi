// scripts/index.js

async function main() {
  // Our code will go here
  // Retrieve accounts from the local node
  const [owner, addr1] = await ethers.getSigners();
  const accounts = await ethers.provider.listAccounts();
  console.log(accounts);

  const walletAddress = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8';
  const address = '0xa513E6E4b8f2a923D98304ec87F64353C4D5C853';
  const GLDToken = await ethers.getContractFactory('GLDToken');
  const token = await GLDToken.attach(address);
  value = await token.balanceOf(walletAddress);
  console.log('Balance is', value.toString());
  console.log(Object.getOwnPropertyNames(token.signer));
  console.log(Object.getOwnPropertyNames(owner.provider));
  // tx = {
  //   to: '0x8ba1f109551bD432803012645Ac136ddd64DBA72',
  //   value: utils.parseEther('1.0')
  // };
  // walletMnemonic.signTransaction(tx);
  // wallet.sendTransaction(tx);
  // value = await owner.send({ to: address, value: 1e18, from: owner });
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
