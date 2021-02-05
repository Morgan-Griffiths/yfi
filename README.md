# yfi
private version of yfi

# Run local node
npx hardhat node

# Deploy contract to local net
npx hardhat run --network localhost scripts/deploy.js

# Interact from console
npx hardhat console --network localhost

# Programmatically interact with the contract
npx hardhat run --network localhost scripts/index.js

# Verify contract 
npx hardhat verify --network mainnet DEPLOYED_CONTRACT_ADDRESS "Constructor argument 1"

# Test
npm test

# tsc watch
npm run watch