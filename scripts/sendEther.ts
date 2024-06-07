// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script> --network <network-name>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
import { ethers } from "hardhat";

async function main() {
  // Send ether to an address
  const [sender, receiver] = await ethers.getSigners();
  const amount = ethers.parseEther("1.0");

  console.log(
    `Sending ${amount.toString()} wei to ${receiver.address} from ${sender.address}`
  );

  const tx = await sender.sendTransaction({
    to: receiver.address,
    value: amount,
  });
  const receipt = await tx.wait();

  console.log("Transaction receipt");
  console.log(receipt);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
