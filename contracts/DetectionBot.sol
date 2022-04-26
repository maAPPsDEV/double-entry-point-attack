// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "./DoubleEntryPoint.sol";
import "hardhat/console.sol";

contract DetectionBot is IDetectionBot {
  address private vault;

  constructor(address _vault) public {
    vault = _vault;
  }

  function handleTransaction(
    address user,
    bytes calldata /* msgData */
  ) external override {
    address to;
    uint256 value;
    address origSender;
    // decode msgData params
    assembly {
      to := calldataload(0x68)
      value := calldataload(0x88)
      origSender := calldataload(0xa8)
    }
    if (origSender == vault) {
      Forta(msg.sender).raiseAlert(user);
    }
  }
}
