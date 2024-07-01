import { expect } from 'chai';
import { ethers } from 'hardhat';
import { Bech32I } from '../../typechain-types/contracts/Bech32I';
import { StakingI } from '../../typechain-types/contracts/StakingI';
import { PageRequestStruct } from '../../typechain-types/contracts/StakingI';

describe("Testing delegation directly calling staking extension", function() {
  const delegationAmount = ethers.parseEther("1");
  let dev0Addr: string;
  let delegationAmountPre: bigint;
  let staking: StakingI;
  let validator: string;
  let valoperAddr: string;

  it("should list all available validators", async function() {
    staking = await ethers.getContractAt(
      'StakingI',
      '0x0000000000000000000000000000000000000800'
    );

    const pageRequest: PageRequestStruct = {
      key: new Uint8Array(),
      offset: 0,
      limit: 0,
      countTotal: false,
      reverse: false,
    };

    const validatorsRes = await staking.validators(
      "BOND_STATUS_BONDED",
      pageRequest
    );
    expect(
      validatorsRes.validators.length
    ).to.be.equal(1, "There should be one validator");

    const valOut = validatorsRes.validators[0];
    validator = valOut["operatorAddress"];
  })

  it("should convert the bech32 address", async function() {
    const bech32: Bech32I = await ethers.getContractAt(
      'Bech32I',
      '0x0000000000000000000000000000000000000400'
    );

    valoperAddr = await bech32.hexToBech32(validator, "evmosvaloper");
  })

  it("should show the delegation prior to delegation", async function() {
    const signers = await ethers.getSigners();
    const dev0 = signers[0];
    dev0Addr = await dev0.getAddress();

    const delegationsRes = await staking.delegation(
      dev0Addr,
      valoperAddr
    );
    const delegationCoin = delegationsRes["balance"];
    delegationAmountPre = delegationCoin["amount"];
    expect(
      delegationAmountPre
    ).to.be.greaterThanOrEqual(
      0, "There should be either no or an initial delegation prior to delegating"
    );
  })

  it("should delegate to the validator", async function() {
    const tx = await staking.delegate(
      dev0Addr,
      valoperAddr,
      delegationAmount
    );
    const receipt = await tx.wait();
    expect(receipt).to.not.be.null;
    if (receipt !== null) {
      expect(receipt.status).to.be.equal(1, "Transaction should succeed");
    }
  })

  it("should have increased the delegation amount", async function() {
    const delegationsRes = await staking.delegation(
      dev0Addr,
      valoperAddr
    );

    const delegationCoin = delegationsRes["balance"];
    const delegationAmountPost = delegationCoin["amount"];
    expect(
      delegationAmountPost
    ).to.be.equal(
      delegationAmountPre + delegationAmount,
      "Delegation amount should have increased by 1 ether"
    );
  })
});
