const { artifacts } = require("hardhat");
const hre = require("hardhat");
const ConstructorParams = require("./constructorParams.json");

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function main() {
  const SolveToken = await hre.ethers.getContractFactory("SolveToken");
  const solveToken = await SolveToken.deploy(
    ConstructorParams.tokenName,
    ConstructorParams.tokenSymbol
  );

  await solveToken.deployed();
  console.log("Solve Token Contract address:", solveToken.address);

  await sleep(20000);

  await hre.run("verify:verify", {
    address: solveToken.address,
    constructorArguments: [
      ConstructorParams.tokenName,
      ConstructorParams.tokenSymbol,
    ],
  });

  const VotingContract = await hre.ethers.getContractFactory("VotingContract");
  const votingContract = await VotingContract.deploy(solveToken.address);

  await votingContract.deployed();
  console.log("Voting Contract address:", votingContract.address);

  await sleep(20000);

  await hre.run("verify:verify", {
    address: votingContract.address,
    constructorArguments: [solveToken.address],
  });

  saveFrontendFiles(votingContract, solveToken);
}

function saveFrontendFiles(votingContract, solveToken) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../src/abis";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + "/contract-address.json",
    JSON.stringify(
      {
        VotingContract: votingContract.address,
        SolveToken: solveToken.address,
      },
      undefined,
      2
    )
  );

  const VotingContractArtifact = artifacts.readArtifactSync("VotingContract");

  fs.writeFileSync(
    contractsDir + "/VotingContract.json",
    JSON.stringify(VotingContractArtifact, null, 2)
  );

  const SolveTokenArtifact = artifacts.readArtifactSync("SolveToken");

  fs.writeFileSync(
    contractsDir + "/SolveToken.json",
    JSON.stringify(SolveTokenArtifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
