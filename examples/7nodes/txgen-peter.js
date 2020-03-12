const EthereumTx = require('ethereumjs-tx');
const Solc = require('solc');
const Fs = require('fs');
const Web3 = require('web3');
const RLP = require('rlp');

// Various config options
const totalToMake = 1000000;
const numTxPerBlock = 10;
const txNodeURL = 'http://35.176.125.217:22000';
var perfTestAddress = process.env.PERF_TEST_ADDRESS;
var exchangeAddress1 = process.env.EXCHANGE_ADDRESS_1;
var exchangeAddress2 = process.env.EXCHANGE_ADDRESS_2;

// Global variables
var currentNonce;
var perfTestContract;
var exchangeContract1;
var exchangeContract2;
var perfTestStateChangeCallData;
var exchangeStateChangeCallData;
var perfTestStateChangeCallGasEstimate;
var exchangeStateChangeCallGasEstimate;
var latestCreatedContractAddress;

// Connect to Westlake Tx Node
var web3 = new Web3(new Web3.providers.HttpProvider(txNodeURL));

// Compile PerfTest smart contract
var output = Solc.compile(Fs.readFileSync('PERFTEST.sol', 'UTF-8'), 1);
const perfTestBytecode = '0x608060405234801561001057600080fd5b506108b3806100206000396000f3006080604052600436106101105763ffffffff7c0100000000000000000000000000000000000000000000000000000000600035041662e5561d811461011557806308cb3b531461013c5780630dd8ec2f146101535780631d18423314610168578063262330b41461017d5780632b723b7f146101bb57806336aacafa146101d057806343ae41d8146101f9578063463f5c30146102325780635de24c671461024a57806361bc221a1461025f578063855f8df71461027457806398ca733a146102895780639b3874b11461029e578063a5526277146102b6578063bd85e7b4146102cb578063da9020d2146102e0578063ddc5e6d4146102f5578063e3850c3d1461030a578063fb8f0f591461031f575b600080fd5b34801561012157600080fd5b5061012a6103a9565b60408051918252519081900360200190f35b34801561014857600080fd5b506101516103af565b005b34801561015f57600080fd5b506101516103ed565b34801561017457600080fd5b5061012a610436565b34801561018957600080fd5b5061019261043c565b6040805173ffffffffffffffffffffffffffffffffffffffff9092168252519081900360200190f35b3480156101c757600080fd5b50610151610458565b3480156101dc57600080fd5b506101e561046f565b604080519115158252519081900360200190f35b34801561020557600080fd5b5061020e610478565b6040518082600381111561021e57fe5b60ff16815260200191505060405180910390f35b34801561023e57600080fd5b5061012a600435610481565b34801561025657600080fd5b50610151610495565b34801561026b57600080fd5b5061012a6104a9565b34801561028057600080fd5b506101516104af565b34801561029557600080fd5b506101516105a4565b3480156102aa57600080fd5b5061012a600435610678565b3480156102c257600080fd5b5061015161068a565b3480156102d757600080fd5b50610151610695565b3480156102ec57600080fd5b506101516106c2565b34801561030157600080fd5b50610151610740565b34801561031657600080fd5b5061012a610758565b34801561032b57600080fd5b5061033461075e565b6040805160208082528351818301528351919283929083019185019080838360005b8381101561036e578181015183820152602001610356565b50505050905090810190601f16801561039b5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b60015481565b6003805473ffffffffffffffffffffffffffffffffffffffff8082166001011673ffffffffffffffffffffffffffffffffffffffff19909116179055565b60065460049060ff16600381111561040157fe5b60010181151561040d57fe5b06600381111561041957fe5b6006805460ff1916600183600381111561042f57fe5b0217905550565b60045481565b60035473ffffffffffffffffffffffffffffffffffffffff1681565b60074381811691826008811061046a57fe5b015550565b60005460ff1681565b60065460ff1681565b6007816008811061048e57fe5b0154905081565b6000805460ff19811660ff90911615179055565b60105481565b6005604051602001808280546001816001161561010002031660029004801561050f5780601f106104ed57610100808354040283529182019161050f565b820191906000526020600020905b8154815290600101906020018083116104fb575b50509150506040516020818303038152906040526040518082805190602001908083835b602083106105525780518252601f199092019160209182019101610533565b51815160209384036101000a6000190180199092169116179052604080519290940182900382208282015283518083038201815291840190935280516105a195506005945092019190506107ec565b50565b6010805460010190819055600990068015156105c2576105c2610495565b80600114156105d3576105d3610695565b80600214156105e4576105e461068a565b80600314156105f5576105f56103af565b8060041415610606576106066106c2565b8060051415610617576106176104af565b8060061415610628576106286103ed565b806007141561063957610639610458565b806008141561064a5761064a610740565b60405181907f49628ca47affc2c0364f092b96d5c6037157da8dd90c96c281f775bd576a45b990600090a250565b600f6020526000908152604090205481565b600280546001019055565b600060015412156106b05760018054600003810190556106c0565b6001546001016000036001819055505b565b6004546040805160208082019390935281518082038401815290820191829052805190928291908401908083835b6020831061070f5780518252601f1990920191602091820191016106f0565b5181516020939093036101000a60001901801990911692169190911790526040519201829003909120600455505050565b436000908152600f6020526040902080546001019055565b60025481565b6005805460408051602060026001851615610100026000190190941693909304601f810184900484028201840190925281815292918301828280156107e45780601f106107b9576101008083540402835291602001916107e4565b820191906000526020600020905b8154815290600101906020018083116107c757829003601f168201915b505050505081565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061082d57805160ff191683800117855561085a565b8280016001018555821561085a579182015b8281111561085a57825182559160200191906001019061083f565b5061086692915061086a565b5090565b61088491905b808211156108665760008155600101610870565b905600a165627a7a723058209d6839cf1b041497d98504be2b04369d4f887ec48f56470fd7e941daf19e83d80029' //'0x' + output.contracts[':PerfTest'].bytecode;
const perfTestAbi = JSON.parse(output.contracts[':PerfTest'].interface);

