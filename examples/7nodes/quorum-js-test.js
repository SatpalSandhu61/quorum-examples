const Web3 = require("web3");
const quorumjs = require("quorum-js");
const ethUtil = require("ethereumjs-util")

const privateKey = "ef6b5b4fc31fb5d6e7f76ef41fd535c911f6fb30ea4352ab0c4e596a174e139d" //some valid private key
const pk = "0xa9e871f88cbeb870d32d88e4221dcfbd36dd635a"
const pk1 = "ROAZBWtSacxXQrOe3FGAqJDyJjFePR5ce4TSIzmJ0Bc"
const h1 = "http://localhost:8545";
const contractBytecode = "0x6060604052341561000f57600080fd5b604051602080610149833981016040528080519060200190919050505b806000819055505b505b610104806100456000396000f30060606040526000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680632a1afcd914605157806360fe47b11460775780636d4ce63c146097575b600080fd5b3415605b57600080fd5b606160bd565b6040518082815260200191505060405180910390f35b3415608157600080fd5b6095600480803590602001909190505060c3565b005b341560a157600080fd5b60a760ce565b6040518082815260200191505060405180910390f35b60005481565b806000819055505b50565b6000805490505b905600a165627a7a72305820d5851baab720bba574474de3d09dbeaabc674a15f4dd93b974908476542c23f00029"
const w1 = new Web3(new Web3.providers.HttpProvider(h1));

const enclaveOptions = {
    /* at least one enclave option must be provided */
    /* ipcPath is preferred for utilizing older API */
    publicUrl: h1,
    privateUrl: h1
    };
const fromAccountAddress = '0x'+ethUtil.privateToAddress("0x"+privateKey).toString('hex');
const rawTransactionManager = quorumjs.RawTransactionManager(w1, enclaveOptions);
let nonceToUse = w1.eth.getTransactionCount(fromAccountAddress, 'pending');

    const txnParams = {
    gasPrice: 0,
    gasLimit: 4300000,
    to: "",
    value: 0,
    data: contractBytecode,
    arguments : [99],
    from: {
        privateKey:'0x'+privateKey
    },
    privateFrom: pk,
    privateFor: [pk1],
    nonce: nonceToUse,
    isPrivate:true
    };

const newTx = rawTransactionManager.sendRawTransaction(txnParams);
    newTx.then(function(error, tx){
    if(error)
        console.log("erro",error);
    else{
        console.log("Contract address: ", tx.contractAddress);
        get(tx.contractAddress);
    }    
  }).catch(function(err){
        console.log(err); //Error coming from here!!
  });
