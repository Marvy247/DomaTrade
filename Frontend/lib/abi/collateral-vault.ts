export const collateralVaultABI = [{
    "type": "constructor",
    "inputs": [{
        "name": "_collateralToken",
        "type": "address",
        "internalType": "address"
    }],
    "stateMutability": "nonpayable"
}, {
    "type": "function",
    "name": "collateralToken",
    "inputs": [],
    "outputs": [{
        "name": "",
        "type": "address",
        "internalType": "contract IERC20"
    }],
    "stateMutability": "view"
}, {
    "type": "function",
    "name": "deposit",
    "inputs": [{
        "name": "amount",
        "type": "uint256",
        "internalType": "uint256"
    }],
    "outputs": [],
    "stateMutability": "nonpayable"
}, {
    "type": "function",
    "name": "deposits",
    "inputs": [{
        "name": "",
        "type": "address",
        "internalType": "address"
    }],
    "outputs": [{
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
    }],
    "stateMutability": "view"
}, {
    "type": "function",
    "name": "withdraw",
    "inputs": [{
        "name": "amount",
        "type": "uint256",
        "internalType": "uint256"
    }],
    "outputs": [],
    "stateMutability": "nonpayable"
}, {
    "type": "event",
    "name": "Deposited",
    "inputs": [{
        "name": "user",
        "type": "address",
        "indexed": true,
        "internalType": "address"
    }, {
        "name": "amount",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
    }],
    "anonymous": false
}, {
    "type": "event",
    "name": "Withdrawn",
    "inputs": [{
        "name": "user",
        "type": "address",
        "indexed": true,
        "internalType": "address"
    }, {
        "name": "amount",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
    }],
    "anonymous": false
}, {
    "type": "error",
    "name": "ReentrancyGuardReentrantCall",
    "inputs": []
}] as const;