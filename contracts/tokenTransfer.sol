// SPDX-License-Identifier: LGPL-3.0-only
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/*
    @title tokenTransfer
    @dev This contract is used to test that any addresses transferring ERC-20 tokens
    are tracked if they're ERC-20 representations of native Cosmos coins.
*/
contract tokenTransfer {
    ERC20 tokenToSend;

    constructor(address tokenAddress){
        tokenToSend = ERC20(tokenAddress);
    }

    /*
        @notice This function is used to transfer ERC-20 tokens to a given address.
        @param to The address to transfer the tokens to
        @param amount The amount of tokens to transfer
    */
    function transferToken(address to, uint256 amount) public {
        bool approved = tokenToSend.approve(address(this), amount);
        require(approved, "Approval failed");
        uint256 allowance = tokenToSend.allowance(address(this), address(this));
        require(allowance == 0, "approval was made for this contract instead of msg.sender");
        allowance = tokenToSend.allowance(msg.sender, address(this));
        require(allowance == amount, "approval wasn't made for the correct amount");

        tokenToSend.transferFrom(msg.sender, to, amount);
    }
}

