// SPDX-License-Identifier: MIT
pragma solidity ^0.6.6;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '@openzeppelin/contracts/access/AccessControl.sol';
import '@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol';
import '@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol';
import '@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol';


contract GLDToken is ERC20, AccessControl {
  event Pair(uint256 a,uint256 b);
  event Price(uint256 p,uint256 q);
  event Address(address d);
  event Array(uint256[] array);
  event Variable(uint256 amount);
  event Balance(uint256 balance);
  bytes32 public constant MINTER_ROLE = keccak256('MINTER_ROLE');    
  address[] tokenAddresses;
  uint[] weights;
  uint internal constant denom = 1000000;   

  address payable internal constant UNISWAP_ROUTER_ADDRESS = 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D ;
  address internal constant DAI_ADDRESS = 0x6B175474E89094C44Da98b954EedeAC495271d0F ;
  address internal constant WBTC_ADDRESS =
    0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599;
  // IUniswapV2Router02 public uniswapRouter;
  IUniswapV2Factory public uniswapFactory;
  IUniswapV2Router02 public uniswapRouter;

  constructor() public ERC20('Gold', 'GLD') {
    uniswapRouter = IUniswapV2Router02(0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D); // For testing
    uniswapFactory = IUniswapV2Factory(0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f); // For testing
    _setupRole(MINTER_ROLE, msg.sender);
  }

  modifier whitelisted() {
    require(hasRole(MINTER_ROLE, msg.sender), 'Caller is not a minter');
    _;
  }

  receive() external payable whitelisted {
  }

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

  function deposit() external payable {
    require(msg.value > 0.01 ether, 'Insufficient amount of ether sent');
    if (totalSupply() > 0) {
      uint256 initial_portfolio_val = valuePortfolio();
      uint256 value_per_token = initial_portfolio_val / totalSupply();
      EthToToken();
      uint256 portfolio_val = valuePortfolio();
      uint256 new_tokens = (initial_portfolio_val - portfolio_val) / value_per_token;
      _mint(msg.sender, new_tokens);
    } else {
      EthToToken();
      uint256 portfolio_val = valuePortfolio();
      _mint(msg.sender, portfolio_val);
    }
  }

  function getPathForSwap(address tokenIn,address tokenOut) private pure returns (address[] memory) {
    address[] memory path = new address[](2);
    path[0] = tokenIn;
    path[1] = tokenOut;
    return path;
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
    uint amountOut = uniswapRouter.getAmountOut(amountIn,ethReserves,tokenReserves);
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
      uint256 amountOutMin = getAmountOut(tokenAddresses[i],ethTokenFraction);
      address[] memory path = getPathForSwap(uniswapRouter.WETH(),tokenAddresses[i]);
      uniswapRouter.swapExactETHForTokens{value: ethTokenFraction}(
        amountOutMin,
        path,
        address(this),
        deadline
      );
      ethRemaining -= ethTokenFraction;
      // emit Variable(msg.value);
      // emit Variable(ethTokenFraction);
      // emit Variable(amountOutMin);
      ERC20 token = ERC20(tokenAddresses[i]);
      uint256 balance = token.balanceOf(address(this));
      // emit Variable(amountOutMin);
      emit Balance(balance);
    }
    emit Variable(ethRemaining);
    uint256 lastIndex = weights.length-1;
    uint256 lastDeadline = now + 10 minutes;
    uint256 lastAmountOutMin = getAmountOut(tokenAddresses[lastIndex],ethRemaining);
    address[] memory lastPath = getPathForSwap(uniswapRouter.WETH(),tokenAddresses[lastIndex]);
    emit Variable(lastAmountOutMin);
    uniswapRouter.swapExactETHForTokens{value: ethRemaining}(
      lastAmountOutMin,
      lastPath,
      address(this),
      lastDeadline
    );
    emit Variable(msg.value);
    emit Variable(ethRemaining);
    ERC20 token = ERC20(tokenAddresses[lastIndex]);
    uint256 balance = token.balanceOf(address(this));
    emit Balance(balance);
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
    // uint256 amountOutMin = getAmountOutEth(token_addr,amountIn);
    uint256 amountOutMin =  0.1 ether;
    token.approve(UNISWAP_ROUTER_ADDRESS, amountIn);
    emit Variable(amountOutMin);
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
    emit Variable(amountOutMin);
    uniswapRouter.swapExactTokensForTokens(amountIn, amountOutMin, path, address(this), deadline);
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
      emit Balance(balance);
      emit Variable(tokenAmount);
      // tokenToEth(tokenAmount, tokenAddresses[i], deadline);
      uint256 amtfromtoken = tokenToEth(tokenAmount, tokenAddresses[i], deadline);
      eth_amount += amtfromtoken;
      // emit Array(amtfromtoken);
    }
    emit Variable(eth_amount);
    msg.sender.transfer(eth_amount);
    _burn(msg.sender, amount);
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

  function valuePortfolio() public returns(uint256) {
    uint256 portfolio_balance = 0; 
    for (uint i=0;i<weights.length;i++) {
      ERC20 token = ERC20(tokenAddresses[i]);
      uint256 balance = token.balanceOf(address(this));
      uint256 amountOutMin = getAmountOutForTokens(tokenAddresses[i],uniswapRouter.WETH(),balance);
      portfolio_balance += amountOutMin;
    }
    // emit Balance(portfolio_balance);
    // emit Balance(balanceOf(msg.sender));
    return portfolio_balance;
  }
  
  function migratePortfolio() public view {}

  // function token_balance(address tokenAddress) external view returns (uint256) {
  //   ERC20 token = ERC20(tokenAddress);
  //   return (token.balanceOf(address(this)));
  // }

  // function seed_portfolio(address[] tokenAddresses, mapping(address => uint) weights) external {
  //   Portfolio portfolio = Portfolio(tokenAddresses,weights);
  // }

  // function view_portfolio() external returns(Portfolio) {
  //   emit(PortfolioView(this.portfolio))
  // }

  // function price_portfolio() internal {

  // }
  // get token address
  // get weight amount
  // get eth amount to buy with
  // swap eth for token
  
  // function getAmountOut(address token,uint amountA) internal returns (uint256) {
  //   address pair = uniswapFactory.getPair(token, uniswapRouter.WETH());
  //   (uint left, uint right,) = IUniswapV2Pair(pair).getReserves();
  //   uint amountB = uniswapRouter.getAmountOut(amountA,tokenReserves,ethReserves);
  //   return amountB;
  // }

  // function convertEthToDai(uint amountOutMin, uint deadline) public {
  //   address[] memory path = new address[](2);
  //   path[0] = uniswapRouter.WETH();
  //   path[1] = DAI_ADDRESS;

  //   uniswapRouter.swapExactETHForTokens.value(msg.value)(uint amountOutMin, path, address(this), deadline);
    
  //   // refund leftover ETH to user
  //   msg.sender.call.value(address(this).balance)("");
  // }


  // function convertDaiToEth(uint amountOutMin, uint deadline) public {
  //   address[] memory path = new address[](2);
  //   path[0] = uniswapRouter.WETH();
  //   path[1] = DAI_ADDRESS;

  //   uniswapRouter.swapExactTokensForEth.value(msg.value)(uint amountOutMin, path, address(this), deadline);
    
  //   // refund leftover ETH to user
  //   msg.sender.call.value(address(this).balance)("");
  // }

  // function test() public returns (uint256) {
  //   TestInterface t = TestInterface(0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0);
  //   return  t.Add(1,2);
  // }

  // function buyCryptoOnUniswap1(uint256 etherCost , address cryptoToken) public payable returns (uint256) {

      
  //  if(etherCost > address(this).balance){
  //         return 0;
  //   }
  //   uint deadline = now + 300; // using 'now' for convenience, for mainnet pass deadline from frontend!
    
  //   uint[] memory amounts = usi.swapExactETHForTokens.value(etherCost)(0, getPathForETHToToken(cryptoToken), address(this), deadline);
  //   uint256 outputTokenCount = uint256(amounts[1]);
    
  //   return outputTokenCount;
  //     }




  // function swap(address tokenA, address tokenB) public {
  //   uint256 amountIn = 50 * 10**DAI.decimals();
  //   require(
  //     DAI.transferFrom(msg.sender, address(this), amountIn),
  //     'transferFrom failed.'
  //   );
  //   require(
  //     DAI.approve(address(UniswapV2Router02), amountIn),
  //     'approve failed.'
  //   );
  //   // amountOutMin must be retrieved from an oracle of some kind
  //   address[] memory path = new address[](2);
  //   path[0] = address(DAI);
  //   path[1] = UniswapV2Router02.WETH();
  //   UniswapV2Router02.swapExactTokensForETH(
  //     amountIn,
  //     amountOutMin,
  //     path,
  //     msg.sender,
  //     block.timestamp
  //   );
  // }
}
