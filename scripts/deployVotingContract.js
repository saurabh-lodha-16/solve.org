const { artifacts } = require("hardhat");
const hre = require("hardhat");
const ConstructorParams = require("./constructorParams.json");

async function main() {
  const VotingContract = await hre.ethers.getContractFactory("VotingContract");
  const votingContract = await VotingContract.deploy(
    ConstructorParams.solveTokenAddress
  );

  await votingContract.deployed();
  console.log("Voting Token Contract address:", votingContract.address);

  saveFrontendFiles(votingContract);
}

function saveFrontendFiles(contract) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../src/abis";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + "/contract-address.json",
    JSON.stringify({ VotingContract: contract.address }, undefined, 2)
  );

  const VotingContractArtifact = artifacts.readArtifactSync("VotingContract");

  fs.writeFileSync(
    contractsDir + "/VotingContract.json",
    JSON.stringify(VotingContractArtifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
