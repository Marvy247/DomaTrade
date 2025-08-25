// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/OracleAdapter.sol";

contract OracleAdapterTest is Test {
    OracleAdapter oracle;

    function setUp() public {
        oracle = new OracleAdapter();
    }

    function testSetAndGetPrice() public {
        bytes32 domainId = keccak256("hackathon.doma");
        uint256 price = 1500e6;
        oracle.setPrice(domainId, price);
        assertEq(oracle.getPrice(domainId), price);
    }
}
