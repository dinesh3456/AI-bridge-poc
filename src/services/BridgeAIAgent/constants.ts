// src/services/BridgeAIAgent/constants.ts

export const CHAIN_CONFIGS = {
  SEPOLIA: {
    id: 11155111,
    name: "Sepolia",
    bridgeAddress: "0xd92023E9d9911199a6711321D1277285e6d4e2db",
    currency: "ETH",
  },
  ARBITRUM_SEPOLIA: {
    id: 421614,
    name: "Arbitrum Sepolia",
    bridgeAddress: "0x0000000000000000000000000000000000000064",
    currency: "ETH",
  },
} as const;

// ABI for Arbitrum Gateway on Sepolia
export const BRIDGE_ABI = [
  "function depositEth() public payable returns(uint256)",
  "function outboundTransfer(address _l1Token, address _to, uint256 _amount, bytes calldata _data) external payable returns (bytes memory)",
];
