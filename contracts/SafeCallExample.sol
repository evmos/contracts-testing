// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract SafeCallExample {
  using SafeERC20 for IERC20;
  
  function executeSafeCall(address _token, address _receiver, uint256 _amount) public {
    require(_token != address(0), "expected non-zero token address");
    require(_receiver != address(0), "expected non-zero receiver address");
    require(_amount > 0, "expected non-zero token amount");

    IERC20 token = IERC20(_token);
    require(address(token).code.length != 0, "expected token length to be non-zero");

    uint256 balancePre = token.balanceOf(_receiver);
    token.safeTransferFrom(msg.sender, _receiver, _amount);

    uint256 balance = token.balanceOf(_receiver);
    require(balance == balancePre + _amount, "expected different balance after transfer");
  }
}
