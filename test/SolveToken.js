const { expect } = require("chai");
const { ethers } = require("hardhat");
const ConstructorParams = require("../scripts/constructorParams.json");
const { BigNumber } = require("ethers");
const { expectRevert } = require("@openzeppelin/test-helpers");

describe("SolveToken Contract", () => {
  let SolveToken, solveToken;
  let deployer;

  before(async () => {
    SolveToken = await ethers.getContractFactory("SolveToken");
    solveToken = await SolveToken.deploy(
      ConstructorParams.tokenName,
      ConstructorParams.tokenSymbol
    );
    deployer = (await ethers.getSigners())[0];
  });

  it("has a name", async function () {
    expect(await solveToken.name()).to.equal(ConstructorParams.tokenName);
  });

  it("has a symbol", async function () {
    expect(await solveToken.symbol()).to.equal(ConstructorParams.tokenSymbol);
  });

  it("user can mint tokens by giving ether", async function () {
    await solveToken.mint({
      value: BigNumber.from(String(1e18)),
    });

    expect(await solveToken.balanceOf(deployer.address)).to.be.equal(
      BigNumber.from(String(1e20))
    );
  });

  it("user can burn tokens and receive etherr", async function () {
    await solveToken.burn(BigNumber.from(String(1e20)));

    expect(await solveToken.balanceOf(deployer.address)).to.be.equal(
      BigNumber.from(0)
    );
  });

  it("should revert if value sent is less than 0.01 ether", async function () {
    await expectRevert(
      solveToken.mint({
        value: BigNumber.from(String(1)),
      }),
      "Minimum ether required is 0.01"
    );
  });
});