// Compile the mainnet exchange contract
output = Solc.compile(Fs.readFileSync('IDEX.sol', 'UTF-8'), 1);
const exchangeBytecode = '0x' + output.contracts[':Exchange'].bytecode;
const exchangeAbi = JSON.parse(output.contracts[':Exchange'].interface);

//const accountAddress = "0xed9d02e382b34818e88b88a309c7fe71e65f419d";
const accountAddress = "0x0638e1574728b6d862dd5d3a3e0942c3be47d996";
//const privateKey = Buffer.from("e6181caaffff94a09d7e332fc8da9884d99902c7874eb74354bdcadf411929f1", 'hex');
const privateKey = Buffer.from("30bee17b2b8b1e774115f785e92474027d45d900a12a9d5d99af637c2d1a61bd", 'hex');

// The slightly convoluted logic below is to ensure we don't send transactions before the contract is created
initialContractCreation().then(function() {
    submitTransactions().catch((e) => {
        console.log('Failed to send transactions due to error: ' + e);
        process.exitCode = 1;
    });
}).catch((e) => {
    console.log('Failed to create contract due to error: ' + e);
    process.exitCode = 1;
});

async function initialContractCreation() {
    // Account setup
    currentNonce = 0;

    // Set up our perftest contract deployment parameters
    let deployContractCreationTxParams = {
        nonce: currentNonce,
        gasPrice: '0x0',
        gasLimit: '0x5B8D80',
        value: '0x00',
        data: perfTestBytecode
    };

    // Deploy the perftest contract
    let deployContractCreationTx = createTx(deployContractCreationTxParams);
    let serialisedOutput = '0x' + deployContractCreationTx.serialize().toString('hex');
    console.log(serialisedOutput);
    perfTestAddress = generateAddress(deployContractCreationTx);
    latestCreatedContractAddress = perfTestAddress;
    perfTestContract = new web3.eth.Contract(perfTestAbi, perfTestAddress);
    perfTestStateChangeCallData = perfTestContract.methods.stateChange().encodeABI();

    // Set up our exchange contract deployment parameters
    deployContractCreationTxParams = {
        nonce: currentNonce++,
        gasPrice: '0x0',
        gasLimit: '0x5B8D80',
        value: '0x00',
        data: exchangeBytecode
    };

    // Deploy the exchange contract
    deployContractCreationTx = createTx(deployContractCreationTxParams);
    let serialisedOutput2 ='0x' + deployContractCreationTx.serialize().toString('hex');
    console.log(serialisedOutput2);
    exchangeAddress1 = generateAddress(deployContractCreationTx);
    exchangeContract1 = new web3.eth.Contract(exchangeAbi, exchangeAddress1);
    exchangeStateChangeCallData = exchangeContract1.methods.TestCall().encodeABI();

    // Set up our second exchange contract deployment parameters
    deployContractCreationTxParams = {
        nonce: currentNonce++,
        gasPrice: '0x0',
        gasLimit: '0x5B8D80',
        value: '0x00',
        data: exchangeBytecode
    };

    // Deploy the second exchange contract
    deployContractCreationTx = createTx(deployContractCreationTxParams);
    let serialisedOutput3 ='0x' + deployContractCreationTx.serialize().toString('hex');
    console.log(serialisedOutput3);
    exchangeAddress2 = generateAddress(deployContractCreationTx);
    exchangeContract2 = new web3.eth.Contract(exchangeAbi, exchangeAddress2);
}

