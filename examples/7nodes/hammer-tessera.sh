#!/bin/bash
set -u
set -e

while [ 1 ]; do
  echo "LOOP"
  for i in {1..4}
  do
    curl --unix-socket qdata/c1/tm.ipc --request POST  --url http://localhost:8080/sendraw   --header 'c11n-to: QfeDAys9MPDs2XHExtc84jKGHxZg/aj52DTh0vtA3Xc='  --header 'content-type: application/octet-stream'  --data Zm9vgkdffor6478r6iughghfk &
  done
  sleep 1
done
