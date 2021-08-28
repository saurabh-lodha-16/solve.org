// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract SolveToken is Context, ERC20 {
    
    using SafeMath for uint256;
    
    event SolveMinted (
        address indexed owner,
        uint256 indexed amount
    );
    
    event SolveBurned (
        address indexed owner,
        uint256 indexed amount
    );
 
    
    constructor(
        string memory name,
        string memory symbol
    ) ERC20(name, symbol) { }
    
    
    function mint()
         public payable
    {
       require(msg.value >= 0.01 ether, 'Minimum ether required is 0.01');
       uint256 tokensToBeMinted = msg.value.mul(100);
        _mint(msg.sender, tokensToBeMinted);
       emit SolveMinted(msg.sender, tokensToBeMinted);
    }
    
        
    function getTotalEtherInContract() external view returns (uint256) {
        return (address(this).balance);
    }
    
    //Ask Shubham
    //Can we add another param here for address of the person who will receive these ethers.
    //Right now I have kept it to be generic.
    //do I need to specify gas here. I guess yes ?
    //ask shubham if we need to add events in interfaces for the functions we extended.
    function burn(uint256 amount)
         public virtual
    {
        require(amount >= 100, 'Minimum of 1 wei need to burned');
        uint256 receivableEther = amount.div(100);
        require(receivableEther <= this.getTotalEtherInContract(), 'Contract does not have enough ETHER');
        _burn(msg.sender, amount);
        (bool sent,) = payable(msg.sender).call{value: receivableEther, gas: 100000}("");
        require(sent, "Failed to send Ether");
        emit SolveBurned(msg.sender, amount);
    }

}