//Set up contract using ABI and specified contract address
contractAddress = "0x1932c48b2bf8102ba33b4a6b545c32236e342f34"
//contractAddress = "0x9d13c6d3afe1721beef56b55d303b09e021e27ab"
//contractAddress = "0x8a5e2a6343108babed07899510fb42297938d41f"
//contractAddress = "0xfe0602d820f42800e3ef3f89e1c39cd15f78d283"
//contractAddress = "0x3950943d8d86267c04a4bba804f9f0b8a01c2fb8"

//contractAddress = "0x1349f3e1b8d71effb47b840594ff27da7e603d17"

a = eth.accounts[0]
web3.eth.defaultAccount = a;

// abi and bytecode generated from simplestorage.sol:
// > solcjs --bin --abi simplestorage.sol
var abi = [{"constant":true,"inputs":[],"name":"storedData","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"x","type":"uint256"}],"name":"set","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"get","outputs":[{"name":"retVal","type":"uint256"}],"payable":false,"type":"function"},{"inputs":[{"name":"initVal","type":"uint256"}],"payable":false,"type":"constructor"}];

var simpleContract = web3.eth.contract(abi);
var simple = simpleContract.at(contractAddress);
