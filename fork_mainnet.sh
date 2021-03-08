#!/bin/bash
source .env

for (( ; ; ))
do
    pkill -f "node /usr/local/bin/npx"
    npx hardhat node --fork https://mainnet.infura.io/v3/$INFURA_PROJECT_ID
    # wait for < 30 mins
    sleep 875
done