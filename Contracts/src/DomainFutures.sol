// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./CollateralVault.sol";
import "./OracleAdapter.sol";

contract DomainFutures {
    struct Position {
        uint256 size; // In USDC 1e6
        uint256 entryPrice; // 1e6
        bool isLong;
        uint256 collateral; // 1e6
    }

    uint256 public constant MAINTENANCE_MARGIN = 6e16; // 6%

    CollateralVault public collateralVault;
    OracleAdapter public oracleAdapter;

    mapping(address => Position) public positions;

    event PositionOpened(address indexed user, uint256 size, bool isLong);
    event PositionClosed(address indexed user, int256 pnl);
    event Liquidated(address indexed user, address indexed liquidator, uint256 penalty);

    constructor(address _collateralVault, address _oracleAdapter) {
        collateralVault = CollateralVault(_collateralVault);
        oracleAdapter = OracleAdapter(_oracleAdapter);
    }

    function openPosition(uint256 collateral, uint256 leverage, bool isLong) external {
        require(positions[msg.sender].size == 0, "Position already open");
        require(collateralVault.deposits(msg.sender) >= collateral, "Insufficient collateral");

        uint256 size = collateral * leverage;
        bytes32 domainId = keccak256("hackathon.doma"); // Hardcoded for MVP
        uint256 entryPrice = oracleAdapter.getPrice(domainId);

        positions[msg.sender] = Position({
            size: size,
            entryPrice: entryPrice,
            isLong: isLong,
            collateral: collateral
        });

        emit PositionOpened(msg.sender, size, isLong);
    }

    function closePosition() external {
        require(positions[msg.sender].size != 0, "Position not open");
        delete positions[msg.sender];
        emit PositionClosed(msg.sender, 0); // PnL calculation will be added later
    }

    function liquidate(address user) external {
        uint256 marginRatio = _getMarginRatio(user);
        require(marginRatio < MAINTENANCE_MARGIN, "Position not liquidatable");

        // For the MVP, we just close the position.
        // A real implementation would have a liquidation penalty and a mechanism to handle the liquidated position.
        delete positions[user];
        emit Liquidated(user, msg.sender, 0);
    }

    function getPnl(address user) external view returns (int256) {
        return _getPnl(user);
    }

    function getMarginRatio(address user) external view returns (uint256) {
        return _getMarginRatio(user);
    }

    function _getPnl(address user) internal view returns (int256) {
        Position memory position = positions[user];
        if (position.size == 0) {
            return 0;
        }

        bytes32 domainId = keccak256("hackathon.doma"); // Hardcoded for MVP
        uint256 currentPrice = oracleAdapter.getPrice(domainId);

        int256 pnl;
        if (position.isLong) {
            pnl = (int256(currentPrice) - int256(position.entryPrice)) * int256(position.size) / int256(position.entryPrice);
        } else {
            pnl = (int256(position.entryPrice) - int256(currentPrice)) * int256(position.size) / int256(position.entryPrice);
        }
        return pnl;
    }

    function _getMarginRatio(address user) internal view returns (uint256) {
        Position memory position = positions[user];
        if (position.size == 0) {
            return 0;
        }

        int256 pnl = _getPnl(user);
        uint256 equity = uint256(int256(position.collateral) + pnl);

        return equity * 1e18 / position.size;
    }
}
