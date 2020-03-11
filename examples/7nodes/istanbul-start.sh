#!/bin/bash
set -u
set -e

function usage() {
  echo ""
  echo "Usage:"
  echo "    $0 [tessera | tessera-remote | constellation] [--tesseraOptions \"options for Tessera start script\"]"
  echo ""
  echo "Where:"
  echo "    tessera | tessera-remote | constellation (default = tessera): specifies which privacy implementation to use"
  echo "    --tesseraOptions: allows additional options as documented in tessera-start.sh usage which is shown below:"
  echo ""
  echo "Note that this script will examine the file qdata/numberOfNodes to"
  echo "determine how many nodes to start up. If the file doesn't exist"
  echo "then 7 nodes will be assumed"
  echo ""
  ./tessera-start.sh --help
  exit -1
}

privacyImpl=tessera
tesseraOptions=
while (( "$#" )); do
    case "$1" in
        tessera)
            privacyImpl=tessera
            shift
            ;;
        constellation)
            privacyImpl=constellation
            shift
            ;;
        tessera-remote)
            privacyImpl="tessera-remote"
            shift
            ;;
        --tesseraOptions)
            tesseraOptions=$2
            shift 2
            ;;
        --help)
            shift
            usage
            ;;
        *)
            echo "Error: Unsupported command line parameter $1"
            usage
            ;;
    esac
done

# Perform any necessary validation
performValidation istanbul-genesis.json

mkdir -p qdata/logs

numNodes=7
if [[ -f qdata/numberOfNodes ]]; then
    numNodes=`cat qdata/numberOfNodes`
fi

if [ "$privacyImpl" == "tessera" ]; then
  echo "[*] Starting Tessera nodes"
  ./tessera-start.sh ${tesseraOptions}
elif [ "$privacyImpl" == "constellation" ]; then
  echo "[*] Starting Constellation nodes"
  ./constellation-start.sh
elif [ "$privacyImpl" == "tessera-remote" ]; then
  echo "[*] Starting tessera nodes"
  ./tessera-start-remote.sh ${tesseraOptions}
else
  echo "Unsupported privacy implementation: ${privacyImpl}"
  usage
fi

echo "[*] Starting ${numNodes} Ethereum nodes with ChainID and NetworkId of $NETWORK_ID"
QUORUM_GETH_ARGS=${QUORUM_GETH_ARGS:-}
set -v
ARGS="--nodiscover --istanbul.blockperiod 5 --networkid $NETWORK_ID --syncmode full --mine --minerthreads 1 --rpc --rpccorsdomain \"*\" --rpcvhosts \"*\" --rpcaddr 0.0.0.0 --rpcapi admin,db,eth,debug,miner,net,shh,txpool,personal,web3,quorum,istanbul $QUORUM_GETH_ARGS"
echo "--datadir qdata/dd1 $ARGS --rpcport 22000 --port 21000 --unlock 0 --password passwords.txt" | PRIVATE_CONFIG=qdata/c1/tm.ipc xargs nohup geth 2>>qdata/logs/1.log &
echo "--datadir qdata/dd2 $ARGS --rpcport 22001 --port 21001 --unlock 0 --password passwords.txt" | PRIVATE_CONFIG=qdata/c2/tm.ipc xargs nohup geth 2>>qdata/logs/2.log &
echo "--datadir qdata/dd3 $ARGS --rpcport 22002 --port 21002 --unlock 0 --password passwords.txt" | PRIVATE_CONFIG=qdata/c3/tm.ipc xargs nohup geth 2>>qdata/logs/3.log &
echo "--datadir qdata/dd4 $ARGS --rpcport 22003 --port 21003 --unlock 0 --password passwords.txt" | PRIVATE_CONFIG=qdata/c4/tm.ipc xargs nohup geth 2>>qdata/logs/4.log &
echo "--datadir qdata/dd5 $ARGS --rpcport 22004 --port 21004 --unlock 0 --password passwords.txt" | PRIVATE_CONFIG=qdata/c5/tm.ipc xargs nohup geth 2>>qdata/logs/5.log &
echo "--datadir qdata/dd6 $ARGS --rpcport 22005 --port 21005 --unlock 0 --password passwords.txt" | PRIVATE_CONFIG=qdata/c6/tm.ipc xargs nohup geth 2>>qdata/logs/6.log &
echo "--datadir qdata/dd7 $ARGS --rpcport 22006 --port 21006 --unlock 0 --password passwords.txt" | PRIVATE_CONFIG=qdata/c7/tm.ipc xargs nohup geth 2>>qdata/logs/7.log &
set +v

echo
echo "All nodes configured. See 'qdata/logs' for logs, and run e.g. 'geth attach qdata/dd1/geth.ipc' to attach to the first Geth node."
echo "To test sending a private transaction from Node 1 to Node 7, run './runscript.sh private-contract.js'"

exit 0
