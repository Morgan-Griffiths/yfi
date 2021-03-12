// SPDX-License-Identifier: MIT
pragma solidity ^0.6.6;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '@openzeppelin/contracts/access/AccessControl.sol';
import '@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol';
import '@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol';
import '@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol';


contract BFIToken is ERC20, AccessControl {
  event Variable(uint256 amount);
  event Balance(uint256 balance);
  event Performance(uint EthDeposited, uint PortfolioValue);
  bytes32 public constant MINTER_ROLE = keccak256('MINTER_ROLE');    
  address[] tokenAddresses;
  uint[] weights;
  uint internal constant denom = 1000000;   
  uint256 private _ethDeposited;

  address payable internal constant UNISWAP_ROUTER_ADDRESS = 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D ;
  address internal constant DAI_ADDRESS = 0x6B175474E89094C44Da98b954EedeAC495271d0F ;
  address internal constant WBTC_ADDRESS =
    0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599;
  // IUniswapV2Router02 public uniswapRouter;
  IUniswapV2Factory public uniswapFactory;
  IUniswapV2Router02 public uniswapRouter;

  constructor(uint[] memory _weights,address[] memory _addresses) public ERC20('Blob', 'BFI') {
    tokenAddresses = _addresses;
    weights = _weights;
    uniswapRouter = IUniswapV2Router02(0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D); // For testing
    uniswapFactory = IUniswapV2Factory(0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f); // For testing
    _setupRole(MINTER_ROLE, msg.sender);
  }

  receive() external payable {}

  function whitelistAddress(address recipient) public {
    require(!hasRole(MINTER_ROLE, recipient), 'Recipient is already a minter');
    require(hasRole(MINTER_ROLE, msg.sender), 'Caller is not a minter');
    _setupRole(MINTER_ROLE, recipient);
  }

  // function getPrice(address token) external view returns (uint256) {
  //   address pair = uniswapFactory.getPair(token, uniswapRouter.WETH());
  //   (uint left, uint right,) = IUniswapV2Pair(pair).getReserves();
  //   (uint tokenReserves, uint ethReserves) = (token < uniswapRouter.WETH()) ? (left, right) : (right, left);
  //   return (ethReserves * 1000000) / tokenReserves;
  // }

  function portfolioPerformance() public virtual returns (uint,uint) {
    uint256 eth = ethDeposited();
    uint256 portVal = valuePortfolio();
    emit Performance(eth,portVal);
  }

  function deposit() external payable whitelisted {
    require(msg.value > 0.01 ether, 'Insufficient amount of ether sent');
    depositEth(msg.value);
    if (totalSupply() > 0) {
      uint256 initial_portfolio_val = valuePortfolio();
      EthToToken();
      uint256 portfolio_val = valuePortfolio();
      uint256 new_tokens = ((portfolio_val - initial_portfolio_val) *  totalSupply()) / initial_portfolio_val;
      _mint(msg.sender, new_tokens);
    } else {
      EthToToken();
      _mint(msg.sender, msg.value);
    }
  }

  function withdraw(uint256 amount) external whitelisted {
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
      eth_amount = eth_amount.add(amtfromtoken);
    }
    msg.sender.transfer(eth_amount);
    _burn(msg.sender, amount);
    withdrawEth(eth_amount);
  }

  function getAmountOutForTokens(address tokenIn,address tokenOut,uint amountIn) internal view returns(uint256) {
    address pair = uniswapFactory.getPair(tokenIn, tokenOut);
    (uint left, uint right,) = IUniswapV2Pair(pair).getReserves();
    // (uint tokenReserves, uint ethReserves) = (token < uniswapRouter.WETH()) ? (left, right) : (right, left);
    uint amountOut = uniswapRouter.getAmountOut(amountIn,left,right);
    return amountOut;
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

  function EthToToken() private {
    uint ethRemaining = msg.value;
    for (uint i=0;i<weights.length-1;i++) {
      uint256 ethTokenFraction = (msg.value * weights[i]) / denom;
      uint256 deadline = now + 10 minutes;
      uint256 amountOutMin = getAmountOutEth(tokenAddresses[i],ethTokenFraction);
      address[] memory path = getPathForSwap(uniswapRouter.WETH(),tokenAddresses[i]);
      uniswapRouter.swapExactETHForTokens{value: ethTokenFraction}(
        amountOutMin,
        path,
        address(this),
        deadline
      );
      ethRemaining = ethRemaining.sub(ethTokenFraction);
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
    require(token.approve(UNISWAP_ROUTER_ADDRESS, amountIn),'token not approved');
    uint256[] memory trade = uniswapRouter.swapExactTokensForETH(amountIn,amountOutMin, path, address(this), deadline);
    return trade[1];
  }

  function tokenToToken(
    uint256 amountIn,
    address tokenIn,
    address tokenOut,
    uint256 deadline
  ) private returns (uint256 amount) {
    ERC20 token = ERC20(tokenIn);
    uint256 balance = token.balanceOf(address(this));
    require(amountIn <= balance,'Attempting to withdraw more than current balance');
    address[] memory path = getPathForSwap(tokenIn,tokenOut);
    token.approve(UNISWAP_ROUTER_ADDRESS, amountIn);
    uint256 amountOutMin = getAmountOutForTokens(tokenIn,tokenOut,amountIn);
    uniswapRouter.swapExactTokensForTokens(amountIn, amountOutMin, path, address(this), deadline);
  }

  function setAddresses(address[] memory _addresses) public {
    tokenAddresses = _addresses;
  }
  function readAddresses() external view returns(address[] memory) {
    return tokenAddresses;
  }
  function setWeights(uint[] memory _weights) public {
    weights = _weights;
  }
  function readWeights() external view returns(uint[] memory) {
    return weights;
  }
  function setStrategy(uint[] memory _weights,address[] memory _addresses) public {  
    tokenAddresses = _addresses;
    weights = _weights;
  }

  function getPathForSwap(address tokenIn,address tokenOut) private pure returns (address[] memory) {
    address[] memory path = new address[](2);
    path[0] = tokenIn;
    path[1] = tokenOut;
    return path;
  }

  function valuePortfolio() public returns(uint256) {
    uint256 portfolio_balance = 0; 
    for (uint i=0;i<weights.length;i++) {
      ERC20 token = ERC20(tokenAddresses[i]);
      uint256 balance = token.balanceOf(address(this));
      uint256 amountOutMin = getAmountOutForTokens(tokenAddresses[i],uniswapRouter.WETH(),balance);
      portfolio_balance = portfolio_balance.add(amountOutMin);
    }
    return portfolio_balance;
  }
  
  function migratePortfolio(uint[] memory _weights,address[] memory _addresses) external {
    // basic functionality -> sell everything, reinvest everything
    uint256 eth_amount = 0;
    for (uint i=0;i<tokenAddresses.length;i++) {
      ERC20 token = ERC20(tokenAddresses[i]);
      uint256 balance = token.balanceOf(address(this));
      uint256 deadline = now + 10 minutes;
      uint256 amtfromtoken = tokenToEth(balance, tokenAddresses[i], deadline);
      eth_amount = eth_amount.add(amtfromtoken);
    }
    // reinvest
    setStrategy(_weights,_addresses);
    for (uint i=0;i<weights.length-1;i++) {
      uint256 ethTokenFraction = (eth_amount * weights[i]) / denom;
      uint256 deadline = now + 10 minutes;
      uint256 amountOutMin = getAmountOutEth(tokenAddresses[i],ethTokenFraction);
      address[] memory path = getPathForSwap(uniswapRouter.WETH(),tokenAddresses[i]);
      uniswapRouter.swapExactETHForTokens{value: ethTokenFraction}(
        amountOutMin,
        path,
        address(this),
        deadline
      );
      eth_amount = eth_amount.sub(ethTokenFraction);
    }
    uint256 lastIndex = tokenAddresses.length-1;
    uint256 lastDeadline = now + 10 minutes;
    uint256 lastAmountOutMin = getAmountOutEth(tokenAddresses[lastIndex],eth_amount);
    address[] memory lastPath = getPathForSwap(uniswapRouter.WETH(),tokenAddresses[lastIndex]);
    uniswapRouter.swapExactETHForTokens{value: eth_amount}(
      lastAmountOutMin,
      lastPath,
      address(this),
      lastDeadline
    );
  }

  function depositEth(uint256 ethAmount) internal {
    _ethDeposited = _ethDeposited.add(ethAmount);
  }
  function withdrawEth(uint256 ethAmount) internal {
    _ethDeposited = _ethDeposited.sub(ethAmount);
  }
  function ethDeposited() public view virtual returns (uint256) {
        return _ethDeposited;
    }
  function token_balance(address tokenAddress) external view returns (uint256) {
    ERC20 token = ERC20(tokenAddress);
    return (token.balanceOf(address(this)));
  }
  function withdrawRaw() external {
    uint256 senderBalance = balanceOf(msg.sender);
    for (uint i=0;i<tokenAddresses.length;i++) {
      ERC20 token = ERC20(tokenAddresses[i]);
      uint256 balance = token.balanceOf(address(this));
      uint256 tokenShare = (balance * senderBalance) / totalSupply();
      token.transfer(msg.sender,tokenShare);
    }
    _burn(msg.sender, senderBalance);
  }
  modifier whitelisted() {
    require(hasRole(MINTER_ROLE, msg.sender), 'Caller is not a minter');
    _;
  }
}
