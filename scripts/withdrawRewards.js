const hre = require("hardhat");

async function main() {
    const valAddr = "evmosvaloper10t6kyy4jncvnevmgq6q2ntcy90gse3yxa7x2p4"
    
    const dist = await hre.ethers.getContractAt(
        "DistributionI",
        "0x0000000000000000000000000000000000000801"
    );

    const [signer] = await hre.ethers.getSigners();

    const tx = await dist.withdrawDelegatorRewards(signer, valAddr);
    const receipt = await tx.wait(1);

    console.log("The transaction details are");
    console.log(receipt);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
