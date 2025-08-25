// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract OracleAdapter is Ownable {
    mapping(bytes32 => uint256) public prices;

    event PriceUpdated(bytes32 indexed domainId, uint256 newPrice);

    constructor() Ownable(msg.sender) {}

    function setPrice(bytes32 domainId, uint256 price) external onlyOwner {
        prices[domainId] = price;
        emit PriceUpdated(domainId, price);
    }

    function getPrice(bytes32 domainId) external view returns (uint256) {
        return prices[domainId];
    }
}
