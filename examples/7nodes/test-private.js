var testContract = web3.eth.contract([{"constant":false,"inputs":[{"name":"x","type":"uint256"}],"name":"setVal","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"getVal","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"}]);
var test = testContract.new(
{
from: web3.eth.accounts[0],
data: '0x608060405234801561001057600080fd5b5060da8061001f6000396000f3fe6080604052348015600f57600080fd5b5060043610604f576000357c0100000000000000000000000000000000000000000000000000000000900480633d4197f0146054578063e1cb0e5214607f575b600080fd5b607d60048036036020811015606857600080fd5b8101908080359060200190929190505050609b565b005b608560a5565b6040518082815260200191505060405180910390f35b8060008190555050565b6000805490509056fea165627a7a7230582005f10594205d7ba28e027bcdc96955b2fb4aa86b6c9c49023da2d457e63753340029',
gas: '4700000',
privateFor: ["ROAZBWtSacxXQrOe3FGAqJDyJjFePR5ce4TSIzmJ0Bc="]
}, function (e, contract){
console.log(e, contract);
if (typeof contract.address !== 'undefined') {
console.log('Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);
}
})
