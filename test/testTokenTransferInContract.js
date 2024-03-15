const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("transferring tokens", function() {
  it("should send the tokens", async function() {
    const [owner, addr1] = await ethers.getSigners();
    const mintAmount = 100_000_000;
    const amount = 1000;

    const token = await ethers.deployContract("MyToken");
    const tokenAddr = await token.getAddress();
    token.mint(owner, mintAmount);

    const tokenTransferFactory = await ethers.getContractFactory("tokenTransfer");
    const tokenTransferContract = await tokenTransferFactory.deploy(tokenAddr);
    const tokenTransferAddr = await tokenTransferContract.getAddress();

    token.connect(owner).approve(tokenTransferAddr, amount)

    // check the balance before transfer
    const balanceBeforeOwner = await token.balanceOf(owner);
    console.log("ERC-20 balance of owner before transfer:", balanceBeforeOwner.toString(10));
    const balanceBefore = await token.balanceOf(addr1);
    console.log("ERC-20 balance before transfer:", balanceBefore.toString(10));

    // transfer the tokens using the smart contract
    await tokenTransferContract.transferToken(addr1, amount);

    // check the balance
    const balance = await token.balanceOf(addr1);
    console.log("ERC-20 balance after transfer:", balance.toString(10));
    expect(balance).to.equal(
      balanceBefore + BigInt(amount),
      "expected different amount after token transfer"
    );
  })
})
