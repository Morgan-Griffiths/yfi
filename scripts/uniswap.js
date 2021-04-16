const { BigNumber } = require('ethers');
const { ethers } = require('hardhat');
const { sortAddresses } = require('../utils');

const UNISWAP_FACT_ADDRESS = '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f';
const UNISWAP_ROUTER_ADDRESS = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';
const TOKENS = require('../tokenAddress');
const erc20_abi = require('../erc20abi.json');

const router_abi = [
  'function WETH() external pure returns (address)',
  'function getAmountOut(uint amountIn, uint reserveIn, uint reserveOut) internal pure returns (uint amountOut)',
  'function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)',
  'function swapExactTokensForTokensSupportingFeeOnTransferTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external',
  'function swapExactTokensForETHSupportingFeeOnTransferTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external',
  'function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)'
];

const DAI = TOKENS.RINKEBY.DAI;
const LINK = TOKENS.RINKEBY.LINK;

// Use uniswap directly via ethers to swap to dai then back
async function swapDirect() {
  const [owner] = await ethers.getSigners();
  const dai = new ethers.Contract(DAI.tokenAddress, erc20_abi, owner);
  const link = new ethers.Contract(LINK.tokenAddress, erc20_abi, owner);
  const deadline = Math.floor(Number(new Date()) / 1000) + 300;
  const router = new ethers.Contract(UNISWAP_ROUTER_ADDRESS, router_abi, owner);
  const WETH_ADDRESS = await router.WETH();
  console.log(owner);
  // let result = await router.swapExactETHForTokens(
  //   0,
  //   [WETH_ADDRESS, DAI.tokenAddress],
  //   owner.address,
  //   deadline,
  //   { value: BigNumber.from(10).pow(17) }
  // );

  // let daibalance = await dai.balanceOf(owner.address);
  // console.log(`DAI ${daibalance}`);
  // result = await dai.approve(UNISWAP_ROUTER_ADDRESS, daibalance);
  // console.log(
  //   'allowance',
  //   await dai.allowance(owner.address, UNISWAP_ROUTER_ADDRESS)
  // );
  // let gasPrice = BigNumber.from(10).pow(9);
  // let gasLimit = BigNumber.from(10).pow(6);
  // result = await router.swapExactTokensForETH(
  //   daibalance,
  //   0,
  //   [DAI.tokenAddress, WETH_ADDRESS],
  //   owner.address,
  //   deadline,
  //   { gasPrice, gasLimit }
  // );
  // console.log(result);
  // console.log('-----------');
  // console.log(await result.wait());
}

swapDirect()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
