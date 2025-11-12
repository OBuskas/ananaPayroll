require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const INFURA_KEY = process.env.INFURA_KEY || "";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "";

module.exports = {
  solidity: "0.8.20",
  networks: {
    hardhat: {},

    localhost: {
      url: "http://127.0.0.1:8545",
    },

    sepolia: {
      url: INFURA_KEY
        ? `https://sepolia.infura.io/v3/${INFURA_KEY}`
        : "",
      accounts: PRIVATE_KEY
        ? [`0x${PRIVATE_KEY.replace(/^0x/, "")}`]
        : [],
      chainId: 11155111,
    },
  },
  etherscan: {
  apiKey: {
    sepolia: process.env.ETHERSCAN_API_KEY
  }
}
};
