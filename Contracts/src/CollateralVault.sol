// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract CollateralVault is ReentrancyGuard {
    IERC20 public immutable collateralToken;
    mapping(address => uint256) public deposits;

    event Deposited(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);

    constructor(address _collateralToken) {
        collateralToken = IERC20(_collateralToken);
    }

    function deposit(uint256 amount) external nonReentrant {
        deposits[msg.sender] += amount;
        collateralToken.transferFrom(msg.sender, address(this), amount);
        emit Deposited(msg.sender, amount);
    }

    function withdraw(uint256 amount) external nonReentrant {
        // This is a simplified withdraw function for the MVP.
        // A real implementation would have more checks, likely called from the DomainFutures contract.
        require(deposits[msg.sender] >= amount, "Insufficient balance");
        deposits[msg.sender] -= amount;
        collateralToken.transfer(msg.sender, amount);
        emit Withdrawn(msg.sender, amount);
    }
}
