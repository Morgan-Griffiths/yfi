pragma solidity ^0.6.6;

interface TokenLibrary {
  function getMigration(address[] memory _tokenAddresses,address[] memory addresses_,uint[] memory weights_,uint portfolioValue) external view returns (address[] memory,address[] memory,uint[] memory,uint[] memory);
}