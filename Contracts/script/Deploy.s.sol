// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/MockUSDC.sol";
import "../src/OracleAdapter.sol";
import "../src/CollateralVault.sol";
import "../src/DomainFutures.sol";

contract DeployScript is Script {
    function run() external returns (address, address, address, address) {
        vm.startBroadcast();

        MockUSDC usdc = new MockUSDC(1_000_000e6);
        OracleAdapter oracle = new OracleAdapter();
        CollateralVault vault = new CollateralVault(address(usdc));
        DomainFutures futures = new DomainFutures(address(vault), address(oracle));

        // Grant DomainFutures contract permission to move funds from CollateralVault
        // This is a placeholder for a real access control mechanism

        vm.stopBroadcast();

        return (address(usdc), address(oracle), address(vault), address(futures));
    }
}
