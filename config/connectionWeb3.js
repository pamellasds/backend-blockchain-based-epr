const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const abi = JSON.stringify([ { "constant": false, "inputs": [ { "name": "_idRegister", "type": "uint256" }, { "name": "_idHE", "type": "uint256" } ], "name": "allowAccess", "outputs": [ { "name": "", "type": "string" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "novoProprietario", "type": "address" } ], "name": "changeOwner", "outputs": [ { "name": "", "type": "string" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_idRegister", "type": "uint256" }, { "name": "_idHE", "type": "uint256" } ], "name": "denyAccess", "outputs": [ { "name": "", "type": "string" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_idRegister", "type": "uint256" }, { "name": "_idPatient", "type": "uint256" }, { "name": "_idHE", "type": "uint256" }, { "name": "link", "type": "string" } ], "name": "insertOwner", "outputs": [ { "name": "", "type": "string" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "payable": true, "stateMutability": "payable", "type": "fallback" }, { "constant": true, "inputs": [ { "name": "_idRegister", "type": "uint256" }, { "name": "_idUser", "type": "uint256" } ], "name": "checkAccess", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "_idRegister", "type": "uint256" }, { "name": "_idUser", "type": "uint256" } ], "name": "checkRecordOwner", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "proprietario", "outputs": [ { "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "_idRegister", "type": "uint256" }, { "name": "_idUser", "type": "uint256" } ], "name": "readRecord", "outputs": [ { "name": "", "type": "string" } ], "payable": false, "stateMutability": "view", "type": "function" } ]);
const contractAddress = "0x05f4872c8ab38c7e66bb191b4bd3ca9816383bc3"
const mnemonic = "xxxxxx" //ommited
const infura = 'https://rinkeby.infura.io/v3/59eb9f1e90104e8eac3b13b2e68c8059';

const provider = new HDWalletProvider(
      (mnemonic),
      (infura)
);
    
const web3 = new Web3(provider);    
const instance = new web3.eth.Contract(
        JSON.parse(abi),
        (contractAddress)
);

instance.setProvider(provider);
      
module.exports = {instance, web3};

