// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/MockUSDC.sol";

contract MockUSDCTest is Test {
    MockUSDC usdc;

    function setUp() public {
        usdc = new MockUSDC(1000e6);
    }

    function testFaucet() public {
        address user = address(0x1);
        uint256 amount = 100e6;
        usdc.faucet(user, amount);
        assertEq(usdc.balanceOf(user), amount);
    }

    function testTransfer() public {
        address user1 = address(0x1);
        address user2 = address(0x2);
        uint256 amount = 100e6;
        usdc.faucet(user1, amount);
        vm.prank(user1);
        usdc.transfer(user2, amount);
        assertEq(usdc.balanceOf(user2), amount);
    }
}
