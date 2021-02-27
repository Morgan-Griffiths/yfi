#!/bin/bash
source .env

for (( ; ; ))
do
    pkill -f "node /usr/local/bin/npx"
    npx hardhat node --fork https://mainnet.infura.io/v3/$INFURA_PROJECT_ID
    sleep 2
    # node getSomeEth.js;
    # wait for < 30 mins
    # sleep 1750
done