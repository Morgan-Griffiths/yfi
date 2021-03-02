const { BigNumber } = require('ethers');
const { ethers } = require('hardhat');

const router_abi = [
  'function WETH() external pure returns (address)',
  'function getAmountOut(uint amountIn, uint reserveIn, uint reserveOut) internal pure returns (uint amountOut)',
  'function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)',
  'function swapExactTokensForTokensSupportingFeeOnTransferTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external',
  'function swapExactTokensForETHSupportingFeeOnTransferTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external',
  'function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)'
];
const pair_abi = [
  'function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)'
];
const uni_fact_abi = [
  'function getPair(address tokenA, address tokenB) external view returns (address pair)'
];
const erc20_abi = require('./erc20abi.json');
const weth_abi = [
  'function deposit() public payable',
  'function balanceOf(address acct) public view returns (uint)'
];

const DAI_ADDRESS = '0x6B175474E89094C44Da98b954EedeAC495271d0F';
const WBTC_ADDRESS = '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599';
const WETH_ADDRESS = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
const UNISWAP_FACT_ADDRESS = '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f';
const UNISWAP_ROUTER_ADDRESS = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';

// Exercise the contract to swap to dai and wbtc then swap back
async function useYong() {
  const [owner] = await ethers.getSigners();
  const dai = new ethers.Contract(DAI_ADDRESS, erc20_abi, owner);
  const wbtc = new ethers.Contract(WBTC_ADDRESS, erc20_abi, owner);

  const numer = BigNumber.from(155553);
  const denom = BigNumber.from(10).pow(18);
  const weiToCents = (x) => Number(x.mul(numer).div(denom).toString()) / 100;
  const centsToWei = (x) => denom.mul(x).div(numer);
  const YongFact = await ethers.getContractFactory('Yong');
  const Yong = await YongFact.deploy();

  const status = async (title) => {
    console.log(title);
    console.log(
      'holdings',
      (await Yong.holdings()).map((x) => x.toString())
    );
    console.log(
      `owner ETH: ${await owner.getBalance()} DAI: ${await dai.balanceOf(
        owner.address
      )} WBTC: ${await wbtc.balanceOf(owner.address)}`
    );
  };

  await status('initial');
  await Yong.deposit({ value: centsToWei(10000) });
  await status('deposit');
  await Yong.withdraw(centsToWei(5000));
  await status('withdraw');
}

// Use uniswap directly via ethers to swap to dai then back
async function swapDirect() {
  const deadline = Math.floor(Number(new Date()) / 1000) + 300;
  const router = new ethers.Contract(UNISWAP_ROUTER_ADDRESS, router_abi, owner);
  let result = await router.swapExactETHForTokens(
    0,
    [WETH_ADDRESS, DAI_ADDRESS],
    owner.address,
    deadline,
    { value: 100000000 }
  );

  let daibalance = await dai.balanceOf(owner.address);
  console.log(`DAI ${daibalance}`);
  result = await dai.approve(UNISWAP_ROUTER_ADDRESS, daibalance);
  console.log(
    'allowance',
    await dai.allowance(owner.address, UNISWAP_ROUTER_ADDRESS)
  );
  result = await router.swapExactTokensForETH(
    daibalance,
    0,
    [DAI_ADDRESS, WETH_ADDRESS],
    owner.address,
    deadline
  );
  console.log(result);
  console.log('-----------');
  console.log(await result.wait());
}

useYong()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
