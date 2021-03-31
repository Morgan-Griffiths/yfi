// // SPDX-License-Identifier: MIT
// import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
// import '@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol';
// import '@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol';
// import '@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol';

// library TokenLibrary {
//   address payable internal constant UNISWAP_ROUTER_ADDRESS = 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;
//   address payable internal constant UNISWAP_FACTORY_ADDRESS = 0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f;
//   address payable internal constant WETH_ADDRESS = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;
//   uint internal constant _denom = 1000000;   
//   function getPrice(address token,IUniswapV2Factory factory) internal view returns (uint256) {
//     // returns price in WEI
//     address pair = factory.getPair(token, WETH_ADDRESS);
//     (uint left, uint right,) = IUniswapV2Pair(pair).getReserves();
//     (uint tokenReserves, uint ethReserves) = (token < WETH_ADDRESS) ? (left, right) : (right, left);
//     return (ethReserves * 1000000) / tokenReserves;
//   }
//   function getMigration(address[] memory _tokenAddresses,address[] memory addresses_,uint[] memory weights_,uint portfolioValue) external view returns (address[] memory,address[] memory,uint[] memory,uint[] memory){
//     IUniswapV2Factory uniswapFactory = IUniswapV2Factory(0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f);
//     uint256 newAmount;
//     uint i=0;
//     uint j=0;
//     uint256 balance;
//     address[] memory accumAddresses = new address[](addresses_.length);
//     address[] memory reductionAddresses = new address[](_tokenAddresses.length);
//     uint[] memory accumulations = new uint[](addresses_.length);
//     uint[] memory reductions = new uint[](_tokenAddresses.length);
//     while (j < addresses_.length || i < _tokenAddresses.length) {
//       if (i == _tokenAddresses.length || _tokenAddresses[i] < addresses_[j]) {
//         // increment j
//         newAmount = ((portfolioValue * weights_[j]) / _denom) / getPrice(addresses_[j],uniswapFactory);
//         accumAddresses[j] = addresses_[j];
//         accumulations[j] = newAmount;
//         j++;
//       } else if (j == addresses_.length || _tokenAddresses[i] > addresses_[j]) {
//         // increment i
//         ERC20 token = ERC20(_tokenAddresses[i]);
//         balance = token.balanceOf(address(this));
//         reductionAddresses[i] = _tokenAddresses[i];
//         reductions[i] = balance;
//         i++;
//       } else {
//         // equal
//         ERC20 token = ERC20(_tokenAddresses[i]);
//         balance = token.balanceOf(address(this));
//         newAmount = ((portfolioValue * weights_[j]) / _denom)/ getPrice(addresses_[j],uniswapFactory);
//         // same address. record difference
//         if (newAmount >= balance) {
//           // accum
//           accumAddresses[j] = addresses_[j];
//           accumulations[j] = newAmount - balance;
//         } else {
//           // reduction
//           reductionAddresses[j] = addresses_[j];
//           reductions[j] = balance - newAmount;
//         }
//         i++;
//         j++;
//       }
//     }
//     return (accumAddresses,reductionAddresses,reductions,accumulations);
//   }
// }
