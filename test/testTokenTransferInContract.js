const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("transferring tokens", function() {
  it("should send the tokens", async function() {
    const [owner, addr1] = await ethers.getSigners();
    const ethBalance = await ethers.provider.getBalance(owner);
    console.log("owner ETH balance:", ethBalance.toString(10));

    const token = await ethers.deployContract("MyToken");
    const tokenAddr = await token.getAddress();

    token.mint(owner, 100_000_000);

    const tokenTransferFactory = await ethers.getContractFactory("tokenTransfer");
    const tokenTransferContract = await tokenTransferFactory.deploy(tokenAddr);
    console.log("deployed token transfer contract");
    const tokenTransferAddr = await tokenTransferContract.getAddress();
    console.log("Token address:", tokenTransferAddr);

    const amount = 1000;

    // check the balance before transfer
    const balanceBeforeOwner = await token.balanceOf(owner);
    console.log("ERC-20 balance of owner before transfer:", balanceBeforeOwner.toString(10));
    const balanceBefore = await token.balanceOf(addr1);
    console.log("ERC-20 balance before transfer:", balanceBefore.toString(10));

    // transfer the tokens using the smart contract
    await tokenTransferContract.connect(owner).transferToken(addr1, amount);

    // check the balance
    const balance = await token.balanceOf(addr1);
    console.log("ERC-20 balance after transfer:", balance.toString(10));
    expect(balance).to.equal(balanceBefore + amount);
  })
})
