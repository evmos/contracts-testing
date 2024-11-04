// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract SafeCallExample {
  function executeSafeCall(address _token, address _receiver, uint256 _amount) public {
    IERC20 token = IERC20(_token);

    uint256 balancePre = token.balanceOf(_receiver);
    require(balancePre == 0, "expected empty balance for receiver wallet");
    bool success = token.transferFrom(msg.sender, _receiver, _amount);
    require(success, "failed to transfer tokens");

    uint256 balance = token.balanceOf(_receiver);
    require(balance == balancePre + _amount, "expected different balance after transfer");

    require(address(token).code.length != 0, "expected token length to be non-zero");
  }
}
