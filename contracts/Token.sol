pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract GLDToken is ERC20, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    constructor() public ERC20("Gold", "GLD") {
        _setupRole(MINTER_ROLE, msg.sender);
    }
    function depositEth(address recipient, uint256 amount) public payable virtual {
        require(msg.value > 0.01 ether, 'Insufficient amount of ether sent');
        require(hasRole(MINTER_ROLE, msg.sender), "Caller is not a minter");
        _mint(msg.sender, amount);
    }
    function withdrawEth(address recipient, uint256 amount) public virtual {
        require(msg.value > 0.01 ether, 'Insufficient amount of ether sent');
        require(hasRole(MINTER_ROLE, msg.sender), "Caller is not a minter");
        require(balanceOf(msg.sender) >= amount, "Amount to withdraw exceeds address balance");
        _burn(msg.sender, amount);
        transfer(msg.sender,amount);
    }
    function whitelistAddress(address recipient) public virtual {
        require(!hasRole(MINTER_ROLE, recipient), "Recipient is already a minter");
        require(hasRole(MINTER_ROLE, msg.sender), "Caller is not a minter");
        _setupRole(MINTER_ROLE, recipient);
    }
}