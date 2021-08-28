const { expect } = require("chai");
const { ethers } = require("hardhat");
const ConstructorParams = require("../scripts/constructorParams.json");
const { BigNumber } = require("ethers");
const { expectRevert } = require("@openzeppelin/test-helpers");

describe("VotingContract", () => {
  let SolveToken, solveToken;
  let VotingContract, votingContract;
  let deployer;
  let testSigner;
  let ideaDetails;

  before(async () => {
    SolveToken = await ethers.getContractFactory("SolveToken");
    solveToken = await SolveToken.deploy(
      ConstructorParams.tokenName,
      ConstructorParams.tokenSymbol
    );
    VotingContract = await ethers.getContractFactory("VotingContract");
    votingContract = await VotingContract.deploy(solveToken.address);
    deployer = (await ethers.getSigners())[0];
    testSigner = (await ethers.getSigners())[1];
    ideaDetails = {
      owner: deployer.address,
      title: "Idea Title",
      description: "Idea Description",
      solution: "Idea Solution",
      requiredDonationInEthers: 1,
    };
  });

  it("user can submit their ideas/problems to the blockchainr", async function () {
    await votingContract.submitIdea(
      ideaDetails.owner,
      ideaDetails.title,
      ideaDetails.description,
      ideaDetails.solution,
      ideaDetails.requiredDonationInEthers
    );
    const idea = await votingContract.ideas(BigNumber.from(1));
    expect(idea.owner).to.equal(ideaDetails.owner);
    expect(idea.title).to.equal(ideaDetails.title);
    expect(idea.description).to.equal(ideaDetails.description);
    expect(idea.solution).to.equal(ideaDetails.solution);
    expect(idea.requiredDonationInEthers).to.equal(BigNumber.from(1));
    expect(idea.hasClaimed).to.equal(false);
    expect(idea.isFunded).to.equal(false);
    expect(idea.totalVotes).to.equal(0);
  });

  it("get total ideas in the contract", async function () {
    expect(await votingContract.getTotalIdeas()).to.be.equal(BigNumber.from(1));
  });

  it("should revert if requiredDonationInEthers is less than 1 ether", async function () {
    ideaDetails.requiredDonationInEthers = 0;
    await expectRevert(
      votingContract.submitIdea(
        ideaDetails.owner,
        ideaDetails.title,
        ideaDetails.description,
        ideaDetails.solution,
        ideaDetails.requiredDonationInEthers
      ),
      "Required Donation In Ethers should be greater than 1"
    );
  });

  it("should revert if user tries to vote and does not have any SOLVE tokens", async function () {
    await expectRevert(
      votingContract.voteForIdea(BigNumber.from(1)),
      "User does not have enough SOLVE tokens"
    );
  });

  it("should revert if user tries to vote for an idea that does not exist", async function () {
    await expectRevert(
      votingContract.voteForIdea(BigNumber.from(2)),
      "No such idea exists"
    );
  });

  it("user should be able to vote for an idea 1/2", async function () {
    await solveToken.mint({
      value: BigNumber.from(String(1e18)),
    });
    await solveToken.approve(
      votingContract.address,
      BigNumber.from(String(1e20))
    );
    await votingContract.voteForIdea(BigNumber.from(1));
    const idea = await votingContract.ideas(BigNumber.from(1));
    expect(idea.totalVotes).to.equal(1);
    expect(await solveToken.balanceOf(deployer.address)).to.equal(
      BigNumber.from(String(99 * 1e18))
    );
    expect(await solveToken.balanceOf(votingContract.address)).to.equal(
      BigNumber.from(String(1 * 1e18))
    );
    expect(idea.isFunded).to.equal(false);
  });

  it("should revert if user tries to claim funds for an idea not funded", async function () {
    await expectRevert(
      votingContract.connect(deployer).claimFunds(BigNumber.from(1)),
      "Idea not funded."
    );
  });

  it("user should be able to vote for an idea 2/2", async function () {
    for (const index of new Array(99)) {
      await votingContract.voteForIdea(BigNumber.from(1));
    }
    const idea = await votingContract.ideas(BigNumber.from(1));
    expect(idea.totalVotes).to.equal(BigNumber.from(100));
    expect(await solveToken.balanceOf(deployer.address)).to.equal(
      BigNumber.from(0)
    );
    expect(await solveToken.balanceOf(votingContract.address)).to.equal(
      BigNumber.from(String(1e20))
    );
    expect(idea.isFunded).to.equal(true);
  });

  it("should revert if user tries to vote for an idea that is already funded", async function () {
    await solveToken.mint({
      value: BigNumber.from(String(1e18)),
    });
    await solveToken.approve(
      votingContract.address,
      BigNumber.from(String(1e20))
    );
    await expectRevert(
      votingContract.voteForIdea(BigNumber.from(1)),
      "Idea already funded."
    );
  });

  it("should revert if user tries to claim funds for an idea that not added by him", async function () {
    await expectRevert(
      votingContract.connect(testSigner).claimFunds(BigNumber.from(1)),
      "Only owner of the idea can access"
    );
  });

  it("user should be able to claim funds for an idea", async function () {
    await votingContract.claimFunds(BigNumber.from(1));
    const idea = await votingContract.ideas(BigNumber.from(1));
    expect(idea.totalVotes).to.equal(100);
    expect(idea.isFunded).to.equal(true);
    expect(idea.hasClaimed).to.equal(true);
    expect(await solveToken.balanceOf(votingContract.address)).to.equal(
      BigNumber.from(0)
    );
  });

  it("should revert if user tries to claim funds for an idea that has already claimed funds", async function () {
    await expectRevert(
      votingContract.claimFunds(BigNumber.from(1)),
      "Funding already claimed"
    );
  });
});
