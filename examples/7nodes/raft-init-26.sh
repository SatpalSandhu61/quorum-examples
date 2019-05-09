#!/bin/bash
set -u
set -e

echo "[*] Cleaning up temporary data directories"
rm -rf qdata
mkdir -p qdata/logs

for i in {1..26}; do
  echo "[*] Configuring node $i"
  mkdir -p qdata/dd${i}/{keystore,geth}
  cp permissioned-nodes-26.json qdata/dd${i}/static-nodes.json
  cp permissioned-nodes-26.json qdata/dd1/
  if [ ${i} -lt 9 ]; then
    cp keys/key${i} qdata/dd${i}/keystore
  fi
  cp raft/nodekey${i} qdata/dd${i}/geth/nodekey
  geth --datadir qdata/dd${i} init genesis.json
done

#Initialise Tessera configuration
./tessera-init-26.sh
