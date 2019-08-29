a = eth.accounts[0]
web3.eth.defaultAccount = a;

// abi and bytecode generated from simplestorage.sol with the addition of an event being generated:
// > solcjs --bin --abi simplestorage.sol
var abi = [{"constant":true,"inputs":[],"name":"storedData","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"x","type":"uint256"}],"name":"set","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"get","outputs":[{"name":"retVal","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"initVal","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"dep","type":"string"},{"indexed":false,"name":"depart","type":"uint256"},{"indexed":false,"name":"arr","type":"string"},{"indexed":false,"name":"arrive","type":"uint256"}],"name":"changement","type":"event"}];

var bytecode = "0x608060405234801561001057600080fd5b506040516020806102378339810180604052602081101561003057600080fd5b810190808051906020019092919050505080600081905550506101df806100586000396000f3fe608060405260043610610051576000357c0100000000000000000000000000000000000000000000000000000000900480632a1afcd91461005657806360fe47b1146100815780636d4ce63c146100bc575b600080fd5b34801561006257600080fd5b5061006b6100e7565b6040518082815260200191505060405180910390f35b34801561008d57600080fd5b506100ba600480360360208110156100a457600080fd5b81019080803590602001909291905050506100ed565b005b3480156100c857600080fd5b506100d16101aa565b6040518082815260200191505060405180910390f35b60005481565b7f8711f42ca804a6886dcc4960d3e65c51961117bd2fa5c065d5a92920971f17cf60005482604051808060200184815260200180602001848152602001838103835260118152602001807f4176616e74206368616e67656d656e743a000000000000000000000000000000815250602001838103825260128152602001807f617072c3a873206368616e67656d656e743a000000000000000000000000000081525060200194505050505060405180910390a18060008190555050565b6000805490509056fea165627a7a7230582097535b76dad04afdf23d216a34be7846b0bfcd656edc7946fcfb17a612ca48320029";

var simpleContract = web3.eth.contract(abi);
var simple = simpleContract.new(42, {from:web3.eth.accounts[0], data: bytecode, gas: 0x47b760}, function(e, contract) {
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
