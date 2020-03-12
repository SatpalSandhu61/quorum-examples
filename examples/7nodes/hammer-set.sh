#!/bin/bash
set -u
set -e

function createScript() {
    cat <<EOF > hammer-set-temp.js
        //Set up contract using ABI and specified contract address
        contractAddress = "0x1932c48b2bf8102ba33b4a6b545c32236e342f34"

        a = eth.accounts[0]
        web3.eth.defaultAccount = a;

        // abi and bytecode generated from simplestorage.sol:
        // > solcjs --bin --abi simplestorage.sol
        var abi = [{"constant":true,"inputs":[],"name":"storedData","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"x","type":"uint256"}],"name":"set","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"get","outputs":[{"name":"retVal","type":"uint256"}],"payable":false,"type":"function"},{"inputs":[{"name":"initVal","type":"uint256"}],"payable":false,"type":"constructor"}];

        var simpleContract = web3.eth.contract(abi);
        var simple = simpleContract.at(contractAddress);
        simple.set($1)
EOF

}

count=511
while [ 1 ]; do
  for i in {1..100}
  do
    count=`expr $count + 1`
    echo $count
    createScript $count
    ./runscript.sh "hammer-set-temp.js"
  done
  echo "PAUSE"
  sleep 5
done
