/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/BridgeAIAgent/index.ts

import { ethers } from "ethers";
import { CHAIN_CONFIGS, BRIDGE_ABI } from "./constants";
import type { BridgeRequest, BridgeResponse, WalletInfo } from "./types";

export class BridgeAIAgent {
  private provider: ethers.providers.Web3Provider | null = null;

  setProvider(provider: ethers.providers.Web3Provider) {
    this.provider = provider;
  }

  private async validateProvider(): Promise<void> {
    if (!this.provider) {
      throw new Error("Please install MetaMask or another Web3 wallet");
    }
  }

  async connectWallet(): Promise<WalletInfo> {
    await this.validateProvider();

    const accounts = await this.provider!.send("eth_requestAccounts", []);
    const network = await this.provider!.getNetwork();

    return {
      address: accounts[0],
      chainId: network.chainId,
      connected: true,
    };
  }

  async validateNetwork(expectedChainId: number): Promise<void> {
    await this.validateProvider();

    const network = await this.provider!.getNetwork();
    if (network.chainId !== expectedChainId) {
      try {
        if (window.ethereum) {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: `0x${expectedChainId.toString(16)}` }],
          });
        } else {
          throw new Error("Ethereum object not found in window");
        }
      } catch (error: any) {
        if (error.code === 4902) {
          await window.ethereum!.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: `0x${expectedChainId.toString(16)}`,
                chainName:
                  expectedChainId === CHAIN_CONFIGS.SEPOLIA.id
                    ? "Sepolia"
                    : "Arbitrum Sepolia",
                rpcUrls: [
                  expectedChainId === CHAIN_CONFIGS.SEPOLIA.id
                    ? "https://sepolia.infura.io/v3/YOUR_INFURA_KEY"
                    : "https://sepolia-rollup.arbitrum.io/rpc",
                ],
                nativeCurrency: {
                  name: "ETH",
                  symbol: "ETH",
                  decimals: 18,
                },
                blockExplorerUrls: [
                  expectedChainId === CHAIN_CONFIGS.SEPOLIA.id
                    ? "https://sepolia.etherscan.io"
                    : "https://sepolia.arbiscan.io",
                ],
              },
            ],
          });
        } else {
          throw new Error(
            `Please switch to ${
              expectedChainId === CHAIN_CONFIGS.SEPOLIA.id
                ? "Sepolia"
                : "Arbitrum Sepolia"
            } network`
          );
        }
      }
    }
  }

  parseUserIntent(userInput: string): BridgeRequest {
    const amountMatch = userInput.match(/(\d+\.?\d*)/);
    if (!amountMatch) {
      throw new Error(
        "Could not determine the amount to bridge. Please specify an amount like '0.001'"
      );
    }

    return {
      amount: amountMatch[1],
      sourceChain: "SEPOLIA",
      targetChain: "ARBITRUM_SEPOLIA",
    };
  }

  async handleBridgeRequest(userInput: string): Promise<BridgeResponse> {
    try {
      const { amount } = this.parseUserIntent(userInput);
      await this.connectWallet();
      await this.validateNetwork(CHAIN_CONFIGS.SEPOLIA.id);

      const bridgeContract = new ethers.Contract(
        CHAIN_CONFIGS.SEPOLIA.bridgeAddress,
        BRIDGE_ABI,
        this.provider!.getSigner()
      );

      const amountWei = ethers.utils.parseEther(amount);

      const tx = await bridgeContract.depositEth({
        value: amountWei,
        gasLimit: 300000,
      });

      return {
        status: "success",
        message: "Bridge transaction initiated",
        txHash: tx.hash,
        userInstructions: `
          1. Transaction sent to bridge contract
          2. Wait for confirmation on Sepolia (usually 2-5 minutes)
          3. Funds will appear on Arbitrum Sepolia automatically
          Track your transaction: https://sepolia.etherscan.io/tx/${tx.hash}
        `,
      };
    } catch (error: any) {
      console.error("Bridge error:", error);
      return {
        status: "error",
        message: this.formatError(error),
        userInstructions: "Please try again or use the manual bridge interface",
      };
    }
  }

  private formatError(error: any): string {
    if (typeof error === "string") return error;

    if (error.code) {
      switch (error.code) {
        case 4001:
          return "Transaction rejected by user";
        case -32603:
          return "Internal JSON-RPC error. Please check your balance and try again";
        default:
          if (error.message?.includes("insufficient funds")) {
            return "Insufficient funds for transaction";
          }
          return error.message || "Unknown error occurred";
      }
    }

    return error.message || "An unexpected error occurred";
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new BridgeAIAgent();
