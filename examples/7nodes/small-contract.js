a = eth.accounts[0]
web3.eth.defaultAccount = a;

var abi = [ { "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "payable": true, "stateMutability": "payable", "type": "fallback" } ];

var bytecode = "0x60606040523415600e57600080fd5b603280601b6000396000f30060606040520000a165627a7a7230582065da7b5c49df2fa01bd48172b88c59123ef3a084a987e6ce03fbdef303b840af0029";

var simpleContract = web3.eth.contract(abi);
var simple = simpleContract.new(42, {from:web3.eth.accounts[0], data: bytecode, gas: 0x47b760, privateFor: ["ROAZBWtSacxXQrOe3FGAqJDyJjFePR5ce4TSIzmJ0Bc="]}, function(e, contract) {
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
