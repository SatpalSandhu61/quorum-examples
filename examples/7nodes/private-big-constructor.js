//pragma solidity ^0.5.0;
//contract Test1 {
//
//    uint256 public count=0;
//
//    function test() public {
//        uint256 localCount=0;
//        while (localCount < 10000) {
//            localCount = localCount + 1;
//            count = count + 1;
//        }
//    }
//
//    function get() view public returns (uint256){
//        return count;
//    }
//
//    constructor() public {
//        count=0;
//        uint256 localCount=0;
//        while (localCount < 10000) {
//            localCount = localCount +1;
//            count = count + 1;
//        }
//    }
//}

a = eth.accounts[0]
web3.eth.defaultAccount = a;

var contractAbi = [{"constant":true,"inputs":[],"name":"count","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"get","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"test","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"}];

var contractBytecode = "0x60806040526000805534801561001457600080fd5b506000808190555060008090505b61271081101561004357600181019050600160005401600081905550610022565b5061011f806100536000396000f3fe6080604052600436106053576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806306661abd1460585780636d4ce63c146080578063f8a8fd6d1460a8575b600080fd5b348015606357600080fd5b50606a60bc565b6040518082815260200191505060405180910390f35b348015608b57600080fd5b50609260c2565b6040518082815260200191505060405180910390f35b34801560b357600080fd5b5060ba60cb565b005b60005481565b60008054905090565b60008090505b61271081101560f05760018101905060016000540160008190555060d1565b5056fea165627a7a723058208eee9059cdb6e7440ec6b5e3a04efb58f96df466327319e7b9b415cb370cc2b40029";

var contract = web3.eth.contract(contractAbi).new({from:web3.eth.accounts[0], data: contractBytecode, gas: 100000000, privateFor: ["ROAZBWtSacxXQrOe3FGAqJDyJjFePR5ce4TSIzmJ0Bc="]}, function(e, contract) {
        if (e) {
                console.log("err creating contract", e);
        } else {
                if (!contract.address) {
                        console.log("Contract transaction send: TransactionHash: " + contract.transactionHash + " waiting to be mined...");
                } else {
                        console.log("Contract mined! Address: " + contract.address);
                        console.log(contract);
                }
        }
});
