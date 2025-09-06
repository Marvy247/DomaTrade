export const oracleAdapterABI = [{
    "type": "constructor",
    "inputs": [],
    "stateMutability": "nonpayable"
}, {
    "type": "function",
    "name": "getPrice",
    "inputs": [{
        "name": "domainId",
        "type": "bytes32",
        "internalType": "bytes32"
    }],
    "outputs": [{
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
    }],
    "stateMutability": "view"
}, {
    "type": "function",
    "name": "owner",
    "inputs": [],
    "outputs": [{
        "name": "",
        "type": "address",
        "internalType": "address"
    }],
    "stateMutability": "view"
}, {
    "type": "function",
    "name": "prices",
    "inputs": [{
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
    }],
    "outputs": [{
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
    }],
    "stateMutability": "view"
}, {
    "type": "function",
    "name": "renounceOwnership",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
}, {
    "type": "function",
    "name": "setPrice",
    "inputs": [{
        "name": "domainId",
        "type": "bytes32",
        "internalType": "bytes32"
    }, {
        "name": "price",
        "type": "uint256",
        "internalType": "uint256"
    }],
    "outputs": [],
    "stateMutability": "nonpayable"
}, {
    "type": "function",
    "name": "transferOwnership",
    "inputs": [{
        "name": "newOwner",
        "type": "address",
        "internalType": "address"
    }],
    "outputs": [],
    "stateMutability": "nonpayable"
}, {
    "type": "event",
    "name": "OwnershipTransferred",
    "inputs": [{
        "name": "previousOwner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
    }, {
        "name": "newOwner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
    }],
    "anonymous": false
}, {
    "type": "event",
    "name": "PriceUpdated",
    "inputs": [{
        "name": "domainId",
        "type": "bytes32",
        "indexed": true,
        "internalType": "bytes32"
    }, {
        "name": "newPrice",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
    }],
    "anonymous": false
}, {
    "type": "error",
    "name": "OwnableInvalidOwner",
    "inputs": [{
        "name": "owner",
        "type": "address",
        "internalType": "address"
    }]
}, {
    "type": "error",
    "name": "OwnableUnauthorizedAccount",
    "inputs": [{
        "name": "account",
        "type": "address",
        "internalType": "address"
    }]
}] as const;