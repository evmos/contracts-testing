import { expect } from 'chai';
import { ethers } from 'hardhat';
import { Wallet } from 'ethers';
import { SafeCallExample } from '../../typechain-types/contracts/SafeCallExample';
import { ERC20 } from '../../typechain-types';

describe("using the safe call method from the Axelar GMP Solidity implementation", function () {
  const transferAmount = ethers.parseEther("1.0")
  const nativeERC20Addr = "0xD4949664cD82660AaE99bEdc034a0deA8A0bd517"; // native denom for evmos/evmos repo
  // const nativeERC20Addr = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"; // native denom for evmos/os repo

  let safeCallContract: SafeCallExample;
  let nativeERC20Contract: ERC20;

  it("should be possible to deploy the smart contract", async function () {
    safeCallContract = await ethers.deployContract("SafeCallExample");
    await safeCallContract.waitForDeployment();
  })

  it("should be possible to call the native erc20", async function () {
    const [signer] = await ethers.getSigners();
    nativeERC20Contract = await ethers.getContractAt("ERC20", nativeERC20Addr);

    const balancePre = await nativeERC20Contract.balanceOf(signer)
    expect(balancePre).to.not.equal(0, "expected non-zero erc20 balance of signer address");
  })

  it("should be possible to approve the safe call contract", async function () {
    const [signer] = await ethers.getSigners();

    const allowancePre = await nativeERC20Contract.allowance(signer, safeCallContract);
    expect(allowancePre).to.be.equal(0, "expected no allowance before approving");

    const tx = await nativeERC20Contract.approve(safeCallContract, transferAmount);
    const receipt = await tx.wait();
    expect(receipt.status).to.equal(1, "failed to approve")

    const allowancePost = await nativeERC20Contract.allowance(signer, safeCallContract);
    expect(allowancePost).to.equal(transferAmount, "expected difference allowance");
  })

  it("should work with the chain's native ERC-20 precompile", async function () {
    const receiver = Wallet.createRandom();
    const [sender] = await ethers.getSigners();

    const balanceSenderPre = await nativeERC20Contract.balanceOf(sender);
    const balanceReceiverPre = await nativeERC20Contract.balanceOf(receiver);
    expect(balanceReceiverPre).to.equal(0, "expected new wallet to have zero balance");

    const tx = await safeCallContract.connect(sender).executeSafeCall(nativeERC20Addr, receiver.address, transferAmount);
    const receipt = await tx.wait();
    expect(receipt?.status).to.be.equal(1, "expected successful safe call");

    const balanceSenderPost = await nativeERC20Contract.balanceOf(sender);
    expect(balanceSenderPost).to.equal(balanceSenderPre - transferAmount - receipt.fee, "expected different sender balance after transfer");
    const balanceReceiverPost = await nativeERC20Contract.balanceOf(receiver);
    expect(balanceReceiverPost).to.equal(transferAmount, "expected different receiver balance");
  })
})
