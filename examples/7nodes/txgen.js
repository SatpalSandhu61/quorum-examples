const DotEnv = require('dotenv').config();
const EthereumTx = require('ethereumjs-tx');
const Solc = require('solc');
const Fs = require('fs');
const Web3 = require('web3');

// Various config options
const numTxPerBlock = parseInt(process.env.TX_PER_BLOCK);
const blockCreationIntervalMs = parseInt(process.env.BLOCK_CREATION_INTERVAL_IN_MS);
const interTxSendIntervalMs = parseInt(process.env.INTER_TX_SEND_INTERVAL_IN_MS);
const createContract = parseInt(process.env.CREATE_CONTRACT);
const sendTransactions = parseInt(process.env.SEND_TRANSACTIONS);
const txNodeURL = process.env.TX_NODE_URL;
var perfTestAddress = process.env.PERF_TEST_ADDRESS;
var exchangeAddress1 = process.env.EXCHANGE_ADDRESS_1;
var exchangeAddress2 = process.env.EXCHANGE_ADDRESS_2;

// Global variables
var currentNonce;
var numTxCreated = 0;
var perfTestContract;
var exchangeContract1;
var exchangeContract2;
var perfTestStateChangeCallData;
var exchangeStateChangeCallData;
var perfTestStateChangeCallGasEstimate;
var exchangeStateChangeCallGasEstimate;
var txGenerationInterval;
var latestCreatedContractAddress;

// Connect to Westlake Tx Node
var web3 = new Web3(new Web3.providers.HttpProvider(txNodeURL));

// Compile PerfTest smart contract
var input = Fs.readFileSync('PERFTEST.sol', 'UTF-8');
var output = Solc.compile(input, 1);
const perfTestBytecode = output.contracts[':PerfTest'].bytecode;
const perfTestAbi = JSON.parse(output.contracts[':PerfTest'].interface);

// Compile the mainnet exchange contract
input = Fs.readFileSync('IDEX.sol', 'UTF-8');
output = Solc.compile(input, 1);
const exchangeBytecode = output.contracts[':Exchange'].bytecode;
const exchangeAbi = JSON.parse(output.contracts[':Exchange'].interface);

const accountAddress = process.env.ACCOUNT_ADDRESS_IN_HEX;
const privateKey = Buffer.from(process.env.PRIVATE_KEY_IN_HEX, 'hex');

// The slightly convoluted logic below is to ensure we don't send transactions before the contract is created
if (createContract) {
    initialContractCreation().then(function() {
        if (sendTransactions) {
            submitTransactions().catch((e) => {
                console.log('Failed to send transactions due to error: ' + e);
                process.exitCode = 1;
            });
        }
    }).catch((e) => {
        console.log('Failed to create contract due to error: ' + e);
        process.exitCode = 1;
    });
} else if (sendTransactions) {
    submitTransactions().catch((e) => {
        console.log('Failed to send transactions due to error: ' + e);
        process.exitCode = 1;
    });
} else {
    console.log('Neither CREATE_CONTRACT nor SEND_TRANSACTIONS was enabled so no action was taken');
    process.exitCode = 1;
}

