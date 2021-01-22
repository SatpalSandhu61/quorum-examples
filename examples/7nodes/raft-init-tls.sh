#!/bin/bash
set -u
set -e

function usage() {
  echo ""
  echo "Usage:"
  echo "    $0 [--numNodes numberOfNodes]"
  echo ""
  echo "Where:"
  echo "    numberOfNodes is the number of nodes to initialise (default = $numNodes)"
  echo ""
  exit -1
}

numNodes=7
while (( "$#" )); do
    case "$1" in
        --numNodes)
            re='^[0-9]+$'
            if ! [[ $2 =~ $re ]] ; then
                echo "ERROR: numberOfNodes value must be a number"
                usage
            fi
            numNodes=$2
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

echo "[*] Cleaning up temporary data directories"
rm -rf qdata
mkdir -p qdata/logs

echo "[*] Configuring for $numNodes node(s)"
echo $numNodes > qdata/numberOfNodes

permNodesFile=./permissioned-nodes-${numNodes}.json
./create-permissioned-nodes.sh $numNodes

numPermissionedNodes=`grep "enode" ${permNodesFile} |wc -l`
if [[ $numPermissionedNodes -ne $numNodes ]]; then
    echo "ERROR: $numPermissionedNodes nodes are configured in 'permissioned-nodes.json', but expecting configuration for $numNodes nodes"
    rm -f $permNodesFile
    exit -1
fi

for i in `seq 1 ${numNodes}`
do
    mkdir -p qdata/dd${i}/{keystore,geth}
    if [[ $i -le 4 ]]; then
        echo "[*] Configuring node $i (permissioned)"
        cp ${permNodesFile} qdata/dd${i}/permissioned-nodes.json
    elif ! [ -z "${STARTPERMISSION+x}" ] ; then
        echo "[*] Configuring node $i (permissioned)"
        cp  ${permNodesFile} qdata/dd${i}/permissioned-nodes.json
    else
        echo "[*] Configuring node $i"
    fi

    cp ${permNodesFile} qdata/dd${i}/static-nodes.json
    cp keys/key${i} qdata/dd${i}/keystore
    cp raft/nodekey${i} qdata/dd${i}/geth/nodekey
    geth --datadir qdata/dd${i} init genesis.json

    #Satpal: adding config file for txMgr IPC connection
    cat <<EOF > qdata/dd${i}/tx-IPC-config.toml
       	socket = "tm.ipc"
        workdir = "qdata/c${i}"
EOF
    #Satpal: adding config file for txMgr HTTP connection
    cat <<EOF > qdata/dd${i}/tx-HTTP-config.toml
       	httpUrl = "HTTP://127.0.0.1:910${i}"
       	tlsMode = "OFF"
EOF
    #Satpal: adding config file for txMgr HTTP TLS connection
    cat <<EOF > qdata/dd${i}/tx-TLS-config.toml
        httpUrl = "HTTPS://127.0.0.1:910${i}"
        tlsMode = "STRICT"
        tlsRootCA = "./mycerts/ca-root.cert.pem"
        tlsClientCert = "./mycerts/client-ca-chain.cert.pem"
        tlsClientKey = "./mycerts/client.key.pem"
EOF
done

#Initialise Tessera configuration
./tessera-init-tls.sh

#Initialise Cakeshop configuration
./cakeshop-init.sh

rm -f $permNodesFile
