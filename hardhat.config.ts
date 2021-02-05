/**
 * @type import('hardhat/config').HardhatUserConfig
 */
// const { etherscanApiKey, projectId, mnemonic } = require('./secrets.json');
require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-truffle5");
require('@nomiclabs/hardhat-ethers');
require('@openzeppelin/hardhat-upgrades');
require("@nomiclabs/hardhat-waffle");
module.exports = {
  solidity: "0.6.12",
};
// import { HardhatUserConfig } from "hardhat/types";
// const config: HardhatUserConfig = {};
// export default config;
// module.exports = {
//   networks: {
//     mainnet: { ... }
//   },
//   etherscan: {
//     apiKey: etherscanApiKey
//   }
// };