async function initialContractCreation() {
    console.log('Fetching current nonce for account: ' + accountAddress);
    try {
        // Account setup
        var accountNonce = await web3.eth.getTransactionCount(accountAddress);
        console.log('Current account nonce is: ' + accountNonce);

        // Set up our perftest contract deployment parameters
        var deployContractCreationTxParams = {
            nonce: accountNonce,
            gasPrice: '0x0',
            gasLimit: '0x5B8D80',
            value: '0x00',
            data: '0x' + perfTestBytecode
        };

        // Deploy the perftest contract
        var deployContractCreationTx = new EthereumTx(deployContractCreationTxParams);
        deployContractCreationTx.sign(privateKey);
        console.log('Submitting perftest contract creation tx with tx params: ' + JSON.stringify(deployContractCreationTxParams));
        var receipt = await web3.eth.sendSignedTransaction('0x' + deployContractCreationTx.serialize().toString('hex'));
        perfTestAddress = receipt.contractAddress;
        latestCreatedContractAddress = perfTestAddress;
        console.log('Perftest contract address is ' + perfTestAddress);
        perfTestContract = new web3.eth.Contract(perfTestAbi, perfTestAddress);
        perfTestStateChangeCallData = perfTestContract.methods.stateChange().encodeABI();

        // Increase account nonce
        accountNonce++;

        // Set up our exchange contract deployment parameters
        deployContractCreationTxParams = {
            nonce: accountNonce,
            gasPrice: '0x0',
            gasLimit: '0x5B8D80',
            value: '0x00',
            data: '0x' + exchangeBytecode
        };

        // Deploy the exchange contract
        deployContractCreationTx = new EthereumTx(deployContractCreationTxParams);
        deployContractCreationTx.sign(privateKey);
        console.log('Submitting exchange contract creation tx with tx params: ' + JSON.stringify(deployContractCreationTxParams));
        receipt = await web3.eth.sendSignedTransaction('0x' + deployContractCreationTx.serialize().toString('hex'));
        exchangeAddress1 = receipt.contractAddress;
        console.log('Exchange contract address is ' + exchangeAddress1);
        exchangeContract1 = new web3.eth.Contract(exchangeAbi, exchangeAddress1);
        exchangeStateChangeCallData = exchangeContract1.methods.TestCall().encodeABI();

        // Increase account nonce
        accountNonce++;

        // Set up our second exchange contract deployment parameters
        deployContractCreationTxParams = {
            nonce: accountNonce,
            gasPrice: '0x0',
            gasLimit: '0x5B8D80',
            value: '0x00',
            data: '0x' + exchangeBytecode
        };

        // Deploy the second exchange contract
        deployContractCreationTx = new EthereumTx(deployContractCreationTxParams);
        deployContractCreationTx.sign(privateKey);
        console.log('Submitting exchange contract creation tx with tx params: ' + JSON.stringify(deployContractCreationTxParams));
        receipt = await web3.eth.sendSignedTransaction('0x' + deployContractCreationTx.serialize().toString('hex'));
        exchangeAddress2 = receipt.contractAddress;
        console.log('Exchange contract address is ' + exchangeAddress2);
        exchangeContract2 = new web3.eth.Contract(exchangeAbi, exchangeAddress2);
    } catch(e) {
        console.log('Contract creation failed');
        throw e;
    }
}

async function submitTransactions() {
    // Estimate gas
    try {
        // Estimate gas for perftest
        perfTestContract = new web3.eth.Contract(perfTestAbi, perfTestAddress);
        perfTestStateChangeCallData = perfTestContract.methods.stateChange().encodeABI();
        var perfTestGasEstimate = await perfTestContract.methods.stateChange().estimateGas();
        // Double the estimate to ensure it's sufficient since the function changes a different data type with each call.
        perfTestStateChangeCallGasEstimate = web3.utils.numberToHex(2 * perfTestGasEstimate);
        console.log('Gas estimate for perfTest stateChange() is: ' + perfTestStateChangeCallGasEstimate);

        // Estimate gas for exchange
        exchangeContract1 = new web3.eth.Contract(exchangeAbi, exchangeAddress1);
        exchangeStateChangeCallData = exchangeContract1.methods.TestCall().encodeABI();
        var exchangeGasEstimate = await exchangeContract1.methods.TestCall().estimateGas();
        // Double the estimate to ensure it's sufficient since the function changes a different data type with each call.
        exchangeStateChangeCallGasEstimate = web3.utils.numberToHex(2 * exchangeGasEstimate);
        console.log('Gas estimate for exchange stateChange() is: ' + exchangeStateChangeCallGasEstimate);
    } catch(e) {
        console.log('Gas estimation failed');
        throw e;
    }

    // Get transaction count of sending account
    try {
        var nonce = await web3.eth.getTransactionCount(accountAddress);
        currentNonce = nonce;
        console.log('Current nonce for account ' + accountAddress + 'is: ' + currentNonce);
    } catch(e) {
        console.log('Getting transaction count failed');
        throw e;
    }

    // Schedule sending of transactions in batches such that they fit into blocks in even batches
    txGenerationInterval = setInterval(submitTransactionBatch, blockCreationIntervalMs);
}

