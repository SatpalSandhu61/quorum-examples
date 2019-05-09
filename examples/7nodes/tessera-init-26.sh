#!/usr/bin/env bash

echo "[*] Initialising Tessera configuration"

currentDir=$(pwd)
for i in {1..26}
do
    DDIR="${currentDir}/qdata/c${i}"
    mkdir -p ${DDIR}
    mkdir -p qdata/logs
    cp "keys/tm${i}.pub" "${DDIR}/tm.pub"
    cp "keys/tm${i}.key" "${DDIR}/tm.key"
    rm -f "${DDIR}/tm.ipc"

    serverPort=`expr 9000 + ${i}`
    #change tls to "strict" to enable it (don't forget to also change http -> https)
    cat <<EOF > ${DDIR}/tessera-config${i}.json
{
    "useWhiteList": false,
    "jdbc": {
        "username": "sa",
        "password": "",
        "url": "jdbc:h2:${DDIR}/db${i};MODE=Oracle;TRACE_LEVEL_SYSTEM_OUT=0"
    },
    "server": {
        "port": ${serverPort},
        "hostName": "http://localhost",
        "sslConfig": {
            "tls": "OFF",
            "generateKeyStoreIfNotExisted": true,
            "serverKeyStore": "${DDIR}/server${i}-keystore",
            "serverKeyStorePassword": "quorum",
            "serverTrustStore": "${DDIR}/server-truststore",
            "serverTrustStorePassword": "quorum",
            "serverTrustMode": "TOFU",
            "knownClientsFile": "${DDIR}/knownClients",
            "clientKeyStore": "${DDIR}/client${i}-keystore",
            "clientKeyStorePassword": "quorum",
            "clientTrustStore": "${DDIR}/client-truststore",
            "clientTrustStorePassword": "quorum",
            "clientTrustMode": "TOFU",
            "knownServersFile": "${DDIR}/knownServers"
        }
    },
    "peer": [
        {
            "url": "http://localhost:9001"
        },
        {
            "url": "http://localhost:9002"
        },
        {
            "url": "http://localhost:9003"
        },
        {
            "url": "http://localhost:9004"
        },
        {
            "url": "http://localhost:9005"
        },
        {
            "url": "http://localhost:9006"
        },
        {
            "url": "http://localhost:9007"
        },
        {
            "url": "http://localhost:9008"
        },
        {
            "url": "http://localhost:9009"
        },
        {
            "url": "http://localhost:9010"
        },
        {
            "url": "http://localhost:9011"
        },
        {
            "url": "http://localhost:9012"
        },
        {
            "url": "http://localhost:9013"
        },
        {
            "url": "http://localhost:9014"
        },
        {
            "url": "http://localhost:9015"
        },
        {
            "url": "http://localhost:9016"
        },
        {
            "url": "http://localhost:9017"
        },
        {
            "url": "http://localhost:9018"
        },
        {
            "url": "http://localhost:9019"
        },
        {
            "url": "http://localhost:9020"
        },
        {
            "url": "http://localhost:9021"
        },
        {
            "url": "http://localhost:9022"
        },
        {
            "url": "http://localhost:9023"
        },
        {
            "url": "http://localhost:9024"
        },
        {
            "url": "http://localhost:9025"
        },
        {
            "url": "http://localhost:9026"
        }
    ],
    "keys": {
        "passwords": [],
        "keyData": [
            {
                "privateKeyPath": "${DDIR}/tm.key",
                "publicKeyPath": "${DDIR}/tm.pub"
            }
        ]
    },
    "alwaysSendTo": [],
    "unixSocketFile": "${DDIR}/tm.ipc"
}
EOF

done
