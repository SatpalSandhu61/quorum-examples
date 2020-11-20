//Generate the bytecode for an abi function call

var web3 = require('web3');

web3= new web3();
fromAddr = '0xed9d02e382b34818e88b88a309c7fe71e65f419d';

var data = web3.eth.abi.encodeFunctionCall({ name: 'setVal', type: 'function',inputs: [{type: 'uint256',name: 'x'}]}, ['15']);
console.log(data);
