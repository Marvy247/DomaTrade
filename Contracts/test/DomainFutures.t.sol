// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/DomainFutures.sol";
import "../src/CollateralVault.sol";
import "../src/OracleAdapter.sol";
import "../src/MockUSDC.sol";

contract DomainFuturesTest is Test {
    DomainFutures futures;
    CollateralVault vault;
    OracleAdapter oracle;
    MockUSDC usdc;
    address user = address(0x1);
    address liquidator = address(0x2);

    function setUp() public {
        usdc = new MockUSDC(1000e6);
        vault = new CollateralVault(address(usdc));
        oracle = new OracleAdapter();
        futures = new DomainFutures(address(vault), address(oracle));

        usdc.faucet(user, 1000e6);
        vm.startPrank(user);
        usdc.approve(address(vault), 1000e6);
        vault.deposit(100e6);
        vm.stopPrank();
    }

    function testOpenLongPosition() public {
        vm.startPrank(user);
        futures.openPosition(100e6, 5, true);
        vm.stopPrank();

        (uint256 size, uint256 entryPrice, bool isLong, uint256 collateral) = futures.positions(user);
        assertTrue(isLong);
        assertEq(collateral, 100e6);
        assertEq(size, 500e6);
    }

    function testOpenShortPosition() public {
        vm.startPrank(user);
        futures.openPosition(100e6, 5, false);
        vm.stopPrank();

        (uint256 size, uint256 entryPrice, bool isLong, uint256 collateral) = futures.positions(user);
        assertFalse(isLong);
        assertEq(collateral, 100e6);
        assertEq(size, 500e6);
    }

    function testClosePosition() public {
        vm.startPrank(user);
        futures.openPosition(100e6, 5, true);
        futures.closePosition();
        vm.stopPrank();

        (uint256 size, , ,) = futures.positions(user);
        assertEq(size, 0);
    }

    function testGetPnlLong() public {
        bytes32 domainId = keccak256("hackathon.doma");
        oracle.setPrice(domainId, 1500e6);

        vm.startPrank(user);
        futures.openPosition(100e6, 5, true);
        vm.stopPrank();

        oracle.setPrice(domainId, 1600e6);

        int256 pnl = futures.getPnl(user);
        assertEq(pnl, 33333333); // (1600 - 1500) * 500 / 1500 = 33.33
    }

    function testGetPnlShort() public {
        bytes32 domainId = keccak256("hackathon.doma");
        oracle.setPrice(domainId, 1500e6);

        vm.startPrank(user);
        futures.openPosition(100e6, 5, false);
        vm.stopPrank();

        oracle.setPrice(domainId, 1400e6);

        int256 pnl = futures.getPnl(user);
        assertEq(pnl, 33333333); // (1500 - 1400) * 500 / 1500 = 33.33
    }

    function testGetMarginRatio() public {
        bytes32 domainId = keccak256("hackathon.doma");
        oracle.setPrice(domainId, 1500e6);

        vm.startPrank(user);
        futures.openPosition(100e6, 5, true);
        vm.stopPrank();

        uint256 marginRatio = futures.getMarginRatio(user);
        assertEq(marginRatio, 200000000000000000); // 100e6 * 1e18 / 500e6 = 0.2e18
    }

    function testLiquidate() public {
        bytes32 domainId = keccak256("hackathon.doma");
        oracle.setPrice(domainId, 1500e6);

        vm.startPrank(user);
        futures.openPosition(100e6, 5, true);
        vm.stopPrank();

        oracle.setPrice(domainId, 1200e6);

        vm.startPrank(liquidator);
        futures.liquidate(user);
        vm.stopPrank();

        (uint256 size, , ,) = futures.positions(user);
        assertEq(size, 0);
    }
}