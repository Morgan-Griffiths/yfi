pragma solidity ^0.6.6;

interface ITinyToken {
  function migrate(address[] memory accumAddresses,address[] memory reductionAddresses,uint[] memory reductions,uint[] memory accumulations) external;
  function getMigration(address[] memory _tokenAddresses,address[] memory addresses_,uint[] memory weights_,uint portfolioValue,address destination) external;
  function getPathForSwap(address tokenIn,address tokenOut) external pure returns (address[] memory);
  function getAmountInForTokens(address tokenIn,address tokenOut,uint amount) external view returns(uint256);
  function getAmountOutForTokens(address tokenIn,address tokenOut,uint amountIn) external view returns(uint256);
  function getAmountOut(address tokenAddress,uint amountIn) external view returns(uint256);
  function getAmountOutEth(address tokenAddress,uint amountIn) external view returns(uint256);
}