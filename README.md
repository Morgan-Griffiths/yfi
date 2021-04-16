# yfi

private version of yfi

# Run local node

npx hardhat node

# Fork mainnet for testing

bash fork_mainnet.sh

# Deploy contract to local net

npx hardhat run --network localhost scripts/deploy.js

# Deploy contract to testnet net

npx hardhat run --network rinkeby scripts/deploy.js

# Extract token abi

npm run abi

# Interact from console

npx hardhat console --network localhost

# Programmatically interact with the contract

npx hardhat run --network localhost scripts/index.js

# Verify contract

npx hardhat verify --network mainnet DEPLOYED_CONTRACT_ADDRESS "Constructor argument 1"

# Test

npm test

# tsc watch

npx tsc --watch
