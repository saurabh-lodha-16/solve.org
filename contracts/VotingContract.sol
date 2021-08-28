// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./IERC20.sol";

//ask shubham if we need to keep rate of ether to solve less to avoid need of voting from dapp.

contract VotingContract {
    
    using SafeMath for uint256;
    using Counters for Counters.Counter;

    Counters.Counter private ideaIDs;
    IERC20 public solveToken;
    
   modifier ensureOwnerOfIdea(uint256 ideaId) {
        require(ideas[ideaId].owner == msg.sender, "Only owner of the idea can access");
        _;
    }
    
    modifier ensureIdeaExists(uint256 ideaId) {
        require(ideas[ideaId].owner != address(0), 'No such idea exists');
        _;
    }
    
   event IdeaCreated (
        uint256 indexed ideaID,
        address indexed owner
    );
    
   event UserVoted (
        uint256 indexed ideaID,
        address indexed user
    );
    
   event RewardsClaimed (
        uint256 indexed ideaID,
        address indexed owner,
        uint256 indexed amount
    );
    

   struct Idea {
        address owner;
        string title;
        string description;
        string solution;
        uint256 requiredDonationInEthers;
        bool hasClaimed;
        bool isFunded;
        uint256 totalVotes;
     }
    
     // ideaID => idea details
    mapping(uint256 => Idea) public ideas;
 
    // Idea Creator => idea IDs
    mapping(address => uint256[]) public ideaIdsCreatedByAddress;
    
    // Idea Voter => idea IDs
    mapping(address => uint256[]) public ideaIdsVotedByAddress;
    
    constructor(
        IERC20 _solveToken
    )
    {
        solveToken = _solveToken; // Solve Token ERC20 contract
    }
    
    function getTotalIdeas() external view returns(uint256) {
        return ideaIDs.current();
    }
    
    function submitIdea (
        address _owner,
        string memory _title,
        string memory _description,
        string memory _solution,
        uint256 _requiredDonationInEthers
        )  external returns (uint256) 
    {
        require(_requiredDonationInEthers >= 1, 'Required Donation In Ethers should be greater than 1');//confirm with Shubham
        ideaIDs.increment();
        uint256 newIdeaID = ideaIDs.current();
        ideas[newIdeaID].title = _title;
        ideas[newIdeaID].description = _description;
        ideas[newIdeaID].solution = _solution;
        ideas[newIdeaID].requiredDonationInEthers = _requiredDonationInEthers;
        ideas[newIdeaID].owner = _owner;
        ideaIdsCreatedByAddress[_owner].push(newIdeaID);
        emit IdeaCreated(newIdeaID, _owner);
        return newIdeaID;
    }

    // take argument for number of votes
    function voteForIdea(uint256 ideaID) external ensureIdeaExists(ideaID) {
        require(solveToken.balanceOf(msg.sender) >= 1e18, 'User does not have enough SOLVE tokens');
        require(ideas[ideaID].isFunded == false, 'Idea already funded.');
        solveToken.transferFrom(msg.sender, address(this), 1e18);
        Idea storage idea = ideas[ideaID];
        idea.totalVotes = idea.totalVotes.add(1);
        ideaIdsVotedByAddress[msg.sender].push(ideaID);
        if(idea.totalVotes >= idea.requiredDonationInEthers.mul(100)){ 
            idea.isFunded = true;
        }
        emit UserVoted(ideaID, msg.sender);
    }
     
     
    //  function getIdeasByOwner
    //  function getIdeasVotedByUser (can be added if needed for dapp)

    function claimFunds(uint256 ideaID) external ensureOwnerOfIdea(ideaID) {
        require(ideas[ideaID].owner != address(0), 'No such idea exists');
        require(ideas[ideaID].isFunded == true, 'Idea not funded.');
        require(ideas[ideaID].hasClaimed == false, 'Funding already claimed');
        Idea storage idea = ideas[ideaID];
        uint256 solveTokensForTheIdea = (idea.requiredDonationInEthers.mul(100)).mul(1e18);
        solveToken.burn(solveTokensForTheIdea);
        (bool sent,) = payable(msg.sender).call{value: idea.requiredDonationInEthers.mul(1e18), gas: 100000}("");
        require(sent, "Failed to send Ether");
        idea.hasClaimed = true;
        emit RewardsClaimed(ideaID, idea.owner, solveTokensForTheIdea);
    }
    
    receive() external payable
    {
    }

}