pragma solidity ^0.6.6;

import '@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol';
import '@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol';
import '@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol';
import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

contract Yong {
  string public name = 'Yong';
  string public symbol = 'YON';
  address payable internal constant UNISWAP_ROUTER_ADDRESS =
    0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;
  address internal constant DAI_ADDRESS =
    0x6B175474E89094C44Da98b954EedeAC495271d0F;
  address internal constant WETH_ADDRESS =
    0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;
  address internal constant WBTC_ADDRESS =
    0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599;
  mapping(address => uint256) balances;
  uint256 public totalbalance;

  function deposit() external payable {
    balances[msg.sender] += msg.value;
    totalbalance += msg.value;
    IUniswapV2Router02 router = IUniswapV2Router02(UNISWAP_ROUTER_ADDRESS);
    uint256 deadline = block.timestamp + 10 minutes;
    address[] memory path = new address[](2);
    path[0] = WETH_ADDRESS;
    path[1] = DAI_ADDRESS;

    uint256 daiamt = msg.value / 2;
    uint256 wbtcamt = msg.value - daiamt;

    uint256[] memory swapped;
    swapped = router.swapExactETHForTokens{value: daiamt}(
      0,
      path,
      address(this),
      deadline
    );

    path = new address[](2);
    path[0] = WETH_ADDRESS;
    path[1] = WBTC_ADDRESS;
    swapped = router.swapExactETHForTokens{value: wbtcamt}(
      0,
      path,
      address(this),
      deadline
    );
  }

  function holdings()
    external
    view
    returns (
      uint256,
      uint256,
      uint256
    )
  {
    ERC20 dai = ERC20(DAI_ADDRESS);
    ERC20 wbtc = ERC20(WBTC_ADDRESS);
    return (
      address(this).balance,
      wbtc.balanceOf(address(this)),
      dai.balanceOf(address(this))
    );
  }

  function tokenToEth(
    uint256 numer,
    uint256 denom,
    address token_addr,
    uint256 deadline
  ) private returns (uint256 amount) {
    ERC20 token = ERC20(token_addr);
    uint256 balance = token.balanceOf(address(this));
    uint256 portion = (balance * numer) / denom;
    address[] memory path = new address[](2);
    path[0] = token_addr;
    path[1] = WETH_ADDRESS;
    token.approve(UNISWAP_ROUTER_ADDRESS, portion);

    IUniswapV2Router02 router = IUniswapV2Router02(UNISWAP_ROUTER_ADDRESS);
    uint256[] memory traded =
      router.swapExactTokensForETH(portion, 0, path, address(this), deadline);
    return traded[1];
  }

  function withdraw(uint256 amt) external payable {
    require(balances[msg.sender] >= amt, 'insufficient balance');
    uint256 numer = amt;
    uint256 denom = totalbalance;
    balances[msg.sender] -= amt;
    totalbalance -= amt;

    uint256 deadline = block.timestamp + 10 minutes;
    uint256 amtfromdai = tokenToEth(numer, denom, DAI_ADDRESS, deadline);
    uint256 amtfromwbtc = tokenToEth(numer, denom, WBTC_ADDRESS, deadline);
    msg.sender.transfer(amtfromdai + amtfromwbtc);
  }

  function getBalance() external view returns (uint256) {
    return balances[msg.sender];
  }

  receive() external payable {}
}
