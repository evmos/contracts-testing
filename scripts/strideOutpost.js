// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script> --network <network-name>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const amt = hre.ethers.parseEther("0.001");
  const strideForwarder = "stride17t8syxf9grjp6k8ls4n478h4fa5upynsstmy8u";
  const wevmosAddress = "0xcc491f589b45d4a3c679016195b3fb87d7848210"; // testnet address
  const precompile = await hre.ethers.getContractAt(
    "IStrideOutpost",
    "0x0000000000000000000000000000000000000900"
  );

  const [signer] = await hre.ethers.getSigners();
  const input = {
    channelID: "channel-224", // stride testchain
    sender: signer.getAddress(),
    receiver: signer.getAddress(),
    token: wevmosAddress,
    amount: amt,
    strideForwarder,
  };
  const tx = await precompile.liquidStake(input);
  const receipt = await tx.wait(1);

  console.log(
    `Performed liquid staking of ${ethers.formatEther(amt)} EVMOS to ${strideForwarder}`
  );
  console.log("The transaction details are");
  console.log(receipt);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