function submitTransactionBatch() {
    // This logic assumes that all txs submitted the previous batch were accepted into the pending queue
    // If this is not the case, the nonce will be wrong and a gap will remain in the pending queue.  Re-run this
    // program to fil the gap and resume as normal
    for (var i = 0; i < numTxPerBlock; i++) {
        setTimeout(() => {
            // Create perftest transactions
            console.log('Creating perftest tx using contract address ' + perfTestAddress + ' and nonce set to: ' + currentNonce);
            var txParams = {
                nonce: currentNonce++,
                gasPrice: '0x0',
                gas: perfTestStateChangeCallGasEstimate,
                to: perfTestAddress,
                data: perfTestStateChangeCallData
            };
            var deployTx = new EthereumTx(txParams);
            deployTx.sign(privateKey);
            web3.eth.sendSignedTransaction('0x' + deployTx.serialize().toString('hex'))
                .on('receipt', (receipt) => {
                    console.log('Tx receipt received for perftest Tx Hash ' + receipt.transactionHash
                        + ' in block number ' + receipt.blockNumber);
                })
                .catch((e) => {
                    console.log('Perftest transaction submission failed: ' + e);
                });

            // Create first exchange transactions
            console.log('Creating exchange1 tx with nonce set to: ' + currentNonce);
            txParams = {
                nonce: currentNonce++,
                gasPrice: '0x0',
                gas: exchangeStateChangeCallGasEstimate,
                to: exchangeAddress1,
                data: exchangeStateChangeCallData
            };
            deployTx = new EthereumTx(txParams);
            deployTx.sign(privateKey);
            web3.eth.sendSignedTransaction('0x' + deployTx.serialize().toString('hex'))
                .on('receipt', (receipt) => {
                    console.log('Tx receipt received for exchange1 Tx Hash ' + receipt.transactionHash
                        + ' in block number ' + receipt.blockNumber);
                })
                .catch((e) => {
                    console.log('Exchange1 transaction submission failed: ' + e);
                });

            // Create second exchange transactions
            console.log('Creating exchange2 tx with nonce set to: ' + currentNonce);
            txParams = {
                nonce: currentNonce++,
                gasPrice: '0x0',
                gas: exchangeStateChangeCallGasEstimate,
                to: exchangeAddress2,
                data: exchangeStateChangeCallData
            };
            deployTx = new EthereumTx(txParams);
            deployTx.sign(privateKey);
            web3.eth.sendSignedTransaction('0x' + deployTx.serialize().toString('hex'))
                .on('receipt', (receipt) => {
                    console.log('Tx receipt received for exchange2 Tx Hash ' + receipt.transactionHash
                        + ' in block number ' + receipt.blockNumber);
                })
                .catch((e) => {
                    console.log('Exchange2 transaction submission failed: ' + e);
                });

            // Create transactions for recently created contract
            console.log('Creating recently created contract tx using contract addess ' + perfTestAddress + ' and nonce set to: ' + currentNonce);
            txParams = {
                nonce: currentNonce++,
                gasPrice: '0x0',
                gas: perfTestStateChangeCallGasEstimate,
                to: latestCreatedContractAddress,
                data: perfTestStateChangeCallData
            };
            deployTx = new EthereumTx(txParams);
            deployTx.sign(privateKey);
            web3.eth.sendSignedTransaction('0x' + deployTx.serialize().toString('hex'))
                .on('receipt', (receipt) => {
                    console.log('Tx receipt received for recently created contract Tx Hash ' + receipt.transactionHash
                                + ' in block number ' + receipt.blockNumber);
                })
                .catch((e) => {
                    console.log('Recently created contract transaction submission failed: ' + e);
                });

            // Create contract depoyment transactions
            console.log('Creating contract creation tx with nonce set to: ' + currentNonce);
            txParams = {
                nonce: currentNonce++,
                gasPrice: '0x0',
                gasLimit: '0x5B8D80',
                value: '0x00',
                data: '0x' + perfTestBytecode
            };
            deployTx = new EthereumTx(txParams);
            deployTx.sign(privateKey);
            web3.eth.sendSignedTransaction('0x' + deployTx.serialize().toString('hex'))
                .on('receipt', (receipt) => {
                    console.log('Tx receipt received for contract creation Tx Hash ' + receipt.transactionHash
                        + ' in block number ' + receipt.blockNumber);
                    latestCreatedContractAddress = receipt.contractAddress;
                })
                .catch((e) => {
                    console.log('Contract creation transaction submission failed: ' + e);
                });

        }, interTxSendIntervalMs*i);
    }
}

