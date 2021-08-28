# solve.org


## The Problem - 

change.org is the world's platform for change. The platform and the people on it have achieved spectacular victories over some of the most common issues that have existed. With the growing influence of blockchain and the exponential increase in the number of ERC20 tokens that are present, the utility of these tokens is an issue that isn’t widely discussed. There is a dire need to build platforms that use these tokens as utility and make the best use of their value.  


## Our Solution - 

Inspired by change.org, a decentralized application that aims to increase token utility by seamlessly integrating and using them to bring social change.

The decentralized application aims to inspire token and ETH holders to donate their tokens or ETHER in exchange of voting tokens. The native token SOLVE is minted based on the amount donated to the platform. These SOLVE tokens are used as governance to vote on ideas that require funds. It gives the user the power to choose and prioritize projects that need funding and encourages the community to come together and help fund projects to completion.

Any user can come to the platform to submit his idea/problem, the solution with which he is planning to resolve it and the amount of funding the project needs.
Once completed, this idea/problem is added to the blockchain and is ready to be reviewed by the community.

The users of the dapp can review the idea/problem and can decide to vote for it if in favour. With voting they burn these SOLVE tokens respective to the number of votes added and the funds relative to the number of votes are pledged to the idea.
Once an idea completes the funding it needs, the funds are made available to the owner of the idea/problem.


## Core Features and Functionality - 

Module 1 - 

This deals with viewing, voting and submission of the ideas.


- People who need funding for their problems/ideas can come up to the platform and submit these ideas with the required details. 
- The community with SOLVE tokens can review the ideas and vote on them.
- There will be separate sections for the ideas that have completed funding and the ideas that are open for voting.

The ideas and voting functionality will be part of one smart contract.

Module 2 - 

This deals with the community pledging their ETHER to the contract in exchange of voting power and receiving SOLVE tokens.

- People can donate their ETHER and receive SOLVE tokens that are minted based on the ETHER pledged.
- The funds are directly transferred to the Voting Contract to be able to be distributed to the owner of the ideas upon completion of voting.

## Architecture - 

Frontend - 

It is hosted on Web3.0 and made using ReactJS which is used to design the landing pages and also for the integration and usage of smart contract functions. 
The dapp interacts with the blockchain with the help of metamask wallet, which acts as a signer as well as a provider to the decentralized application.

Smart Contracts - 

We have two main Smart Contracts deployed on the blockchain.
-  VotingContract.sol is used to submit ideas, vote for them, claim the funds etc.
-  SOLVE.sol is used to mint and burn SOLVE tokens in exchange of ETHER.