async function submitTransactions() {
    // Estimate gas for perftest
    perfTestContract = new web3.eth.Contract(perfTestAbi, perfTestAddress);
    perfTestStateChangeCallData = perfTestContract.methods.stateChange().encodeABI();
    var perfTestGasEstimate = 1000000; //await perfTestContract.methods.stateChange().estimateGas();
    // Double the estimate to ensure it's sufficient since the function changes a different data type with each call.
    perfTestStateChangeCallGasEstimate = web3.utils.numberToHex(2 * perfTestGasEstimate);

    // Estimate gas for exchange
    exchangeContract1 = new web3.eth.Contract(exchangeAbi, exchangeAddress1);
    exchangeStateChangeCallData = exchangeContract1.methods.TestCall().encodeABI();
    var exchangeGasEstimate = 1000000; //await exchangeContract1.methods.TestCall().estimateGas();
    // Double the estimate to ensure it's sufficient since the function changes a different data type with each call.
    exchangeStateChangeCallGasEstimate = web3.utils.numberToHex(2 * exchangeGasEstimate);

    // Schedule sending of transactions in batches such that they fit into blocks in even batches
    // txGenerationInterval = setInterval(submitTransactionBatch, blockCreationIntervalMs);
    for (var i=0; i<totalToMake/(numTxPerBlock*5); i++) {
        submitTransactionBatch();
    }
}

function submitTransactionBatch() {
    // This logic assumes that all txs submitted the previous batch were accepted into the pending queue
    // If this is not the case, the nonce will be wrong and a gap will remain in the pending queue.  Re-run this
    // program to fil the gap and resume as normal
    for (var i = 0; i < numTxPerBlock; i++) {
        // Create perftest transactions
        var txParams = {
            nonce: currentNonce++,
            gasPrice: '0x0',
            gas: perfTestStateChangeCallGasEstimate,
            to: perfTestAddress,
            data: perfTestStateChangeCallData
        };
        var deployTx = createTx(txParams);
        let tx1 = '0x' + deployTx.serialize().toString('hex');
        console.log(tx1);

        // Create first exchange transactions
        txParams = {
            nonce: currentNonce++,
            gasPrice: '0x0',
            gas: exchangeStateChangeCallGasEstimate,
            to: exchangeAddress1,
            data: exchangeStateChangeCallData
        };
        deployTx = createTx(txParams);
        let tx2 = '0x' + deployTx.serialize().toString('hex');
        console.log(tx2);

        // Create second exchange transactions
        txParams = {
            nonce: currentNonce++,
            gasPrice: '0x0',
            gas: exchangeStateChangeCallGasEstimate,
            to: exchangeAddress2,
            data: exchangeStateChangeCallData
        };
        deployTx = createTx(txParams);
        let tx3 = '0x' + deployTx.serialize().toString('hex');
        console.log(tx3);

        // Create transactions for recently created contract
        txParams = {
            nonce: currentNonce++,
            gasPrice: '0x0',
            gas: perfTestStateChangeCallGasEstimate,
            to: latestCreatedContractAddress,
            data: perfTestStateChangeCallData
        };
        deployTx = createTx(txParams);
        let tx4 = '0x' + deployTx.serialize().toString('hex');
        console.log(tx4);

        // Create contract depoyment transactions
        txParams = {
            nonce: currentNonce++,
            gasPrice: '0x0',
            gasLimit: '0x5B8D80',
            value: '0x00',
            data: perfTestBytecode
        };
        deployTx = createTx(txParams);
        latestCreatedContractAddress = generateAddress(deployTx);
        let tx5 = '0x' + deployTx.serialize().toString('hex');
        console.log(tx5);
    }
}

function createTx(params) {
    let deployContractCreationTx = new EthereumTx(params);
    deployContractCreationTx.sign(privateKey);
    return deployContractCreationTx
}

function generateAddress(tx) {
    return "0x" + web3.utils.sha3(RLP.encode([tx.getSenderAddress(), tx.nonce])).slice(12).substring(14)
}
