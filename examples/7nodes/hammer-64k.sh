#!/bin/bash
set -u
set -e

for i in {1..64}
do
  for j in {1..1024}
  do
    ./runscript-5.sh "public-contract.js" 1>&2
  done
  echo "PAUSE on block $i"
  sleep 5
done
