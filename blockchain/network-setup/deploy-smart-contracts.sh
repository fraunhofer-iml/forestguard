#!/bin/sh
echo "### STARTING deployment of the Token smart contract ###"

./wait-for-it.sh blockchain-network:8545 --timeout=20 --strict -- echo "### blockchain-network is up ###"

cd nft-folder-smart-contracts || exit
npm install
npm run token-deploy-dev

echo "### FINISHED deployment of the Token smart contract ###"
