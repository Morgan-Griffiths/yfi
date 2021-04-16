
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
  address public chairperson;
  mapping(uint => Proposal) public proposalLookup;
  mapping(address => Voter) public voterLookup;
  address[] public voterAddresses;
  uint public proposalCount = 0;
  uint public totalVotes = 0;
  uint public numVoters;

  // address payable internal constant BFI_ADDRESS = 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D ;

  constructor(address[] memory whitelistedAddresses,address tokenAddress) public {
    token = IBFIToken(tokenAddress);
    chairperson = msg.sender;
    uint balance;
    // Look up all token holders in sister contract
    // Construct all voters 
    numVoters = whitelistedAddresses.length;
    for (uint i=0;i<whitelistedAddresses.length;i++) {
      // check voter balance
      // if (token.balanceOf(whitelistedAddresses[i]) >= 0) {
      voterLookup[whitelistedAddresses[i]] = Voter(1,false,address(0),0,0);
      voterAddresses.push(whitelistedAddresses[i]);
      // }
    }
  }
  receive() external payable {}
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
  function addVoters(address[] memory _addresses) external {
    require(msg.sender == chairperson,'Only chairperson can add addresses');
    for (uint i=0;i<_addresses.length;i++) {
      voterLookup[_addresses[i]] = Voter(1,false,address(0),0,0);
    }
  }
  function delegate(address to) public {
      // require(token.balanceOf(msg.sender) > 0,'Degator does not own any tokens');
      // require(token.balanceOf(to) > 0,'Degated does not own any tokens');
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
    // require(token.balanceOf(voterLookup[msg.sender]) > 0,'Voter does not hold any tokens');
    require(voterLookup[msg.sender].voted == false,'Voter has already voted');
    require(id >= 0 && id <= proposalCount);
    proposalLookup[id].voteCount += voterLookup[msg.sender].weight;
    voterLookup[msg.sender].voted = true;
    totalVotes += 1;
    emit votedEvent(id);
  }
  function reset() external {
    totalVotes = 0;
    proposalCount = 0;
    for (uint i=0;i < voterAddresses.length; i++) {
      voterLookup[voterAddresses[i]].voted = false;
      voterLookup[voterAddresses[i]].vote = 0;
      voterLookup[voterAddresses[i]].proposals = 0;
    }
  }
  function getProposal(uint index) external view returns (string memory,address[] memory,uint[] memory,uint) {
    Proposal memory proposal = proposalLookup[index];
    return (proposal.name,proposal.tokenAddresses,proposal.weights,proposal.voteCount);
  }
  function readAddresses() external view returns (address[] memory) {
    return voterAddresses;
  }
  function executeProposal() external {
    // trigger migrate porfolio in token
    require(totalVotes > (numVoters / 2),'Not enough votes');
    (uint winnerId,uint maxVotes) = getWinner();
    Proposal memory winningProposal = proposalLookup[winnerId];
    uint[] memory _weights = winningProposal.weights;
    address[] memory _tokenAddresses = winningProposal.tokenAddresses;
    token.simpleMigrate(_tokenAddresses,_weights);
  }
}