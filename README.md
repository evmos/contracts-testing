# Evmos Contracts Testing

This a basic Hardhat project that contains scripts to test contracts
and EVM extensions in the Evmos chain.

## Example

To stake some tokens, follow these steps:

- create a `.env` file with your private key/s
- send some funds to your account
- run a node locally. Can use the `local_node.sh` on evmos repo.
- edit the corresponding validator address in the `scripts/stake.js`
- run the following command: `npx hardhat run scripts/stake.js --network evmoslocal`
- you can run the scripts against testnet or mainnet too. Just use the `--network` flag and specify `evmostestnet` or `evmosmainnet` accordingly
