// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MockUSDC is ERC20, Ownable {
    uint8 private constant _DECIMALS = 6;
    
    constructor(uint256 initialSupply) ERC20("DomEx USDC", "dUSDC") Ownable(msg.sender) {
        _mint(msg.sender, initialSupply);
    }
    
    function decimals() public pure override returns (uint8) {
        return _DECIMALS;
    }
    
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
    
    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }
    
    function burnFrom(address from, uint256 amount) external {
        _burn(from, amount);
    }
    
    function faucet(address to, uint256 amount) external {
        _mint(to, amount);
    }
}
