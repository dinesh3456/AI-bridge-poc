// src/services/BridgeAIAgent/types.ts

export interface BridgeRequest {
  amount: string;
  sourceChain: string;
  targetChain: string;
}

export interface BridgeResponse {
  status: "success" | "error";
  message: string;
  txHash?: string;
  userInstructions?: string;
}

export interface ChainConfig {
  id: number;
  name: string;
  bridgeAddress: string;
  currency: string;
}

export interface WalletInfo {
  address: string;
  chainId: number;
  connected: boolean;
}
