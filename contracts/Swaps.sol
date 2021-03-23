
// SPDX-License-Identifier: MIT
pragma solidity ^0.6.6;
import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol';
import '@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol';
import '@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol';

contract UNISwaps is ERC20 {
  event Variable(uint256 amount);
  event Address(address tokenAddress);
  address[] tokenAddresses;
  uint[] weights;
  uint internal constant denom =
    10000000;
  address payable internal constant UNISWAP_ROUTER_ADDRESS = 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D ;
  address internal constant DAI_ADDRESS = 0x6B175474E89094C44Da98b954EedeAC495271d0F ;
  address internal constant WBTC_ADDRESS =
    0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599;
  IUniswapV2Factory public uniswapFactory;
  IUniswapV2Router02 public uniswapRouter;
  constructor(uint[] memory _weights,address[] memory _addresses) public ERC20('UNISwap', 'SWP')  {
    tokenAddresses = _addresses;
    weights = _weights;
    uniswapRouter = IUniswapV2Router02(0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D); // For testing
    uniswapFactory = IUniswapV2Factory(0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f); // For testing
  }

  receive() external payable {}
  function deposit() external payable {
    require(msg.value > 0.01 ether, 'Insufficient amount of ether sent');
    EthToTokens();
    _mint(msg.sender, msg.value);
    // if (totalSupply() > 0) {
    //   uint256 initial_portfolio_val = valuePortfolio();
    //   uint256 portfolio_val = valuePortfolio();
    //   uint256 new_tokens = ((portfolio_val - initial_portfolio_val) *  totalSupply()) / initial_portfolio_val;
    //   _mint(msg.sender, new_tokens);
    // } else {
    //   EthToTokens();
    //   // uint256 portfolio_val = valuePortfolio();
    // }
  }
  function EthToTokens() private {
    require(weights.length >= 2,'Requires at least 2 underlying tokens');
    uint ethRemaining = msg.value;
    for (uint i=0;i<weights.length-1;i++) {
      uint256 ethTokenFraction = (msg.value * weights[i]) / denom;
      uint256 deadline = now + 10 minutes;
      uint256 amountOutMin = getAmountOutEth(tokenAddresses[i],ethTokenFraction);
      address[] memory path = getPathForSwap(uniswapRouter.WETH(),tokenAddresses[i]);
      // emit Variable(ethTokenFraction);
      // emit Variable(amountOutMin);
      uniswapRouter.swapExactETHForTokens{value: ethTokenFraction}(
        amountOutMin,
        path,
        address(this),
        deadline
      );
      ethRemaining = ethRemaining.sub(ethTokenFraction);
      // ERC20 token = ERC20(tokenAddresses[i]);
      // uint256 balance = token.balanceOf(address(this));
      // emit Variable(balance);
    }
    uint256 lastIndex = tokenAddresses.length-1;
    uint256 lastDeadline = now + 10 minutes;
    uint256 lastAmountOutMin = getAmountOutEth(tokenAddresses[lastIndex],ethRemaining);
    address[] memory lastPath = getPathForSwap(uniswapRouter.WETH(),tokenAddresses[lastIndex]);
    uniswapRouter.swapExactETHForTokens{value: ethRemaining}(
      lastAmountOutMin,
      lastPath,
      address(this), 
      lastDeadline
    );
    // ERC20 token = ERC20(tokenAddresses[lastIndex]);
    // uint256 balance = token.balanceOf(address(this));
  }
  function tokenToEth(
    uint256 amountIn,
    address token_addr,
    uint256 deadline
  ) private returns (uint256 amount) {
    ERC20 token = ERC20(token_addr);
    uint256 balance = token.balanceOf(address(this));
    require(amountIn <= balance,'Attempting to withdraw more than current balance');
    address[] memory path = getPathForSwap(token_addr,uniswapRouter.WETH());
    uint256 amountOutMin = getAmountOut(token_addr,amountIn);
    token.approve(UNISWAP_ROUTER_ADDRESS, amountIn);
    uint256[] memory trade = uniswapRouter.swapExactTokensForETH(amountIn,amountOutMin, path, address(this), deadline);
    return trade[1];
  }

  function withdraw(uint256 amount) external {
    require(
      balanceOf(msg.sender) >= amount,
      'Amount to withdraw exceeds address balance'
    );
    // The amount relative to balance is the % of the total they are selling
    // Times the balance by the number of outstanding tokens, then divide by the incoming tokens
    uint256 eth_amount = 0;
    for (uint i=0;i<weights.length-1;i++) {
      ERC20 token = ERC20(tokenAddresses[i]);
      uint256 balance = token.balanceOf(address(this));
      uint256 tokenAmount = (totalSupply() * balance) / amount;
      uint256 deadline = now + 10 minutes;
      uint256 amtfromtoken = tokenToEth(tokenAmount, tokenAddresses[i], deadline);
      eth_amount += amtfromtoken;
    }
    // emit Variable(eth_amount);
    msg.sender.transfer(eth_amount);
    _burn(msg.sender, amount);
  }

  function getPathForSwap(address tokenIn,address tokenOut) private pure returns (address[] memory) {
    address[] memory path = new address[](2);
    path[0] = tokenIn;
    path[1] = tokenOut;
    return path;
  }

  function getAmountOut(address token,uint amountIn) internal view returns(uint256) {
    address pair = uniswapFactory.getPair(token, uniswapRouter.WETH());
    (uint left, uint right,) = IUniswapV2Pair(pair).getReserves();
    (uint tokenReserves, uint ethReserves) = (token < uniswapRouter.WETH()) ? (left, right) : (right, left);
    uint amountOut = uniswapRouter.getAmountOut(amountIn,tokenReserves,ethReserves);
    return amountOut;
  }
  function getAmountOutEth(address token,uint amountIn) internal view returns(uint256) {
    address pair = uniswapFactory.getPair(token, uniswapRouter.WETH());
    (uint left, uint right,) = IUniswapV2Pair(pair).getReserves();
    (uint tokenReserves, uint ethReserves) = (token < uniswapRouter.WETH()) ? (left, right) : (right, left);
    uint amountOut = uniswapRouter.getAmountOut(amountIn,ethReserves,tokenReserves);
    return amountOut;
  }

  function getAmountOutForTokens(address tokenIn,address tokenOut,uint amountIn) internal view returns(uint256) {
    address pair = uniswapFactory.getPair(tokenIn, tokenOut);
    (uint left, uint right,) = IUniswapV2Pair(pair).getReserves();
    // (uint tokenReserves, uint ethReserves) = (token < uniswapRouter.WETH()) ? (left, right) : (right, left);
    uint amountOut = uniswapRouter.getAmountOut(amountIn,left,right);
    return amountOut;
  }
  function valuePortfolio() public view returns(uint256) {
    uint256 portfolio_balance = 0; 
    for (uint i=0;i<weights.length;i++) {
      ERC20 token = ERC20(tokenAddresses[i]);
      uint256 balance = token.balanceOf(address(this));
      uint256 amountOutMin = getAmountOutForTokens(tokenAddresses[i],uniswapRouter.WETH(),balance);
      portfolio_balance += amountOutMin;
    }
  }
}