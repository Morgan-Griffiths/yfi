// SPDX-License-Identifier: MIT
pragma solidity ^0.6.6;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '@openzeppelin/contracts/access/AccessControl.sol';
import '@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol';
import '@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol';
import '@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol';
import './ILibrary.sol';
import './ITinyToken.sol';


contract BFIToken is ERC20, AccessControl {
  event Balance(uint balance);
  bytes32 public constant MINTER_ROLE = keccak256('MINTER_ROLE');  
  address[] _tokenAddresses;
  uint[] _weights;
  uint internal constant _denom = 1000000;   
  uint256 private _ethDeposited;

  address payable internal constant UNISWAP_ROUTER_ADDRESS = 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D ;
  IUniswapV2Factory public uniswapFactory;
  IUniswapV2Router02 public uniswapRouter;
  ITinyToken tinyToken;
  address migrator;

  // TokenLibrary public tokenlib;

  constructor(address[] memory addresses_,uint[] memory weights_) public ERC20('Blob', 'BFI') {
    setStrategy(addresses_,weights_);
    uniswapRouter = IUniswapV2Router02(0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D); // For testing
    uniswapFactory = IUniswapV2Factory(0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f); // For testing
    // tokenlib = TokenLibrary(libraryAddress);
    _setupRole(MINTER_ROLE, msg.sender);
  }

  modifier isMigrator() {
    require(msg.sender == migrator, 'Caller is not the migrator');
    _;
  }
  modifier whitelisted() {
    require(hasRole(MINTER_ROLE, msg.sender), 'Caller is not a minter');
    _;
  }
  receive() external payable {}
  function setMigrator(address migrator_) external whitelisted {
    require(migrator == address(0),'Migrator has already been set');
    migrator = migrator_;
    tinyToken = ITinyToken(migrator_);
  }

  function whitelistAddress(address recipient) public {
    require(!hasRole(MINTER_ROLE, recipient), 'Recipient is already a boss');
    require(hasRole(MINTER_ROLE, msg.sender), 'Caller is not a boss');
    _setupRole(MINTER_ROLE, recipient);
  }

  // function portfolioPerformance() public virtual returns (uint,uint) {
  //   uint256 eth = ethDeposited();
  //   uint256 portVal = valuePortfolio();
  //   return 
  // }

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
    uint newTokens = tinyToken.getAmountOut(tokenAddress,amount);
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
    for (uint i=0;i<_weights.length-1;i++) {
      ERC20 token = ERC20(_tokenAddresses[i]);
      uint256 balance = token.balanceOf(address(this));
      uint256 tokenAmount = (totalSupply() * balance) / amount;
      uint256 deadline = now + 10 minutes;
      uint256 amtfromtoken = tokenToEth(tokenAmount, _tokenAddresses[i], deadline);
      eth_amount = eth_amount.add(amtfromtoken);
    }
    msg.sender.transfer(eth_amount);
    _burn(msg.sender, amount);
    withdrawEth(eth_amount);
  }

  function EthToToken() private {
    uint ethRemaining = msg.value;
    for (uint i=0;i<_weights.length-1;i++) {
      uint256 ethTokenFraction = (msg.value * _weights[i]) / _denom;
      uint256 deadline = now + 10 minutes;
      uint256 amountOutMin = tinyToken.getAmountOutEth(_tokenAddresses[i],ethTokenFraction);
      address[] memory path = tinyToken.getPathForSwap(uniswapRouter.WETH(),_tokenAddresses[i]);
      uniswapRouter.swapExactETHForTokens{value: ethTokenFraction}(
        amountOutMin,
        path,
        address(this),
        deadline
      );
      ethRemaining = ethRemaining.sub(ethTokenFraction);
    }
    uint256 lastIndex = _tokenAddresses.length-1;
    uint256 lastDeadline = now + 10 minutes;
    uint256 lastAmountOutMin = tinyToken.getAmountOutEth(_tokenAddresses[lastIndex],ethRemaining);
    address[] memory lastPath = tinyToken.getPathForSwap(uniswapRouter.WETH(),_tokenAddresses[lastIndex]);
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
    require(amountIn <= balance,'tokenToEth amount in is less than balance');
    address[] memory path = tinyToken.getPathForSwap(token_addr,uniswapRouter.WETH());
    uint256 amountOutMin = tinyToken.getAmountOut(token_addr,amountIn);
    require(token.approve(UNISWAP_ROUTER_ADDRESS, amountIn),'token not approved');
    uint256[] memory trade = uniswapRouter.swapExactTokensForETH(amountIn,amountOutMin, path, address(this), deadline);
    return trade[1];
  }

  function exactTokensForTokens(
    uint256 amountIn,
    address tokenIn,
    address tokenOut,
    uint256 deadline
  ) external isMigrator returns(uint) {
    ERC20 token = ERC20(tokenIn);
    uint256 balance = token.balanceOf(address(this));
    require(amountIn <= balance,'exactTokensForTokens amount in is less than balance');
    address[] memory path = new address[](2);
    path[0] = tokenIn;
    path[1] = tokenOut;
    uint256 amountOutMin = tinyToken.getAmountOutForTokens(tokenIn, tokenOut, amountIn);
    token.approve(UNISWAP_ROUTER_ADDRESS, amountIn);
    uint256[] memory trade = uniswapRouter.swapExactTokensForTokens(amountIn, amountOutMin, path, address(this), deadline);
    return trade[1];
  }
  function tokensForExactTokens(
    uint256 amountOut,
    address tokenIn,
    address tokenOut,
    uint256 deadline
  ) external isMigrator returns(uint) {
    ERC20 token = ERC20(tokenIn);
    address[] memory path = new address[](2);
    path[0] = tokenIn;
    path[1] = tokenOut;
    uint256 amountInMax = tinyToken.getAmountInForTokens(tokenIn,tokenOut,amountOut);
    token.approve(UNISWAP_ROUTER_ADDRESS, amountInMax);
    uint256[] memory trade = uniswapRouter.swapTokensForExactTokens(amountOut,amountInMax, path, address(this), deadline);
    return trade[1];
  }

  // function setAddresses(address[] memory addresses_) public {
  //   _tokenAddresses = addresses_;
  // }
  // function readAddresses() external view returns(address[] memory) {
  //   return _tokenAddresses;
  // }
  // function setWeights(uint[] memory weights_) public {
  //   _weights = weights_;
  // }
  // function readWeights() external view returns(uint[] memory) {
  //   return _weights;
  // }
  function setStrategy(address[] memory addresses_,uint[] memory weights_) internal {  
    _tokenAddresses = addresses_;
    _weights = weights_;
  }

  function valuePortfolio() public view returns(uint256) {
    uint256 portfolio_balance = 0; 
    for (uint i=0;i<_weights.length;i++) {
      ERC20 token = ERC20(_tokenAddresses[i]);
      uint256 balance = token.balanceOf(address(this));
      uint256 amountOutMin = tinyToken.getAmountOutForTokens(_tokenAddresses[i],uniswapRouter.WETH(),balance);
      portfolio_balance = portfolio_balance.add(amountOutMin);
    }
    return portfolio_balance;
  }

  function simpleMigrate(address[] memory addresses_,uint[] memory weights_) external whitelisted {
    uint portfolioValue = valuePortfolio();
    uint balance;
    // approve for withdrawals
    for (uint i; i < _tokenAddresses.length;i++) {
      ERC20 token = ERC20(_tokenAddresses[i]);
      balance = token.balanceOf(address(this));
      token.approve(migrator,balance);
    }
    tinyToken.getMigration(_tokenAddresses,addresses_,weights_,portfolioValue,address(this));
    setStrategy(addresses_, weights_);
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
  function withdrawRaw() external whitelisted {
    uint256 senderBalance = balanceOf(msg.sender);
    for (uint i=0;i<_tokenAddresses.length;i++) {
      ERC20 token = ERC20(_tokenAddresses[i]);
      uint256 balance = token.balanceOf(address(this));
      uint256 tokenShare = (balance * senderBalance) / totalSupply();
      token.transfer(msg.sender,tokenShare);
    }
    _burn(msg.sender, senderBalance);
  }
}
