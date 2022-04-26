// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ERC20Mock is ERC20("ERC20 Mock", "MOCK") {
  constructor(address _to) public {
    _mint(_to, 100 ether);
  }
}
