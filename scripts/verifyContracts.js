const hre = require("hardhat");
const ConstructorParams = require("./constructorParams.json");

async function main() {
  await hre.run("verify:verify", {
    address: ConstructorParams.solveTokenAddress,
    constructorArguments: [
      ConstructorParams.tokenName,
      ConstructorParams.tokenSymbol,
    ],
  });

  await hre.run("verify:verify", {
    address: ConstructorParams.votingContractAddress,
    constructorArguments: [ConstructorParams.solveTokenAddress],
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
