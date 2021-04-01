
// SPDX-License-Identifier: MIT
pragma solidity ^0.6.6;
import './IToken.sol';
import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol';
import '@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol';
import '@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol';

contract TinyToken {
  event Balance(uint balance);
  event Variable(uint amount);
  IBFIToken token;
  address tokenAddress;
  uint internal constant _denom = 1000000;   
  address payable internal constant WETH_ADDRESS = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;
  IUniswapV2Router02 public uniswapRouter;
  IUniswapV2Factory public uniswapFactory;
  constructor(address BFIAddress) public {
    tokenAddress = BFIAddress;
    token = IBFIToken(BFIAddress);
    uniswapRouter = IUniswapV2Router02(0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D); // For testing
    uniswapFactory = IUniswapV2Factory(0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f); // For testing
  }
  function getPrice(address token,IUniswapV2Factory factory) internal view returns (uint256) {
    // returns price in WEI
    address pair = factory.getPair(token, WETH_ADDRESS);
    (uint left, uint right,) = IUniswapV2Pair(pair).getReserves();
    (uint tokenReserves, uint ethReserves) = (token < WETH_ADDRESS) ? (left, right) : (right, left);
    return (ethReserves * 1000000) / tokenReserves;
  }

  function getMigration(address[] memory _tokenAddresses,address[] memory addresses_,uint[] memory weights_,uint portfolioValue,address destination) external {
    require(msg.sender == tokenAddress,'Caller is not token');
    IUniswapV2Factory uniswapFactory = IUniswapV2Factory(0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f);
    uint256 newAmount;
    uint i=0;
    uint j=0;
    uint256 balance;
    address[] memory accumAddresses = new address[](addresses_.length);
    address[] memory reductionAddresses = new address[](_tokenAddresses.length);
    uint[] memory accumulations = new uint[](addresses_.length);
    uint[] memory reductions = new uint[](_tokenAddresses.length);
    while (j < addresses_.length || i < _tokenAddresses.length) {
      if (i == _tokenAddresses.length || _tokenAddresses[i] < addresses_[j]) {
        // increment j
        newAmount = ((portfolioValue * weights_[j]) / _denom) / getPrice(addresses_[j],uniswapFactory);
        accumAddresses[j] = addresses_[j];
        accumulations[j] = newAmount;
        j++;
      } else if (j == addresses_.length || _tokenAddresses[i] > addresses_[j]) {
        // increment i
        ERC20 token = ERC20(_tokenAddresses[i]);
        balance = token.balanceOf(destination);
        reductionAddresses[i] = _tokenAddresses[i];
        reductions[i] = balance;
        i++;
      } else {
        // equal
        ERC20 token = ERC20(_tokenAddresses[i]);
        balance = token.balanceOf(destination);
        newAmount = ((portfolioValue * weights_[j]) / _denom)/ getPrice(addresses_[j],uniswapFactory);
        // same address. record difference
        if (newAmount >= balance) {
          // accum
          accumAddresses[j] = addresses_[j];
          accumulations[j] = newAmount - balance;
        } else {
          // reduction
          reductionAddresses[j] = addresses_[j];
          reductions[j] = balance - newAmount;
        }
        i++;
        j++;
      }
    }
    migrate(accumAddresses,reductionAddresses,reductions,accumulations);
  }
  function migrate(address[] memory accumAddresses,address[] memory reductionAddresses,uint[] memory reductions,uint[] memory accumulations) internal {
    uint256 deadline = now + 10 minutes;
    uint i;
    for (i = 0; i < reductionAddresses.length;i++) {
      if (reductionAddresses[i] == address(0)) {
        break;
      }
      token.exactTokensForTokens(reductions[i], reductionAddresses[i], uniswapRouter.WETH(), deadline);
    }
    for (i = 0; i < accumAddresses.length;i++) {
      if (accumAddresses[i] == address(0)) {
        break;
      }
      token.tokensForExactTokens(accumulations[i], uniswapRouter.WETH(),accumAddresses[i], deadline);
    }
  }

  function getPathForSwap(address tokenIn,address tokenOut) external pure returns (address[] memory) {
    address[] memory path = new address[](2);
    path[0] = tokenIn;
    path[1] = tokenOut;
    return path;
  }

  function getAmountInForTokens(address tokenIn,address tokenOut,uint amount) external view returns(uint256) {
    address pair = uniswapFactory.getPair(tokenIn, tokenOut);
    (uint left, uint right,) = IUniswapV2Pair(pair).getReserves();
    // (uint tokenReserves, uint ethReserves) = (token < uniswapRouter.WETH()) ? (left, right) : (right, left);
    uint amountIn = uniswapRouter.getAmountIn(amount,left,right);
    return amountIn;
  }
  function getAmountOutForTokens(address tokenIn,address tokenOut,uint amountIn) external view returns(uint256) {
    address pair = uniswapFactory.getPair(tokenIn, tokenOut);
    (uint left, uint right,) = IUniswapV2Pair(pair).getReserves();
    (uint tokenReserves, uint ethReserves) = (tokenIn < tokenOut) ? (left, right) : (right, left);
    // uint amountOut = uniswapRouter.getAmountOut(amountIn,left,right);
    uint amountOut = uniswapRouter.getAmountOut(amountIn,tokenReserves,ethReserves);
    return amountOut;
  }
  function getAmountOut(address tokenAddress,uint amountIn) external view returns(uint256) {
    // Token to eth
    address pair = uniswapFactory.getPair(tokenAddress, uniswapRouter.WETH());
    (uint left, uint right,) = IUniswapV2Pair(pair).getReserves();
    (uint tokenReserves, uint ethReserves) = (tokenAddress < uniswapRouter.WETH()) ? (left, right) : (right, left);
    uint amountOut = uniswapRouter.getAmountOut(amountIn,tokenReserves,ethReserves);
    return amountOut;
  }
  function getAmountOutEth(address tokenAddress,uint amountIn) external view returns(uint256) {
    // Eth to token
    address pair = uniswapFactory.getPair(tokenAddress, uniswapRouter.WETH());
    (uint left, uint right,) = IUniswapV2Pair(pair).getReserves();
    (uint tokenReserves, uint ethReserves) = (tokenAddress < uniswapRouter.WETH()) ? (left, right) : (right, left);
    uint amountOut = uniswapRouter.getAmountOut(amountIn,ethReserves,tokenReserves);
    return amountOut;
  }
}