export HASHICORP_SECRET_ID=5b010f4b-c103-ba75-0385-4c52c3ce47fc
export HASHICORP_ROLE_ID=2dd6c6d3-202c-606b-a6bb-0d9e0f65acdb

geth account plugin import --plugins file://./geth-plugin-settings.json --plugins.account.config file://./newacct.json --plugins.skipverify $*
