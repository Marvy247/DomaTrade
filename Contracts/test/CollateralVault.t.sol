// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/CollateralVault.sol";
import "../src/MockUSDC.sol";

contract CollateralVaultTest is Test {
    CollateralVault vault;
    MockUSDC usdc;
    address user = address(0x1);

    function setUp() public {
        usdc = new MockUSDC(1000e6);
        vault = new CollateralVault(address(usdc));
        usdc.faucet(user, 1000e6);
    }

    function testDeposit() public {
        uint256 amount = 100e6;
        vm.startPrank(user);
        usdc.approve(address(vault), amount);
        vault.deposit(amount);
        vm.stopPrank();
        assertEq(vault.deposits(user), amount);
        assertEq(usdc.balanceOf(address(vault)), amount);
    }

    function testWithdraw() public {
        uint256 depositAmount = 200e6;
        uint256 withdrawAmount = 100e6;
        vm.startPrank(user);
        usdc.approve(address(vault), depositAmount);
        vault.deposit(depositAmount);
        vault.withdraw(withdrawAmount);
        vm.stopPrank();
        assertEq(vault.deposits(user), depositAmount - withdrawAmount);
        assertEq(usdc.balanceOf(user), 1000e6 - depositAmount + withdrawAmount);
    }
}
