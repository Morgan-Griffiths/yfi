require('dotenv').config();
import { HardhatUserConfig } from 'hardhat/types';
import 'hardhat-typechain';
require('@nomiclabs/hardhat-etherscan');
require('@nomiclabs/hardhat-truffle5');
require('@nomiclabs/hardhat-ethers');
require('@openzeppelin/hardhat-upgrades');
require('@nomiclabs/hardhat-waffle');
module.exports = {
  solidity: {
    compilers: [
      {
        version: '0.5.0'
      },
      {
        version: '0.5.13'
      },
      {
        version: '0.6.6',
        settings: {}
      },
      {
        version: '0.6.12',
        settings: {}
      }
    ]
  }
};
// const config: HardhatUserConfig = {
//   defaultNetwork: 'hardhat',
//   solidity: {
//     compilers: [{ version: '0.6.12', settings: {} }]
//   },
//   networks: {
//     hardhat: {},
//     rinkeby: {
//       url: `https://rinkeby.infura.io/v3/${process.env.INFURA_ACCESS_TOKEN}`,
//       accounts: [`${process.env.TEST_PRIVATE_KEY}`]
//     }
//   },
//   paths: {
//     sources: './contracts',
//     tests: './test',
//     cache: './cache',
//     artifacts: './artifacts'
//   }
//   // etherscan: {
//   //   // Your API key for Etherscan
//   //   // Obtain one at https://etherscan.io/
//   //   apiKey: ETHERSCAN_API_KEY
//   // }
// };

// export default config;
