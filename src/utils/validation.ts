// src/utils/validation.ts

import { ethers } from "ethers";

export class ValidationUtils {
  static isValidAmount(amount: string): boolean {
    try {
      const value = ethers.utils.parseEther(amount);
      return value.gt(0);
    } catch {
      return false;
    }
  }

  static async checkAllowance(
    tokenContract: ethers.Contract,
    owner: string,
    spender: string,
    amount: ethers.BigNumber
  ): Promise<boolean> {
    const allowance = await tokenContract.allowance(owner, spender);
    return allowance.gte(amount);
  }

  static async checkBalance(
    provider: ethers.providers.Provider,
    address: string,
    amount: ethers.BigNumber
  ): Promise<boolean> {
    const balance = await provider.getBalance(address);
    return balance.gte(amount);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static formatError(error: any): string {
    if (typeof error === "string") return error;

    if (error.code) {
      switch (error.code) {
        case 4001:
          return "Transaction rejected by user";
        case -32603:
          return "Internal JSON-RPC error. Please check your balance and try again";
        default:
          return error.message || "Unknown error occurred";
      }
    }

    return error.message || "An unexpected error occurred";
  }
}
