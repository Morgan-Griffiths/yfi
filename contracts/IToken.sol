pragma solidity ^0.6.6;

interface IBFIToken {
  function migratePortfolio(uint[] memory,address[] memory) external;
}