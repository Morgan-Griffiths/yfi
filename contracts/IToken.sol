pragma solidity ^0.6.6;

interface IBFIToken {
  function migratePortfolio(address[] memory,uint[] memory) external;
  function simpleMigrate(address[] memory,uint[] memory) external;
  function exactTokensForTokens(
    uint256 amountIn,
    address tokenIn,
    address tokenOut,
    uint256 deadline
  ) external returns(uint);
  function tokensForExactTokens(
    uint256 amountOut,
    address tokenIn,
    address tokenOut,
    uint256 deadline
  ) external returns(uint);
}