// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {

  //1. Greeter contract
  const Greeter = await hre.ethers.getContractFactory("Greeter");
  const greeter = await Greeter.deploy("Hello, Hardhat!");
  await greeter.deployed();
  console.log("Greeter smart constract deployed to:", greeter.address);
  
  //2. ElectionVote contract
  const ElectionVote = await hre.ethers.getContractFactory("ElectionVote");
  const electionVote = await ElectionVote.deploy();
  await electionVote.deployed();
  console.log("ElectionVote smart constract deployed to:", electionVote.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
