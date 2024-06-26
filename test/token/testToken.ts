import { expect } from 'chai';
import { ethers } from 'hardhat';
import { MyToken } from '../../typechain-types/contracts/MyToken';

describe("testing ERC-20 token contracts - ", function() {
	const mintAmount = ethers.parseEther("1");
	const transferAmount = ethers.parseEther("0.1");
	let token: MyToken;

	it("should deploy the token contract and return the symbol", async function() {
		token = await ethers.deployContract("MyToken");
		await token.waitForDeployment();

		const symbol = await token.symbol();
		expect(symbol).to.equal("MTK", "expected different symbol returned");
	})

	it("should mint some tokens", async function() {
		let [signer] = await ethers.getSigners();
		const tx = await token.mint(signer.address, mintAmount)	;
		const receipt = await tx.wait();

		if (receipt !== null) {
			expect(receipt.status).to.equal(1, "expected receipt to show successful transaction when minting");
		}

		const balance = await token.balanceOf(signer);
		expect(balance).to.equal(mintAmount, "expected different balance after minting");
	})

	it("should send tokens to another address", async function() {
		let [sender, receiver] = await ethers.getSigners();
		const tx = await token.connect(sender).transfer(receiver, transferAmount);
		const receipt = await tx.wait();

		if (receipt !== null) {
			expect(receipt.status).to.equal(1, "expected receipt to show successful transaction when transferring");
		}

		const balanceSender = await token.balanceOf(sender);
		expect(balanceSender).to.equal(mintAmount-transferAmount);
		const balanceReceiver = await token.balanceOf(receiver);
		expect(balanceReceiver).to.equal(transferAmount);
	})
})

