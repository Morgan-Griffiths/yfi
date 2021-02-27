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
  event Price(uint256 p);
  bytes32 public constant MINTER_ROLE = keccak256('MINTER_ROLE');       

  address payable internal constant UNISWAP_ROUTER_ADDRESS = 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D ;
  address payable internal constant DAI_ADDRESS = 0x6B175474E89094C44Da98b954EedeAC495271d0F ;
  // IUniswapV2Router02 public uniswapRouter;
  IUniswapV2Factory public uniswapFactory;
  IUniswapV2Router02 public uniswapRouter;

  constructor() public ERC20('Gold', 'GLD') {
    uniswapRouter = IUniswapV2Router02(0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D); // For testing
    uniswapFactory = IUniswapV2Factory(0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f); // For testing
    _setupRole(MINTER_ROLE, msg.sender);
  }

  receive() external payable whitelisted {
    require(msg.value > 0.01 ether, 'Insufficient amount of ether sent');
    // deposit money into the vault
    // compute value of vault
    // send tokens back to sender
    // convertEthToDai(msg.value);
    _mint(msg.sender, msg.value);
  }

  function withdraw(uint256 amount) external whitelisted {
    require(
      balanceOf(msg.sender) >= amount,
      'Amount to withdraw exceeds address balance'
    );
    _burn(msg.sender, amount);
    // compute value of vault per token
    // sell underlying tokens -> Eth
    // return eth
    // convertDaiToEth(msg.value,10);
    msg.sender.transfer(amount);
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

  function test() public {
    uint256 price = getAmountOut(DAI_ADDRESS,1);
    // address pair_address = uniswapFactory.getPair(DAI_ADDRESS, uniswapRouter.WETH());
    // (uint256 reserve0, uint256 reserve1,) = IUniswapV2Pair(pair_address).getReserves();
    emit Price(price);
    // return pair_address;
  }

  // get token address
  // get weight amount
  // get eth amount to buy with
  // swap eth for token
  
  function getAmountOut(address token,uint amountA) external view returns (uint256) {
    address pair = uniswapFactory.getPair(token, uniswapRouter.WETH());
    (uint left, uint right,) = IUniswapV2Pair(pair).getReserves();
    (uint tokenReserves, uint ethReserves) = (token < uniswapRouter.WETH()) ? (left, right) : (right, left);
    uint amountB = uniswapRouter.getAmountOut(amountA,tokenReserves,ethReserves);
    return amountB;
  }

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


  // function getPathForETHToToken(address crypto) private view returns (address[] memory) {
       
  //   address[] memory path = new address[](2);
  //   path[0] = usi.WETH();
  //   path[1] = crypto;
    
  //   return path;
  // }


  function convertDaiToEth(uint daiAmount, uint deadline) public {
    address[] memory path = new address[](2);
    path[0] = uniswapRouter.WETH();
    path[1] = DAI_ADDRESS;

    uniswapRouter.swapExactTokensForEth.value(msg.value)(amountOutMin, path, address(this), deadline);
    
    // refund leftover ETH to user
    msg.sender.call.value(address(this).balance)("");
  }

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

  modifier whitelisted() {
    require(hasRole(MINTER_ROLE, msg.sender), 'Caller is not a minter');
    _;
  }
}
