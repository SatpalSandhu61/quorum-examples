#!/bin/bash
set -u
set -e

while [ 1 ]; do
  for i in {1..100}
  do
    ./runscript.sh "private-contract.js"
  done
  echo "PAUSE"
  sleep 5
done
