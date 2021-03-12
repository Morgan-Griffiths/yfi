
// SPDX-License-Identifier: MIT
pragma solidity ^0.6.6;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import './IToken.sol';

contract Voting {
  struct Voter {
        uint weight; // weight is accumulated by delegation
        bool voted;  // if true, that person already voted
        address delegate; // person delegated to
        uint vote;   // index of the voted proposal
        uint proposals;   // number of proposals submited
    }
  struct Proposal {
    uint id;
    string name;
    address[] tokenAddresses;
    uint[] weights;
    uint voteCount;
  }
  IBFIToken token;
  event votedEvent(uint indexed id);
  event Variable(uint amount);
  address public chairperson;
  mapping(uint => Proposal) public proposalLookup;
  mapping(address => Voter) public voterLookup;
  uint public proposalCount = 0;
  uint public totalVotes = 0;
  uint public numVoters;

  // address payable internal constant BFI_ADDRESS = 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D ;

  constructor(address[] memory whitelistedAddresses,address tokenAddress) public {
    address BFI_ADDRESS = tokenAddress;
    token = IBFIToken(BFI_ADDRESS);
    chairperson = msg.sender;
    // Look up all token holders in sister contract
    // Construct all voters
    numVoters = whitelistedAddresses.length;
    for (uint i=0;i<whitelistedAddresses.length;i++) {
      voterLookup[whitelistedAddresses[i]] = Voter(1,false,0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE,0,0);
    }
  }
  function addProposal(string memory name,address[] memory _tokenAddresses,uint[] memory _weights) public {
    // require(msg.sender == chairperson,'Only the chair can add a proposal');
    require(voterLookup[msg.sender].proposals == 0,'Each member may only present 1 proposal');
    proposalLookup[proposalCount] = Proposal(proposalCount,name,_tokenAddresses,_weights,0);
    voterLookup[msg.sender].proposals ++;
    proposalCount ++;
  }
  function getWinner() internal view returns (uint,uint) {
    uint idWinner = 0;
    uint maxVotes = 0;
    for (uint i=0; i<proposalCount;i++) {
      if (proposalLookup[i].voteCount > maxVotes) {
        maxVotes = proposalLookup[i].voteCount;
        idWinner = i;
      }
    }
    return (idWinner,maxVotes);
  }
  function delegate(address to) public {
      // assigns reference
      Voter storage sender = voterLookup[msg.sender];
      require(!sender.voted, "You already voted.");
      require(to != msg.sender, "Self-delegation is disallowed.");
      while (voterLookup[to].delegate != address(0)) {
          to = voterLookup[to].delegate;
          // We found a loop in the delegation, not allowed.
          require(to != msg.sender, "Found loop in delegation.");
      }
      sender.voted = true;
      sender.delegate = to;
      Voter storage delegate_ = voterLookup[to];
      if (delegate_.voted) {
          // If the delegate already voted,
          // directly add to the number of votes
          proposalLookup[delegate_.vote].voteCount += sender.weight;
      } else {
          // If the delegate did not vote yet,
          // add to her weight.
          delegate_.weight += sender.weight;
      }
  }
  function vote(uint id) external {
    require(voterLookup[msg.sender].voted == false);
    require(id >= 0 && id <= proposalCount);
    proposalLookup[id].voteCount ++;
    voterLookup[msg.sender].voted = true;
    totalVotes += 1;
    emit votedEvent(id);
  }
  function reset() external {
    proposalCount = 0;
  }
  function executeProposal() external {
    // trigger migrate porfolio in token
    (uint winnerId,uint maxVotes) = getWinner();
    Proposal memory winningProposal = proposalLookup[winnerId];
    uint[] memory _weight = winningProposal.weights;
    address[] memory _tokenAddresses = winningProposal.tokenAddresses;
    token.migratePortfolio(_weight,_tokenAddresses);
  }
}