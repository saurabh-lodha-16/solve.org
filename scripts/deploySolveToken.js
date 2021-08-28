const { artifacts } = require("hardhat");
const hre = require("hardhat");
const ConstructorParams = require("./constructorParams.json");

async function main() {
  const SolveToken = await hre.ethers.getContractFactory("SolveToken");
  const solveToken = await SolveToken.deploy(
    ConstructorParams.tokenName,
    ConstructorParams.tokenSymbol
  );

  await solveToken.deployed();
  console.log("Solve Token Contract address:", solveToken.address);

  saveFrontendFiles(solveToken);
}

function saveFrontendFiles(contract) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../src/abis";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + "/contract-address.json",
    JSON.stringify({ SolveToken: contract.address }, undefined, 2)
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
