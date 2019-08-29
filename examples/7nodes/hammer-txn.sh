#!/bin/bash
set -u
set -e

gasCount=100000
while [ 1 ]; do
  for i in {1..100}
  do
    gasCount=`expr $gasCount + 1`
    echo Sending $i with $gasCount gas
    geth attach qdata/dd1/geth.ipc --exec "eth.sendTransaction({from:eth.coinbase, from: \"0xed9d02e382b34818e88b88a309c7fe71e65f419d\", to: \"0xca843569e3427144cead5e4d5999a3d0ccf92b8e\", value: 1, gas:$gasCount })"
    sleep 1
  done
  echo "PAUSE"
  sleep 5
done
