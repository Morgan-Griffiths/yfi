// SPDX-License-Identifier: MIT
pragma solidity ^0.6.6;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '@openzeppelin/contracts/access/AccessControl.sol';
import {UniswapV2Router02} from '@uniswap/v2-periphery/contracts/UniswapV2Router02.sol';

contract GLDToken is ERC20, AccessControl {
  bytes32 public constant MINTER_ROLE = keccak256('MINTER_ROLE');       

  address payable internal constant UNISWAP_ROUTER_ADDRESS = 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D ;
  address payable internal constant DAI_ADDRESS = 0x6B175474E89094C44Da98b954EedeAC495271d0F ;
  UniswapV2Router02 public uniswapRouter;

  constructor() public ERC20('Gold', 'GLD') {
    uniswapRouter = UniswapV2Router02(UNISWAP_ROUTER_ADDRESS);
    _setupRole(MINTER_ROLE, msg.sender);
  }

  receive() external payable whitelisted {
    require(msg.value > 0.01 ether, 'Insufficient amount of ether sent');
    _mint(msg.sender, msg.value);
    // convertEthToDai(msg.value,10);
  }

  function withdraw(uint256 amount) external whitelisted {
    require(
      balanceOf(msg.sender) > amount,
      'Amount to withdraw exceeds address balance'
    );
    _burn(msg.sender, amount);
    // msg.sender.call('{value: amount}');
    // convertDaiToEth(msg.value,10);
    msg.sender.transfer(amount);
  }

  function whitelistAddress(address recipient) public {
    require(!hasRole(MINTER_ROLE, recipient), 'Recipient is already a minter');
    require(hasRole(MINTER_ROLE, msg.sender), 'Caller is not a minter');
    _setupRole(MINTER_ROLE, recipient);
  }

  function convertEthToDai(uint ethAmount, uint deadline) external payable {
    address[] memory path = new address[](2);
    path[0] = uniswapRouter.WETH();
    path[1] = DAI_ADDRESS;

    uniswapRouter.swapExactETHForTokens.value(msg.value)(ethAmount, path, address(this), deadline);
    
    // refund leftover ETH to user
    msg.sender.call.value(address(this).balance)("");
  }

  // function convertDaiToEth(uint daiAmount, uint deadline) public {
  //   address[] memory path = new address[](2);
  //   path[0] = uniswapRouter.WETH();
  //   path[1] = DAI_ADDRESS;

  //   uniswapRouter.swapExactTokensForEth.value(msg.value)(daiAmount, path, address(this), deadline);
    
  //   // refund leftover ETH to user
  //   msg.sender.call.value(address(this).balance)("");
  // }

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
