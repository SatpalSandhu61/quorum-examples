echo -n "curl -X GET -H \"Content-Type: application/json\" --data '[ "
for i in {1..1000}; do
  hex=`printf "%x" $i`
  if [[ "$i" -eq "1000" ]]; then
    eol="]"
  else
    eol=","
  fi
  echo -n "{\"jsonrpc\":\"2.0\",\"id\":2,\"method\":\"eth_getBlockByNumber\",\"params\":[\"0x${hex}\",true]}${eol}"
done
echo "' http://localhost:22000"
