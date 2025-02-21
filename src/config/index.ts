// src/config/index.ts

export const CONFIG = {
  SUPPORTED_CHAINS: {
    SEPOLIA: {
      id: 11155111,
      name: "Sepolia",
      rpcUrl: "https://sepolia.infura.io/v3/YOUR_INFURA_KEY",
      explorerUrl: "https://sepolia.etherscan.io",
      bridgeAddress: "0xd92023E9d9911199a6711321D1277285e6d4e2db", // Arbitrum Sepolia Gateway
      nativeCurrency: {
        name: "Sepolia Ethereum",
        symbol: "ETH",
        decimals: 18,
      },
    },
    ARBITRUM_SEPOLIA: {
      id: 421614,
      name: "Arbitrum Sepolia",
      rpcUrl: "https://sepolia-rollup.arbitrum.io/rpc",
      explorerUrl: "https://sepolia.arbiscan.io",
      bridgeAddress: "0x0000000000000000000000000000000000000064", // Arbitrum Sepolia Inbox
      nativeCurrency: {
        name: "Arbitrum Sepolia Ethereum",
        symbol: "ETH",
        decimals: 18,
      },
    },
  },
  GAS_LIMIT_BUFFER: 20,
  MAX_SLIPPAGE: 2,
};
