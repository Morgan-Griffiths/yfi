pragma solidity ^0.6.6;

interface IBFIToken {
  function migratePortfolio(address[] memory,uint[] memory) external;
  function simpleMigrate(address[] memory,uint[] memory) external;
}