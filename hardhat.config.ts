import { HardhatUserConfig } from "hardhat/types";
import "@nomicfoundation/hardhat-toolbox";
import { config } from "dotenv";

// Load environment variables
config();

// Check that the required environment variables are set
if (
  !process.env.LOCAL_KEYS
  || !process.env.TESTNET_KEYS
  || !process.env.MAINNET_KEYS
) {
  throw new Error("some required keys are missing in the .env file");
}

const hardhatConfig: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    evmoslocal: {
      url: "http://127.0.0.1:8545",
      chainId: 9000,
      accounts: process.env.LOCAL_KEYS.split(","),
    },
    oslocal: {
      url: "http://127.0.0.1:8545",
      chainId: 9005,
      accounts: process.env.LOCAL_KEYS.split(","),
    },
    evmostestnet: {
      url: "https://evmos-testnet.lava.build",
      chainId: 9000,
      accounts: process.env.TESTNET_KEYS.split(","),
    },
    evmosmainnet: {
      url: "https://evmos.lava.build",
      chainId: 9001,
      accounts: process.env.MAINNET_KEYS.split(","),
    },
  },
};

export default hardhatConfig;
