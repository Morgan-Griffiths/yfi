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
  mapping(address => uint8) portfolioTokens;
  mapping(address => uint256) oldAmounts;
  mapping(address => uint256) newAmounts;
  mapping(address => uint256) reductions;
  mapping(address => uint256) accumulations;
  mapping(address => uint) priceMapping;

  address payable internal constant UNISWAP_ROUTER_ADDRESS = 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D ;
  IUniswapV2Factory public uniswapFactory;
  IUniswapV2Router02 public uniswapRouter;

  constructor(uint[] memory _weights,address[] memory _addresses) public ERC20('Blob', 'BFI') {
    setStrategy(_weights, _addresses);
    for (uint i;i < _addresses.length; i++) {
      portfolioTokens[_addresses[i]] = 1;
    }
    uniswapRouter = IUniswapV2Router02(0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D); // For testing
    uniswapFactory = IUniswapV2Factory(0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f); // For testing
    _setupRole(MINTER_ROLE, msg.sender);
  }

  receive() external payable {}

  function whitelistAddress(address recipient) public {
    require(!hasRole(MINTER_ROLE, recipient), 'Recipient is already a boss');
    require(hasRole(MINTER_ROLE, msg.sender), 'Caller is not a boss');
    _setupRole(MINTER_ROLE, recipient);
  }

  function getPrice(address token) internal view returns (uint256) {
    address pair = uniswapFactory.getPair(token, uniswapRouter.WETH());
    (uint left, uint right,) = IUniswapV2Pair(pair).getReserves();
    (uint tokenReserves, uint ethReserves) = (token < uniswapRouter.WETH()) ? (left, right) : (right, left);
    return (ethReserves * 1000000) / tokenReserves;
  }

  function portfolioPerformance() public virtual returns (uint,uint) {
    uint256 eth = ethDeposited();
    uint256 portVal = valuePortfolio();
    emit Performance(eth,portVal);
  }

  function depositToken(uint amount,address tokenAddress) external whitelisted {
    require(amount > 0, "Must xfer none zero amount of tokens");
    ERC20 token = ERC20(tokenAddress);
    uint userBalance = token.balanceOf(msg.sender);
    require(userBalance >= amount,'Insufficient user balance');
    uint256 allowance = token.allowance(msg.sender, address(this));
    require(allowance >= amount, "Check the token allowance");
    token.transferFrom(msg.sender, address(this), amount);
    msg.sender.transfer(amount);
    // value incoming token amount -> send tokens in response.
    uint newTokens = getAmountOut(tokenAddress,amount);
    _mint(msg.sender, newTokens);
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

  function getAmountInForTokens(address tokenIn,address tokenOut,uint amount) internal view returns(uint256) {
    address pair = uniswapFactory.getPair(tokenIn, tokenOut);
    (uint left, uint right,) = IUniswapV2Pair(pair).getReserves();
    // (uint tokenReserves, uint ethReserves) = (token < uniswapRouter.WETH()) ? (left, right) : (right, left);
    uint amountIn = uniswapRouter.getAmountIn(amount,left,right);
    return amountIn;
  }
  function getAmountOutForTokens(address tokenIn,address tokenOut,uint amountIn) internal view returns(uint256) {
    address pair = uniswapFactory.getPair(tokenIn, tokenOut);
    (uint left, uint right,) = IUniswapV2Pair(pair).getReserves();
    // (uint tokenReserves, uint ethReserves) = (token < uniswapRouter.WETH()) ? (left, right) : (right, left);
    uint amountOut = uniswapRouter.getAmountOut(amountIn,left,right);
    return amountOut;
  }
  function getAmountOut(address tokenAddress,uint amountIn) internal view returns(uint256) {
    address pair = uniswapFactory.getPair(tokenAddress, uniswapRouter.WETH());
    (uint left, uint right,) = IUniswapV2Pair(pair).getReserves();
    (uint tokenReserves, uint ethReserves) = (tokenAddress < uniswapRouter.WETH()) ? (left, right) : (right, left);
    uint amountOut = uniswapRouter.getAmountOut(amountIn,tokenReserves,ethReserves);
    return amountOut;
  }
  function getAmountOutEth(address tokenAddress,uint amountIn) internal view returns(uint256) {
    address pair = uniswapFactory.getPair(tokenAddress, uniswapRouter.WETH());
    (uint left, uint right,) = IUniswapV2Pair(pair).getReserves();
    (uint tokenReserves, uint ethReserves) = (tokenAddress < uniswapRouter.WETH()) ? (left, right) : (right, left);
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

  function exactTokensForTokens(
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

  function tokensForExactTokens(
    uint256 amountOut,
    address tokenIn,
    address tokenOut,
    uint256 deadline
  ) private returns (uint256 amount) {
    ERC20 token = ERC20(tokenIn);
    address[] memory path = getPathForSwap(tokenIn,tokenOut);
    uint256 amountInMax = getAmountInForTokens(tokenIn,tokenOut,amountOut);
    token.approve(UNISWAP_ROUTER_ADDRESS, amountInMax);
    uniswapRouter.swapTokensForExactTokens(amountOut,amountInMax, path, address(this), deadline);
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
  function setStrategy(uint[] memory _weights,address[] memory _addresses) internal {  
    tokenAddresses = _addresses;
    weights = _weights;
  }

  function getPathForSwap(address tokenIn,address tokenOut) private pure returns (address[] memory) {
    address[] memory path = new address[](2);
    path[0] = tokenIn;
    path[1] = tokenOut;
    return path;
  }

  function valuePortfolio() public view returns(uint256) {
    uint256 portfolio_balance = 0; 
    for (uint i=0;i<weights.length;i++) {
      ERC20 token = ERC20(tokenAddresses[i]);
      uint256 balance = token.balanceOf(address(this));
      uint256 amountOutMin = getAmountOutForTokens(tokenAddresses[i],uniswapRouter.WETH(),balance);
      portfolio_balance = portfolio_balance.add(amountOutMin);
    }
    return portfolio_balance;
  }

  function getMigrationVariables(uint[] memory _weights,address[] memory _addresses) internal returns(uint,address[] storage,address[] storage) {
    uint portfolioValue = valuePortfolio();
    uint256 price;
    address addr;
    for (uint i; i < tokenAddresses.length;i++) {
      ERC20 token = ERC20(tokenAddresses[i]);
      uint256 balance = token.balanceOf(address(this));
      price = getPrice(tokenAddresses[i]);
      priceMapping[tokenAddresses[i]] = price;
      oldAmounts[tokenAddresses[i]] = price * balance;
    }
    for (uint i; i < _addresses.length;i++) {
      ERC20 token = ERC20(_addresses[i]);
      uint tokenWeight = _weights[i];
      price = getPrice(_addresses[i]);
      priceMapping[_addresses[i]] = price;
      newAmounts[_addresses[i]] = ((portfolioValue * tokenWeight) / denom)/ price;
    }
    address[] memory reductionAddrs;
    address[] memory accumulationAddrs;
    for (uint i; i < tokenAddresses.length;i++) {
      addr = tokenAddresses[i];
      if (oldAmounts[addr] > newAmounts[addr]) {
        reductions[addr] = oldAmounts[addr]-newAmounts[addr];
        reductionAddrs.push(addr);
      }
    }
    for (uint i; i < _addresses.length;i++) {
      addr = _addresses[i];
      if (reductions[addr] != 0) {
        accumulations[addr] = _weights[i];
        accumulationAddrs.push(addr);
      }
    }
    return (portfolioValue,reductionAddrs,accumulationAddrs);
  }

  function smartMigrate(uint[] memory _weights,address[] memory _addresses) external whitelisted {
    uint portfolioValue;
    address[] memory reductionAddresses;
    address[] memory accumulationAddresses;
    (portfolioValue,reductionAddresses,accumulationAddresses) = getMigrationVariables(_weights,_addresses);
    // move the underlying
    uint eth;
    uint balanceIn;
    uint balanceOut;
    uint buyAmount;
    uint sellAmount;
    uint buy_index = 0;
    uint sell_index = 0;
    uint buy_amount_needed;
    uint sell_amount_needed;
    address sell_addr;
    address buy_addr;
    while (true) {
      sell_addr = reductionAddresses[sell_index];
      sellAmount = reductions[sell_addr];
      buy_addr = accumulationAddresses[buy_index];
      buyAmount = accumulations[buy_addr];
      ERC20 tokenIn = ERC20(sell_addr);
      ERC20 tokenOut = ERC20(buy_addr);
      balanceIn = tokenIn.balanceOf(address(this));
      uint256 deadline = now + 10 minutes;
      // see how much of token A will fund token B's purchase
      buy_amount_needed = buyAmount*priceMapping[buy_addr];
      sell_amount_needed = buy_amount_needed / priceMapping[sell_addr];
      if ((buy_index != accumulationAddresses.length-1) && (sell_index != reductionAddresses.length-1)) {
          if (sell_amount_needed > sellAmount) {
              // sell all and increment sells
              exactTokensForTokens(balanceIn, sell_addr, buy_addr, deadline);
              balanceOut = tokenOut.balanceOf(address(this));
              reductions[sell_addr] = 0;
              accumulations[buy_addr] -= balanceOut;
              sell_index += 1;
          } else if (sell_amount_needed < sellAmount) {
              // sell partial and increment buys
              tokensForExactTokens(sell_amount_needed, sell_addr, buy_addr, deadline);
              (sell_addr,buy_addr,balanceIn);
              accumulations[buy_addr] = 0;
              buy_index += 1;
          } else {
              // sell all and increment both
              exactTokensForTokens(balanceIn, sell_addr, buy_addr, deadline);
              accumulations[buy_addr] = 0;
              reductions[sell_addr] = 0;
              buy_index += 1;
              sell_index += 1;
          }
      } else {
          // Special case for last entry. sell everything and buy whatever remains.
          exactTokensForTokens(balanceIn, sell_addr, buy_addr, deadline);
          accumulations[buy_addr] = 0;
          reductions[sell_addr] = 0;
          break;
      }
    }
  }
  
  function migratePortfolio(uint[] memory _weights,address[] memory _addresses) external whitelisted {
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

  function pathCheck(address tokenFrom,uint amount,address tokenTo) external {
    // check direct and then check via weth
    uint firstAmount = getAmountOutForTokens(tokenFrom,tokenTo,amount);
    address[] memory path = new address[](3);
    path[0] = tokenFrom;
    path[1] = uniswapRouter.WETH();
    path[2] = tokenTo;
    // uint256[] memory secondAmount = uniswapRouter.getAmountsOut(amount,path);
    emit Variable(firstAmount);
    // emit Variable(secondAmount[secondAmount.length]);
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
